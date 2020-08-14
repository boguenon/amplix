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
    
    String theme = request.getParameter("theme");
    
    String version = com.amplix.rpc.igcServer.version;
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
<link rel="stylesheet" type="text/css" href="./css/apps.min.css?_dc=202008132016" />
<%
if (theme != null && theme.length() > 0)
{
	out.println("<link rel=\"stylesheet\" type=\"text/css\" href=\"./css/" + theme.toLowerCase() + ".css?_dc=202008132016\" />");
}
%>
<% if (lang.equals("ko_KR")) {%>
<link rel="stylesheet" type="text/css" href="./fonts/hangul_nanum.css?_dc=202008132016" />
<% } %>
<link rel="stylesheet" type="text/css" href="./css/custom.css?_dc=202008132016" />
<script type="text/javascript" src="./js/jquery-1.12.0.min.js"></script>    
<script type="text/javascript" src="../config.js?_dc=202008132016"></script>
<script type="text/javascript" src="../bootconfig<%=(is_debug ? "_debug" : "")%>.js?_dc=202008132016"></script>
<script type="text/javascript" src="./js/igca<%=(is_debug ? "" : ".min")%>.js?_dc=202008132016"></script>

<script type="text/javascript">
var useLocale = "<%=lang%>";
var m$mts = "<%=mts%>";
var m$_d = "";

// default theme
// ig$/*appoption*/.theme_id = "DarkBrown";

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
</script>

<script type="text/javascript">
window.IG$/*mainapp*/ = window.IG$/*mainapp*/ || {};
window.IG$/*mainapp*/.__ep_ = "<%=tmp%>";
</script>

<script type="text/javascript">
ig$.appInfo.apprelease = "<%= version%>";
ig$.bootconfig.cache = ig$.appInfo.apprelease + "_" + ig$.appInfo.date.replace(/[{}]/g, "");

<%
if (theme != null && theme.length() > 0)
{
	out.println("ig$.theme_id=\"" + theme + "\";");
}
%>

var modules = ["framework", "vis_ec", "vis_ec_theme", "app", "appnc", "custom"];
IG$.__microloader(modules);
</script>
<!-- start cuddler -->
<link rel="stylesheet" href="./css/igccud.min.css?_dc=202008132016"></link>
<script type="text/javascript">
var assist_message = [
	"Welcome to amplixbi! <br/>I am here to assit you!",
	"We have agents to cuddle you. <br/> Just click me!"
];

function rotate_msg() {
	if (window.assist_message && assist_message.length > 0)
	{
		var mindex = window._curmsg || 0;
		
		$("#assist_message").fadeIn();
		$("#assist_message").html(assist_message[mindex % assist_message.length]);
		
		window._curmsg = mindex + 1;
		
		if (assist_message.length > 1)
		{
			setTimeout(function() {
				$("#assist_message").fadeOut();
				setTimeout(rotate_msg, 2000);
			}, 3000);
		}
	}
}

$(document).ready(function() {
	rotate_msg();
	
	$("#robo_wrap").bind("click", function(e) {
		e.preventDefault();
		e.stopPropagation();
		
		$("#robo_main").show();
		
		document.getElementById("roboassist").src = "./roboassist.jsp";
	});
	
	$("#robo_close").bind("click", function(e) {
		e.preventDefault();
		e.stopPropagation();
		
		$("#robo_main").fadeOut();
		
		document.getElementById("roboassist").src = "";
	});	
});
</script>
<!-- end cuddler -->
</head>
<body scroll="no">
	<div id="loading-mask" style=""></div>
	<div id="loading">
		<div class="cmsg">
			<div class="msg">Loading <%= com.amplix.launcher.App.CompanyName %>...</div>
			<div class="lpb">
				<div id="lpt" style="width: 10%;"></div>
			</div>
		</div>
	</div>

	<div id="mainview"></div>
	
	<!-- start cuddler --> 
	<div class="robo_wrap" id="robo_wrap" style="display:none;">
		<div class="robo_icon">
			<img src="./images/cuddler.png" width="120px" height="84px">
		</div>
		<div class="assist_message" id="assist_message">
		</div>
	</div>
	<div class="robo_main fadeInRight animated" id="robo_main">
		<div class="robo_area">
			<div class="robo_title">
				<span class="robo_title_text">Expert Bot is here for cuddle you!</span>
				<div class="robo_title_button">
					<a id="robo_close" class="robo_close">
						<i class="robo-window-close"></i>
					</a>
				</div>
			</div>
			<div class="robo_embed_area">
				<iframe id="roboassist" src=""></iframe>
			</div>
		</div>
	</div>
	<!-- end cuddler -->
</body>
</html>
