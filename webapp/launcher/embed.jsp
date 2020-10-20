<%@ page contentType="text/html; charset=utf-8" pageEncoding="utf-8"%>
<%
    request.setCharacterEncoding("utf-8");
%>
<!DOCTYPE html>
<html lang="en">
<head>
<title>amplix</title>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate">
<meta http-equiv="Pragma" content="no-cache">
<meta http-equiv="Expires" content="0">
<link rel="icon" href="../favicon.png" type="image/png">

<script type="text/javascript" src="./js/jquery-3.5.1.min.js?_dc=202010201048"></script>

<script type="text/javascript" src="../config.js?_dc=202010201048"></script>
<script type="text/javascript" src="../bootconfig.js?_dc=202010201048"></script>
<script type="text/javascript" src="./js/amplix_embedded_loader.js?_dc=202010201048"></script>
<script type="text/javascript">
$(function(){
  $("#nav > ul > li > a").mouseover(function(){      
    if ($(this).attr("href") == "#") {
      var idx = parseInt($(this).parent("li").children("ul").children("li").size()) -1;
      var sHeight = (idx == 0 ? 75 : idx * 18 + 78);
      $("#slide_menu").css("height", sHeight+"px");

      $("#nav > ul > li > ul").hide();
      $("#slide_menu").slideDown(300);
      $(this).parent("li").children("ul").fadeIn(300).siblings().children("ul").fadeOut(200);
    }
   });

  $("#amplix_panel").mouseover(function() {
    $("#slide_menu").slideUp(400);
    $("#nav > ul > li > ul").fadeOut(300);
  });

  $("#nav ul li ul li a").each(function(){
    if ($(this).attr("href") == "#") {
      $(this).css("cursor", "default");
    } 
  });

  $("#nav li a").click(function(event){
    if ($(this).attr("href") != "#") {
      if($(this).text() == 'Main') { 
        $("#title_area > h1").text("AmplixBI.com User Viewer");
      }
      else { 
        $("#title_area > h1").text($(this).text());
      }
    } 
    event.preventDefault();
    event.stopPropagation();
  });

	$("a[amplx-data-uid]").each(function(i, d) {
		var dz = $(d),
			uid = dz.attr("amplx-data-uid");
		dz.bind("click", function(e) {
			IG$.open_url({
				uid: uid
			});
		});
	});
});

</script>
<style>
#amplix_panel {
	position: absolute;
	width: 100%;
	top: 56px;
	bottom: 0px;
	margin-left: auto;
	margin-right: auto;
}
</style>

<script type="text/javascript">
var m$mts = "ROOT";
ig$.mainview = "amplix_panel";
IG$.amplix_ready(function() {
	IG$.open_url({
		uid: "/Northwind Examples/1. Basic Functions/5. Page Filter"
	});
});

$(document).ready(function() {
	$("#btn_rpt_select").bind("change", function(e) {
		var val = $(this).val();

		IG$.open_url({
			uid : val
		});
	});
});
</script>
</head>
<body scroll="no">
		<div id="wrap">
		<div id="content">
			<div id="title_area">
				<h1>AmplixBI.com User Viewer</h1>
			</div>
			<div id="amplix_panel">
				<div id="loading-mask" style=""></div>
				<div id="loading">
					<div class="cmsg">
						<div class="msg">
							Loading
							<%=com.amplix.launcher.App.CompanyName%>...
						</div>
						<div class="lpb">
							<div id="lpt" style="width: 10%;"></div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
	<div id="slide_menu" style="height: 132px; display: none;"></div>
	<div id="header">
		<div id="nav">
			<span class="f_left"><a href="./">
				<img src="" width="300" height="38" alt="logo"></a>
			</span>
			<ul>
				<li><a amplx-data-uid="/Northwind Examples/1. Basic Functions/5. Page Filter">Main</a></li>
				<li><a href="#">Pivoting</a>
					<ul style="display: none;">
						<li>
							<a amplx-data-uid="/Northwind Examples/1. Basic Functions/1. Pivot Simple">Pivot Simple</a>
						</li>
						<li>
							<a amplx-data-uid="/Northwind Examples/1. Basic Functions/2. Pivot Basic">Pivot Basic</a>
						</li>
						<li>
							<a amplx-data-uid="/Northwind Examples/1. Basic Functions/4. Hierarchy">Hierarchy</a>
						</li>
						<li>
							<a amplx-data-uid="/Northwind Examples/1. Basic Functions/4a. Hierarchy on Column">Hierarchy on Column</a>
						</li>
					</ul>
				</li>
				<li><a href="#" class="nav_lev2">Charting</a>
					<ul style="display: none;">
						<li>
							<a amplx-data-uid="/Northwind Examples/2. Data Visualization/1. Cartesian">Cartesian</a>
						</li>
						<li>
							<a amplx-data-uid="/Northwind Examples/2. Data Visualization/2. Pie">Pie</a>
						</li>
						<li>
							<a amplx-data-uid="/Northwind Examples/2. Data Visualization/3. Radar">Radar</a>
						</li>
						<li>
							<a amplx-data-uid="/Northwind Examples/2. Data Visualization/4. Bubble">Bubble</a>
						</li>
						<li>
							<a amplx-data-uid="/Northwind Examples/2. Data Visualization/5. Scatter">Scatter</a>
						</li>
					</ul>
				</li>
				<li class="f_right"><a href="./help.html">Help</a></li>
			</ul>
		</div>
	</div>
</body>
</html>
