## a simple Makefile to build Acinonyx as an R dynamic library
## (requires GNU Make compatible due to ifeq/endif)
##
## Default configurations:
## Windows  : Win32 graphapp UI (built-in FreeType)
## Mac OS X : Cocoa
## others   : X11 + FreeType
##
## GLUT support is optional, unused and untested

CSRC = src/amplixplot.c
RSRC=$(shell ls R/*.R | grep -v entry)

REP=R/entry_points.R

OBJ = $(CSRC:%.c=%.o)

OS=$(shell uname || echo Windows)
ifeq ($(R_HOME),)
RBIN=R
else
RBIN=$(R_HOME)/bin/R
endif

ifeq ($(WINARCH),)
WINARCH=32
endif

ifeq ($(OS),Darwin)
ifeq ($(USE_X11),1)
amplixplot.so: $(CSRC)
	PKG_MAKE_DSYM=1 PKG_CPPFLAGS='$(DEBUGCPPFLAGS) ' R CMD SHLIB -o $@ $^
else
amplixplot.so: $(CSRC)
	PKG_MAKE_DSYM=1 PKG_CPPFLAGS='$(DEBUG) -IAcinonyx -IAcinonyx/RIF -ICocoa' PKG_LIBS='-framework Cocoa -framework OpenGL' R CMD SHLIB -o $@ $^
endif
else
amplixplot.so: $(CSRC)
	PKG_LIBS='' R CMD SHLIB -o $@ $^
endif

amplixplot.dll: $(CSRC)
	PKG_CXXFLAGS='-fpermissive' PKG_LIBS='-static-libgcc' PKG_CPPFLAGS='$(DEBUG) -IWin32' $(RBIN) CMD SHLIB -o $@ $^

$(REP): $(RSRC)
	cat $(RSRC) | sed -n 's:.*\.Call("\{0,1\}\(A_[^" ,)]\{1,\}\).*:\1:p' | sort | uniq > /tmp/entry_points
	( echo '.sym <- '; Rscript -e 'dput(readLines("/tmp/entry_points"))') > $@
	rm -f /tmp/entry_points

sym: $(REP)

clean:
	rm -rf $(OBJ) amplixplot.so amplixplot.dll
