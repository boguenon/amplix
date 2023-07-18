#include <stdio.h>
#include <math.h>

#include <R.h>
#include <Rversion.h>
#include <Rinternals.h>
#include <R_ext/Rdynload.h>
#include <R_ext/GraphicsEngine.h>
#include <R_ext/GraphicsDevice.h>

#if R_VERSION >= R_Version(2,8,0)
#ifndef NewDevDesc
#define NewDevDesc DevDesc
#endif
#endif

// #define ING_PLOT_DEBUG 1

#define CREDC(C) (((unsigned int)(C))&0xff)
#define CGREENC(C) ((((unsigned int)(C))&0xff00)>>8)
#define CBLUEC(C) ((((unsigned int)(C))&0xff0000)>>16)
#define CALPHA(C) ((((unsigned int)(C))&0xff000000)>>24)

typedef enum {false, true} bool;

#define amplixplotColor(fp, prop, col) { if (CALPHA(col)==255) { fprintf(fp, ", \"%s\": \"rgb(%d,%d,%d)\" ", prop, CREDC(col), CGREENC(col), CBLUEC(col)); } else { fprintf(fp, ", \"%s\": \"rgba(%d,%d,%d,%f)\" ", prop, CREDC(col), CGREENC(col), CBLUEC(col), ((double)CALPHA(col))/255.); }; }

typedef struct _amplixplotDesc 
{
	/* device specific stuff */
	int col;
	int fill;

	/* Line characteristics */
	double lwd;
	int lty;
	R_GE_lineend lend;
	R_GE_linejoin ljoin;
	double lmitre;


	FILE *fp;
	pGEDevDesc RGE;
} amplixplotDesc;

static int g_width;
static int g_height;
static bool g_page = false;

static int g_fontwidth = 6;

static void amplixplotSetLineType( amplixplotDesc *cGD, pGEcontext gc)
{
	// fprintf(cGD->fp, ", {\"c\": \"linetype\"");
	/* Line width */
	if (cGD->lwd != gc->lwd)
	{
		cGD->lwd = gc->lwd;
		fprintf(cGD->fp,",\"lw\": %f ",cGD->lwd);
	}

	/* Line end: par lend  */
	if (cGD->lend != gc->lend)
	{
		cGD->lend = gc->lend;
		if (cGD->lend == GE_ROUND_CAP)
			fprintf(cGD->fp,",\"lc\":\"round\" ");
		if (cGD->lend == GE_BUTT_CAP)
			fprintf(cGD->fp,",\"lc\":\"butt\" ");
		if (cGD->lend == GE_SQUARE_CAP)
			fprintf(cGD->fp,",\"lc\":\"square\" ");
	}

	/* Line join: par ljoin */
	if (cGD->ljoin != gc->ljoin)
	{
		cGD->ljoin = gc->ljoin;
		if (cGD->ljoin == GE_ROUND_JOIN)
			fprintf(cGD->fp,",\"lj\":\"round\" ");
		if (cGD->ljoin == GE_MITRE_JOIN)
			fprintf(cGD->fp,",\"lj\":\"miter\" ");
		if (cGD->ljoin == GE_BEVEL_JOIN)
			fprintf(cGD->fp,",\"lj\":\"bevel\" ");
	}

	/* Miter limit */
	if (cGD->lmitre != gc->lmitre){
		cGD->lmitre = gc->lmitre;
		fprintf(cGD->fp,",\"ml\":%f ",cGD->lmitre);
	}
	// fprintf(cGD->fp,"}");
}

static void amplixplotActivate(const pDevDesc RGD)
{ 
	amplixplotDesc *cGD = (amplixplotDesc *)RGD->deviceSpecific;
	fprintf(cGD->fp,"{\"w\":%d,\"h\":%d,\"gr\":[{\"c\":\"n\"}", g_width, g_height);
	g_page = false;
#ifdef ING_PLOT_DEBUG
	Rprintf("Activate(RGD=0x%x)\n",RGD);
#endif
}

