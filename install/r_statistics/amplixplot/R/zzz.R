.First.lib <- function(libname, pkgname) {
    library.dynam("amplixplot", pkgname, libname)
}

### in case we decide to keep the namespace ...
.onLoad <- .First.lib
