\name{amplixplot}
\alias{amplixplot}
\title{
  R graphics device targetting the HTML amplixplot element
}
\description{
  \code{amplixplot} initializes a new graphics device that implements
  the amplixplotRenderingContext2D javascript api.
}
\usage{
amplixplot(file="", width = 640, height = 480, bg="transparent",...)
}
\arguments{
  \item{file}{name of the file to be created.}
  \item{width}{width of the plot area.}
  \item{height}{height of the plot area.}
  \item{bg}{starting background color.}
  \item{...}{not implemented.}
}
\value{
  Returns the NULL value invisibly.
}
\examples{
# very simple plot
amplixplot(600, 600, file="plot.js")
plot(rnorm(4000),rnorm(4000),col="#ff000018",pch=19,cex=2) # semi-transparent red
dev.off() # creates a file "plot.js" with the above plot
}
\keyword{device}