static void amplixplotCircle(double x, double y, double r, const pGEcontext gc, pDevDesc RGD)
{
	amplixplotDesc *cGD = (amplixplotDesc *)RGD->deviceSpecific;

	fprintf(cGD->fp,",\n{\"c\":\"c\"");
    // fprintf(cGD->fp,", \"cx\": %f,\"cy\": %f, \"r\": %f,0,Math.PI*2,true); ", x, y, r);
    fprintf(cGD->fp,",\"cx\":%d,\"cy\":%d,\"r\":%d", (int)x, (int)y, (int)r);
	if (CALPHA(gc->fill)){
		amplixplotColor(cGD->fp,"fs",gc->fill);
		//fprintf(cGD->fp,"ctx.fill(); ");
	}
	if (CALPHA(gc->col) && gc->lty!=-1){
		amplixplotSetLineType(cGD,gc);
		amplixplotColor(cGD->fp,"ss",gc->col);
		//fprintf(cGD->fp,"ctx.stroke();");
	}
	fprintf(cGD->fp,"}");

#ifdef amplixPLOTDEBUG
	Rprintf("//Circle(x=%f,y=%f,r=%f,gc=0x%x,RGD=0x%x)\n",x,y,r,gc,RGD);
	/*Rprintf("\tuser coords: x=%f,y=%f\n",fromDeviceX(x,GE_NDC,MGD->RGE),fromDeviceY(y,GE_NDC,MGD->RGE));*/
#endif
}

static void amplixplotClip(double x0, double x1, double y0, double y1, pDevDesc RGD)
{
	amplixplotDesc *cGD = (amplixplotDesc *)RGD->deviceSpecific;

	/* Too complicated to implement at the moment. The jist is that the context 
	 * save()/restore() functions save not only the clip region but the current
	 * transformation matrix and fill and stroke styles.
	 */
/*    if (x1<x0) { double h=x1; x1=x0; x0=h; };
    if (y1<y0) { double h=y1; y1=y0; y0=h; };

	if (RGD->left == x0 && RGD->right == x1 && RGD->top == y0 && RGD->bottom == y1){
		fprintf(cGD->fp,"ctx.restore();\n");
	} else {
		fprintf(cGD->fp,"ctx.rect(%f,%f,%f,%f); ",x0,y0,x1-x0,y1-y0);
		fprintf(cGD->fp,"ctx.clip();\n");
	}*/
	if (x1<x0) { double h=x1; x1=x0; x0=h; };
	if (y1<y0) { double h=y1; y1=y0; y0=h; };
	
	if (RGD->left == x0 && RGD->right == x1 && RGD->top == y0 && RGD->bottom == y1)
	{
		fprintf(cGD->fp,", {\"c\":\"rc\",\"data\":\"\"}");
	} 
	else 
	{
		fprintf(cGD->fp,", {\"c\":\"cr\",\"x\":%d,\"y\":%d,\"w\":%d,\"h\":%d}", (int)x0,(int)y0,(int)(x1-x0),(int)(y1-y0));
		// fprintf(cGD->fp,"ctx.rect(%f,%f,%f,%f); ",x0,y0,x1-x0,y1-y0);
		// fprintf(cGD->fp,"ctx.clip();\n");
	}
#ifdef ING_PLOT_DEBUG
	Rprintf("Clip(x0=%f,y0=%f,x1=%f,y1=%f,RGD=0x%x)\n",x0,y0,x1,y1,RGD);
#endif
}

static void amplixplotClose(pDevDesc RGD)
{
	amplixplotDesc *cGD = (amplixplotDesc *)RGD->deviceSpecific;
	if (g_page == true)
	{
		fprintf(cGD->fp,"]} \n");
	}
	fprintf(cGD->fp,"]}");
	/* Save plot */
	fclose(cGD->fp);
	free(cGD);
	RGD->deviceSpecific = NULL;
	g_page = false;
#ifdef ING_PLOT_DEBUG
	Rprintf("Close(RGD=0x%x)\n",RGD);
#endif
}

