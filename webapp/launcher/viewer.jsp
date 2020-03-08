<%@ page contentType="text/html; charset=utf-8" pageEncoding="utf-8"%>
<%
    request.setCharacterEncoding("utf-8");
	String _d = request.getParameter("_d");
	String ukey = "?_d=" + _d;
	String lang = request.getParameter("lang");
	lang = (lang == null) ? "en_US" : lang;
	String mts = request.getParameter("mts");
	mts = (mts == null) ? "" : mts;
	String tmp = request.getParameter("tmp");
	tmp = (tmp == null) ? "" : tmp;

    String version = com.amplix.rpc.igcServer.version;
    
    String igc_theme = request.getParameter("igc_theme");
    igc_theme = (igc_theme != null && "".equals(igc_theme) == true) ? null : igc_theme;
    
    String igc_theme_name = null;
    
    if (igc_theme != null)
    {
    	igc_theme_name = igc_theme.toLowerCase().replaceAll(" ", "");
    }
	
	boolean is_debug = (request.getParameter("debug") != null && request.getParameter("debug").equals("true") ? true : false);
%>
<!DOCTYPE html>
<html lang="en">
<head>
<title><%= com.amplix.launcher.App.CompanyName %></title>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate">
<meta http-equiv="Pragma" content="no-cache">
<meta http-equiv="Expires" content="0">
<link rel="icon" href="../favicon.png" type="image/png">
<link rel="stylesheet" type="text/css" href="./css/apps.min.css?_dc=202003080945" />
<% if (lang.equals("ko_KR")) {%>
<link rel="stylesheet" type="text/css" href="./fonts/hangul_nanum.css?_dc=202003080945" />
<% } %>
<link rel="stylesheet" type="text/css" href="./css/custom.css?_dc=202003080945" />
<%
if (igc_theme != null)
{
	out.println("<link rel=\"stylesheet\" type=\"text/css\" href=\"./css/theme_" + igc_theme_name + ".css\" />");
}
%>
<link rel="stylesheet" type="text/css" href="./viewer/css/viewer.css?_dc=202003080945" />

<script type="text/javascript" src="./js/jquery-1.12.0.min.js"></script>    
<script type="text/javascript" src="../config.js?_dc=202003080945"></script>
<script type="text/javascript" src="../bootconfig<%=(is_debug ? "_debug" : "")%>.js?_dc=202003080945"></script>
<script type="text/javascript" src="./js/igca<%=(is_debug ? "" : ".min")%>.js?_dc=202003080945"></script>

<script type="text/javascript">
var useLocale = "<%=lang%>";
var m$mts = "<%=mts%>";
var m$_d = "";

function getLocale()
{
    var hash = window.location.hash.substring(1).split('&'),
        i, k, v, m;
    
    for (i=0; i < hash.length; i++)
    {
        m = hash[i].indexOf("=");
        if (m > 0)
        {
            k = hash[i].substring(0, m);
            v = hash[i].substring(m+1);
            
            if (k == "lang" && v)
            {
                useLocale = v;
                break;
            }
        }
    }
}

getLocale();

<%
	if (igc_theme != null)
	{
		out.println("ig$.theme_id=\"" + igc_theme + "\";");
	}
%>

var _report_prompt = [];
<%
String param_names = request.getParameter("param_names");
String[] params = (param_names != null && param_names.equals("") == false) ? param_names.split(";") : null;

if (params != null)
{
    for (int i=0; i < params.length; i++)
    {
        String pname = params[i];
        
        if (pname.equals("") == false)
        {
            String pvalue = request.getParameter(pname);
            
            if (pvalue != null && pvalue.equals("") == false)
            {
                out.println("_report_prompt.push({name: \"" + pname + "\", values: [{code: \"" + pvalue + "\", value: \"" + pvalue + "\"}]});\n");
            }
        }
    }
} 
%>

function loadParameter(param) {
    window._report_prompt = [];
    var i;
    for (i=0; param._report_prompt.length; i++)
    {
        window._report_prompt.push(param._report_prompt);
    }
}
</script>
<script type="text/javascript">
ig$.appInfo.apprelease = "<%= version%>";
ig$.bootconfig.cache = ig$.appInfo.apprelease + "_" + ig$.appInfo.date.replace(/[{}]/g, "");

var modules = ["framework", "vis_ec", "vis_ec_theme", "app_viewer", "custom_viewer", "appnc", "custom"];
IG$.__microloader(modules);
</script>
</head>
<body scroll="no">
<div id="top_viewer" style="display:none;">
	<div id="slide_menu"></div>
	<div id="header"> 
	  <div id="nav">
	    <span class="f_left logo">
	    amplix
	    <!-- a href="./"><img src="./images/logo.png" width="300" height="38" alt="logo"/></a -->
	    </span>
	    <ul id="d_nav">
	      
	    </ul>
	  </div>
	</div>
	<div id="title_area">
	  <h1>Dashboard Viewer</h1>
	</div>
</div>
<div id="wrap">
  <div id="content" style="top: 0px;">
    <div style="overflow-x:hidden;" width="100%" height="100%" name="mainview" id="mainview"></div>
  </div>
</div>
</body>
</html>
