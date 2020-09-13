amplixplot <- function(file="", width=640, height=480, bg="transparent", ...) {
	invisible(.External("amplixplot_new_device", file, width, height, bg, ..., PACKAGE="amplixplot"))
}