static void amplixplotDeactivate(pDevDesc RGD)
{
#ifdef ING_PLOT_DEBUG
	Rprintf("Deactivate(RGD=0x%x)\n",RGD);
#endif
}
static Rboolean amplixplotLocator(double *x, double *y, pDevDesc RGD)
{
#ifdef ING_PLOT_DEBUG
	Rprintf("Locator(x=%f,y=%f,RGD=0x%x)\n",x,y,RGD);
#endif
}

static void amplixplotLine(double x1, double y1, double x2, double y2, const pGEcontext gc, pDevDesc RGD)
{
	amplixplotDesc *cGD = (amplixplotDesc *)RGD->deviceSpecific;
	fprintf(cGD->fp,", \n{\"c\":\"l\"");
	fprintf(cGD->fp,", \"x1\":%d,\"y1\":%d,\"x2\":%d,\"y2\":%d",(int)x1,(int)y1,(int)x2,(int)y2);
	if (CALPHA(gc->col) && gc->lty!=-1)
	{
		amplixplotSetLineType(cGD,gc);
		amplixplotColor(cGD->fp,"ss",gc->col);
	}
	else
	{
		fprintf(cGD->fp,",\"lw\": %f ",cGD->lwd);
		amplixplotColor(cGD->fp,"ss",gc->col);
	}
	fprintf(cGD->fp,"}");

#ifdef ING_PLOT_DEBUG
	Rprintf("//Line(x0=%f,y0=%f,x1=%f,y1=%f,gc=0x%x,RGD=0x%x)\n",x1,y1,x2,y2,gc,RGD);
#endif
}

static void amplixplotMetricInfo(int c, const pGEcontext gc, double* ascent, double* descent, double* width, pDevDesc RGD)
{

	/* Unsure if we'll be able to provide this, as this relies entirely on the fonts
	 * installed on the browser system
	 */
	*ascent = *descent = *width = 0.0;
	*ascent = g_fontwidth*0.8;
	*descent = g_fontwidth * 0.2;
	*width = g_fontwidth;
#ifdef ING_PLOT_DEBUG
	Rprintf("MetricInfo(c=%d,gc=0x%x,ascent=%f,descent=%f,width=%f,RGD=0x%x)\n",c,gc,*ascent,*descent,*width,RGD);
#endif
}

static void amplixplotMode(int mode, pDevDesc RGD)
{
#ifdef ING_PLOT_DEBUG
	Rprintf("Mode(mode=%d,RGD=0x%x)\n",mode,RGD);
#endif
}

static void amplixplotNewPage(const pGEcontext gc, pDevDesc RGD)
{
	amplixplotDesc *cGD = (amplixplotDesc *)RGD->deviceSpecific;
	// fprintf(cGD->fp,"//NewPage\n");

	/* Set background only if we have a color */
	/*
	if (CALPHA(gc->fill)){
		amplixplotColor(cGD->fp,"fs",gc->fill);
		fprintf(cGD->fp,"ctx.fillRect(0,0,%f,%f);\n",RGD->right,RGD->bottom);
	}
	*/
	if (g_page == true)
	{
		fprintf(cGD->fp, "]} \n");
	}
	fprintf(cGD->fp, ", \n{\"c\":\"pg\",\"data\":[{\"c\":\"n\"}");
	g_page = true;
#ifdef ING_PLOT_DEBUG
	Rprintf("NewPage(gc=0x%x,RGD=0x%x)\n",gc,RGD);
#endif
}

