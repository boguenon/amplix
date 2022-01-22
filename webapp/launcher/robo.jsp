<%@ page contentType="text/html; charset=utf-8" pageEncoding="utf-8"%>
<%
    request.setCharacterEncoding("utf-8");

	java.util.Map<String, String> params = new java.util.HashMap<>();
	java.util.Enumeration<String> param_names = request.getParameterNames();
	
	// XSS vulnerabilities
	while (param_names.hasMoreElements())
	{
		String pname = param_names.nextElement();
		
		if (pname != null && pname.length() > 0)
		{
			String pvalue = request.getParameter(pname);
			if (pvalue != null && pvalue.length() > 0)
			{
				pvalue = pvalue.replaceAll("\\\\", "");
				pvalue = pvalue.replaceAll("\'", "\\\\\'");
				pvalue = pvalue.replaceAll("\"", "\\\\\"");
				pvalue = pvalue.replaceAll("<", "&lt;");
				pvalue = pvalue.replaceAll(">", "&gt;");
				params.put(pname, pvalue);
			}
		}
	}
%>
<!DOCTYPE html>
<html>
<head>
<meta charset=utf-8>
<meta name=viewport content="user-scalable=no,width=device-width,initial-scale=1,maximum-scale=1">
<meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate">
<meta http-equiv="Pragma" content="no-cache">
<meta http-equiv="Expires" content="0">
<link rel="icon" href="../favicon.png" type="image/png">
<title>Amplix</title>
<style>
body {
	overflow-x: hidden;
}
</style>
<link rel="stylesheet" href="./css/igccud.min.css?_dc=202201211651"></link>
<script type="text/javascript" src="./js/jquery-3.5.1.min.js"></script>
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
		
		setTimeout(function() {
			document.getElementById("roboassist").contentWindow.start_chat();
		}, 1000);
	});
	
	$("#robo_close").bind("click", function(e) {
		e.preventDefault();
		e.stopPropagation();
		
		$("#robo_main").fadeOut();
		
		document.getElementById("roboassist").contentWindow.close_chat();
	});
});
</script>
</head>
<body scroll="no">
<noscript>
	<div class="igc-noscript-warn">
		Please enable JavaScript and refresh the page to use this website.
	</div>
</noscript>
<div class="robo_wrap" id="robo_wrap">
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
					<i class="fa fa-window-close"></i>
				</a>
			</div>
		</div>
		<div class="robo_embed_area">
			<iframe id="roboassist" src="./roboassist.jsp"></iframe>
		</div>
	</div>
</div>
</body>
</html>