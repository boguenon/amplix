function resize_body() {
	var body = $("body"),
		sphinxsidebar = $("#sphinxsidebar"),
		w = body.width(),
		h = body.height();
		
	if (window.ww == w && window.hh == h)
	{
		return;
	}
	
	if (w < 1000)
	{
		sphinxsidebar.hide();
	}
	else
	{
		 sphinxsidebar.show();
	}
	
	window.ww = w;
	window.hh = h;
} 


$(document).ready(function () {

    // Highlight the top nav as scrolling
    $('body').scrollspy({
        target: '.navbar-fixed-top',
        offset: 80
    })

    // Page scrolling feature
    $('a.page-scroll').bind('click', function(event) {
        var link = $(this);
        $('html, body').stop().animate({
            scrollTop: $(link.attr('href')).offset().top - 70
        }, 500);
        event.preventDefault();
    });
    
    resize_body();
    
    setInterval(function() {
    	resize_body();
    }, 1000);
});

// Activate WOW.js plugin for animation on scrol
new WOW().init();