static void amplixplotPolygon(int n, double *x, double *y, const pGEcontext gc, pDevDesc RGD)
{
	int i=1;
	amplixplotDesc *cGD = (amplixplotDesc *)RGD->deviceSpecific;

	if(n<2) return;

	fprintf(cGD->fp,", \n{\"c\":\"po\",\"data\":\"M%d,%d",(int)x[0],(int)y[0]);
	while (i<n) 
	{ 
		fprintf(cGD->fp,"L%d,%d", (int)x[i], (int)y[i]); i++; 
	}
	fprintf(cGD->fp,"Z\"");
	if (CALPHA(gc->fill)) 
	{
		amplixplotColor(cGD->fp,"fs",gc->fill);
		// fprintf(cGD->fp,"ctx.fill(); ");
	}
	if (CALPHA(gc->col) && gc->lty!=-1) 
	{
		amplixplotColor(cGD->fp,"ss",gc->col);
		// fprintf(cGD->fp,"ctx.stroke(); ");
	}
	amplixplotSetLineType(cGD,gc);
	fprintf(cGD->fp,"}");
#ifdef ING_PLOT_DEBUG
	{ 
		int i=0;
		Rprintf("//Polygon(n=%d,x=0x%x,y=0x%x,gc=0x%x,RGD=0x%x)\n\t//points: ",n,x,y,gc,RGD);
		while(i<n)
		{ 
			Rprintf("(%.2f,%.2f) ",x[i],y[i]); i++;
		}; 
		Rprintf("\n");
	}
#endif
}

static void amplixplotPolyline(int n, double *x, double *y, const pGEcontext gc, pDevDesc RGD)
{
	int i=1;
	amplixplotDesc *cGD = (amplixplotDesc *)RGD->deviceSpecific;

	if (n<2) return;

	if (CALPHA(gc->col) && gc->lty!=-1) 
	{
		fprintf(cGD->fp,", \n{\"c\":\"pl\",\"data\":\"M%d,%d",(int)x[0],(int)y[0]);
		double px = x[0];
		double py = y[0];
		while(i<n) 
		{
			if (abs(px - x[i]) > 4 || abs(py - y[i]) > 4 || i == n-1)
			{
				fprintf(cGD->fp,"L%d,%d",(int)x[i], (int)y[i]);
				px = x[i];
				py = y[i];
			}
			i++; 
		}
		fprintf(cGD->fp,"\"");
		amplixplotSetLineType(cGD,gc);
		amplixplotColor(cGD->fp,"ss",gc->col);
		// fprintf(cGD->fp,"ctx.stroke();\n");
		fprintf(cGD->fp,"}");
	}
#ifdef ING_PLOT_DEBUG
	{ 
		int i=0;
		Rprintf("//Polyline(n=%d,x=0x%x,y=0x%x,gc=0x%x,RGD=0x%x)\n\t//points: ",n,x,y,gc,RGD);
		while(i<n)
		{ 
			Rprintf("(%.2f,%.2f) ",x[i],y[i]); i++;
		} 
		Rprintf("\n");
	}
#endif
}

static void amplixplotRect(double x0, double y0, double x1, double y1, const pGEcontext gc, pDevDesc RGD)
{
	amplixplotDesc *cGD = (amplixplotDesc *)RGD->deviceSpecific;
	if (CALPHA(gc->fill))
	{
		fprintf(cGD->fp,", \n{\"c\":\"r\",\"x\":%d,\"y\":%d,\"w\":%d,\"h\":%d ",(int)x0,(int)y0,(int)(x1-x0),(int)(y1-y0));
		amplixplotColor(cGD->fp,"fs",gc->fill);
		fprintf(cGD->fp,"}");
	}
	if (CALPHA(gc->col) && gc->lty!=-1)
	{
		fprintf(cGD->fp,", \n{\"c\":\"r\",\"x\":%d,\"y\":%d,\"w\":%d,\"h\":%d ",(int)x0,(int)y0,(int)(x1-x0),(int)(y1-y0));
		amplixplotSetLineType(cGD,gc);
		amplixplotColor(cGD->fp,"ss",gc->col);
		fprintf(cGD->fp,"}");
	}
#ifdef ING_PLOT_DEBUG
	Rprintf("//Rect(x0=%f,y0=%f,x1=%f,y1=%f,gc=0x%x,RGD=0x%x)\n",x0,y0,x1,y1,gc,RGD);
#endif

}
static void amplixplotSize(double *left, double *right, double *bottom, double *top, pDevDesc RGD)
{
	amplixplotDesc *cGD = (amplixplotDesc *)RGD->deviceSpecific;
	*left = *top = 0.0;
	*right = RGD->right;
	*bottom = RGD->bottom;
	fprintf(cGD->fp,", {\"c\":\"s\",\"left\":\"%f\",\"right\":\"%f\",\"bottom\":\"%f\",\"top\":\"%f\",\"RGD\":\"0x%x\"}",*left,*right,*bottom,*top,RGD);
#ifdef ING_PLOT_DEBUG
	Rprintf("Size(left=%f,right=%f,bottom=%f,top=%f,RGD=0x%x)\n",*left,*right,*bottom,*top,RGD);
#endif
}

static double amplixplotStrWidth(const char *str, const pGEcontext gc, pDevDesc RGD)
{

	/* 10px sans-serif is default, however 7px provides a better guess. */
#ifdef ING_PLOT_DEBUG
	Rprintf("StrWidth(str=%s,gc=0x%x,RGD=0x%x)\n",str,gc,RGD);
#endif
	/*
	if (strcmp(str, "m") == 0)
	{
		return strlen(str) * g_fontwidth;
	}
	*/
		
	return strlen(str) * g_fontwidth;
}

static char *str_replace(const char *orig, const char *rep, const char *with) 
{
    char *result; // the return string
    char *ins;    // the next insert point
    char *tmp;    // varies
    int len_rep;  // length of rep
    int len_with; // length of with
    int len_front; // distance between rep and end of last rep
    int count;    // number of replacements

#ifdef ING_PLOT_DEBUG
	Rprintf("str_replace(str=%s)\n",orig);
#endif

    if (!orig)
    {
#ifdef ING_PLOT_DEBUG
		Rprintf("original\n");
#endif
        return NULL;
    }
    if (!rep || !(len_rep = strlen(rep)))
	{
#ifdef ING_PLOT_DEBUG
		Rprintf("second\n");
#endif
        return NULL;
    }
    if (!(ins = strstr(orig, rep))) 
	{
#ifdef ING_PLOT_DEBUG
		Rprintf("third\n");
#endif
        return NULL;
    }
    if (!with)
        with = "";
    len_with = strlen(with);
    
#ifdef ING_PLOT_DEBUG
	Rprintf("len_with(str=%i)\n",len_with);
#endif

    for (count = 0; tmp = strstr(ins, rep); ++count) 
    {
        ins = tmp + len_rep;
    }

#ifdef ING_PLOT_DEBUG
	Rprintf("for loop ends\n");
#endif
    // first time through the loop, all the variable are set correctly
    // from here on,
    //    tmp points to the end of the result string
    //    ins points to the next occurrence of rep in orig
    //    orig points to the remainder of orig after "end of rep"
    tmp = result = malloc(strlen(orig) + (len_with - len_rep) * count + 1);
    
#ifdef ING_PLOT_DEBUG
	Rprintf("result %s\n", result);
#endif

    if (!result)
        return NULL;

    while (count--) 
    {
        ins = strstr(orig, rep);
        len_front = ins - orig;
        tmp = strncpy(tmp, orig, len_front) + len_front;
        tmp = strcpy(tmp, with) + len_with;
        orig += len_front + len_rep; // move to next "end of rep"
    }
    strcpy(tmp, orig);
    return result;
}


static void amplixplotText(double x, double y, const char *str, double rot, double hadj, const pGEcontext gc, pDevDesc RGD)
{
	amplixplotDesc *cGD = (amplixplotDesc *)RGD->deviceSpecific;
	
	const char* mstr = str_replace(str, "\"", "\\\"");
	
	if (mstr == NULL)
	{
		mstr = str;
	}

	if (hadj!=0. || rot != 0.)
	{
		double strextent = strlen(mstr) * g_fontwidth; /* wild guess that each char is 10px wide */
		if (rot!=0.)
		{
			fprintf(cGD->fp,", \n{\"c\":\"t\",\"data\":\"%s\",\"x\":%d,\"y\":0,\"h\":%d", mstr,(int)(-strextent*hadj),(int)hadj);
			amplixplotColor(cGD->fp,"fs",gc->col);
			fprintf(cGD->fp,", \"ftr\":[%f,%f] ",x,y);
			// fprintf(cGD->fp,", \"rotate\": -%f / 180 * Math.PI ",rot);
			fprintf(cGD->fp,", \"fro\":%f", -rot/180 * PI);
		} 
		else 
		{
			fprintf(cGD->fp,", \n{\"c\":\"t\",\"data\":\"%s\",\"x\":%d,\"y\":%d,\"h\":%d", mstr,(int)(x -strextent*hadj),(int)y,(int)hadj);
			amplixplotColor(cGD->fp,"fs",gc->col);
		}
	} 
	else 
	{
		fprintf(cGD->fp,",\n{\"c\":\"t\",\"data\":\"%s\",\"x\":%d,\"y\":%d", mstr,(int)x,(int)y);
		amplixplotColor(cGD->fp,"fs",gc->col);
	}
	
	fprintf(cGD->fp,"}");
#ifdef ING_PLOT_DEBUG
	Rprintf("//Text(x=%f,y=%f,str=%s,rot=%f,hadj=%f,gc=0x%x,RGD=0x%x)\n",x,y,str,rot,hadj,gc,RGD);
#endif
}

static void amplixplotTextUTF8(double x, double y, const char *str, double rot, double hadj, const pGEcontext gc, pDevDesc RGD)
{
	amplixplotDesc *cGD = (amplixplotDesc *)RGD->deviceSpecific;
	
	const char* mstr = str_replace(str, "\"", "\\\"");
	
	if (mstr == NULL)
	{
		mstr = str;
		// Rprintf(">> Text %s", mstr);
	}
	
	if (hadj!=0. || rot != 0.)
	{
		double strextent = strlen(mstr) * g_fontwidth; /* wild guess that each char is 10px wide */
		if (rot!=0.)
		{
			fprintf(cGD->fp,", \n{\"c\":\"t\",\"data\":\"%s\",\"x\":%d,\"y\":0,\"h\":%d", mstr,(int)(-strextent*hadj),(int)hadj);
			amplixplotColor(cGD->fp,"fs",gc->col);
			fprintf(cGD->fp,", \"ftr\":[%f,%f] ",x,y);
			// fprintf(cGD->fp,", \"rotate\": -%f / 180 * Math.PI ",rot);
			fprintf(cGD->fp,", \"fro\":%f", -rot/180 * PI);
		} 
		else 
		{
			fprintf(cGD->fp,", \n{\"c\":\"t\",\"data\":\"%s\",\"x\":%d,\"y\":%d,\"h\":%d", mstr,(int)(x -strextent*hadj),(int)y,(int)hadj);
			amplixplotColor(cGD->fp,"fs",gc->col);
		}
	} 
	else 
	{
		fprintf(cGD->fp,",\n{\"c\":\"t\",\"data\":\"%s\",\"x\":%d,\"y\":%d", mstr,(int)x,(int)y);
		amplixplotColor(cGD->fp,"fs",gc->col);
	}
	
	fprintf(cGD->fp,"}");
#ifdef ING_PLOT_DEBUG
	Rprintf("//Text(x=%f,y=%f,str=%s,rot=%f,hadj=%f,gc=0x%x,RGD=0x%x)\n",x,y,str,rot,hadj,gc,RGD);
#endif
}

SEXP amplixplot_new_device(SEXP args)
{
	/* R Graphics Device: in GraphicsDevice.h */
	pDevDesc RGD;

	/* R Graphics Engine: in GraphicsEngine.h */
	pGEDevDesc RGE;

	/* amplixplot Graphics Device */
	amplixplotDesc *cGD;

	FILE *fp = NULL;
	int width, height, bgcolor;

	SEXP v;
	args=CDR(args);
	v=CAR(args); args=CDR(args);
	if (isString(v))
	{
		PROTECT(v);
		fp = fopen(CHAR(STRING_ELT(v,0)),"w");
		UNPROTECT(1);
		if (fp == NULL)
			error("could not open file");
	} 
	else 
	{
		error("file must be a filename");
	}

	v=CAR(args); args=CDR(args);
	if (!isNumeric(v)) {fclose(fp); error("`width' must be a number");}
	width=asInteger(v);
	v=CAR(args); args=CDR(args);
	if (!isNumeric(v)) {fclose(fp); error("`height' must be a number");}
	height=asInteger(v);
	v=CAR(args); args=CDR(args);
	if (!isString(v) && !isInteger(v) && !isLogical(v) && !isReal(v))
		error("invalid color specification for `bg'");
	bgcolor = RGBpar(v, 0);
#ifdef ING_PLOT_DEBUG
	Rprintf("amplixplot_new_device(width=%d,height=%d,fd=%x)\n", width, height, fp);
#endif
	
	g_width = width;
	g_height = height;
	
    R_CheckDeviceAvailable();

	if (!(RGD = (pDevDesc)calloc(1, sizeof(NewDevDesc))))
	{
		fclose(fp);
	    error("calloc failed for amplixplot device");
	}

    if (!(cGD = (amplixplotDesc *)calloc(1, sizeof(amplixplotDesc))))
    {
		free(RGD);
		fclose(fp);
	    error("calloc failed for amplixplot device");
	}

	cGD->fp = fp;

    RGD->deviceSpecific = (void *) cGD;

	/* Callbacks */
    RGD->close = amplixplotClose;
    RGD->activate = amplixplotActivate;
    RGD->deactivate = amplixplotDeactivate;
    RGD->size = amplixplotSize;
    RGD->newPage = amplixplotNewPage;
    RGD->clip = amplixplotClip;
    RGD->strWidth = amplixplotStrWidth;
    RGD->text = amplixplotText;
    RGD->rect = amplixplotRect;
    RGD->circle = amplixplotCircle;
    RGD->line = amplixplotLine;
    RGD->polyline = amplixplotPolyline;
    RGD->polygon = amplixplotPolygon;
    RGD->locator = amplixplotLocator;
    RGD->mode = amplixplotMode;
    RGD->metricInfo = amplixplotMetricInfo;
	RGD->hasTextUTF8 = TRUE;
    RGD->strWidthUTF8 = amplixplotStrWidth;
    RGD->textUTF8 = amplixplotTextUTF8;
	RGD->wantSymbolUTF8 = TRUE;

	/* Initialise RGD */
	RGD->left = RGD->clipLeft = 0;
	RGD->top = RGD->clipTop = 0;
	RGD->right = RGD->clipRight = width;
	RGD->bottom = RGD->clipBottom = height;
	RGD->xCharOffset = 0.4900;
	RGD->yCharOffset = 0.3333;
	RGD->yLineBias = 0.1;
	RGD->ipr[0] = 1.0/72.0;
	RGD->ipr[1] = 1.0/72.0;
	RGD->cra[0] = 0.9 * 10; //0.9 * 10;
	RGD->cra[1] = 1.2 * 10; //1.2 * 10;
	RGD->gamma = 1.0;
	RGD->canClip = TRUE;
    RGD->canChangeGamma = FALSE;
    // can the device do horizontal adjustment of text via the text callback, and if so, how precisely?
    // 0 = no adjustment, 
    // 1 = {0, 0.5, 1} (left, centre, right justification) or 
    // 2 = continuously variable (in [0,1]) between left and right justification.
    RGD->canHAdj = 0; //2;
	RGD->startps = 10.0;
	RGD->startcol = R_RGB(0,0,0);
	RGD->startfill = bgcolor;
	RGD->startlty = LTY_SOLID;
	RGD->startfont = 1;
	RGD->startgamma = RGD->gamma;
    RGD->displayListOn = FALSE;

	/* Add to the device list */
	RGE = GEcreateDevDesc(RGD);
	cGD->RGE = RGE;
	GEaddDevice(RGE);
	GEinitDisplayList(RGE);

	/*return ScalarInteger(1 + GEdeviceNumber(RGE));*/
    return R_NilValue;
}

R_ExternalMethodDef amplixplot_externals[] = 
{
	{"amplixplot_new_device",(DL_FUNC) &amplixplot_new_device,4},
	{NULL,0,0,NULL}
};

void R_init_amplixplot(DllInfo *info)
{
	R_registerRoutines(info, NULL, NULL, NULL, amplixplot_externals);
}
