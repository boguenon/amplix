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
<title>Amplix</title>
<style>
body,html{
    height:100%;
    margin:0;
    padding:0;
    box-sizing: border-box;
    /* disable the 'pull down to refresh' on mobiles */
	overflow: hidden;
}

h1,h2,h3,h4,h5,h6{
    padding:.7em 0 .2em;
    margin:0
}
p{
    margin:.5em 0 1em
}
div{
    -webkit-tap-highlight-color:rgba(0,0,0,0);
    box-sizing: border-box;
}
ul{
    padding-left:1em
}
input,select,textarea{
    color:inherit;
    background:inherit;
    background-color:inherit
}
</style>
<link rel="stylesheet" href="./css/igccud.min.css?_dc=202303131055"></link>
<script type="text/javascript" src="./js/jquery-3.5.1.min.js"></script>
<script type="text/javascript" src="./js/igccud.min.js?_dc=202303131055"></script>
<script type="text/javascript">
function start_chat() {
	$("#main_loading").show();
	$("#app_cuddle").hide();
	
	setTimeout(function() {
		start_cuddle();
		setTimeout(function() {
			$("#txt_nick").focus();
		}, 10)
	}, 500);
}

function close_chat() {
	$("#main_loading").show();
	$("#app_cuddle").hide();
	
	if (window._robo_inst)
	{
		window._robo_inst.closeSession();
		window._robo_inst = null;
	}
}

function start_cuddle() {
	var robo = new IG$._wcollab({
		html: $("#app_cuddle"),
		_mts_: <%=params.get("_mts_") != null ? "'" + params.get("_mts_") + "'" : "null" %>,
		channel_name: <%=params.get("channel_name") != null ? "'" + params.get("channel_name") + "'" : "null" %>,
		request_url: "<%=request.getContextPath()%>/servlet/krcp",
		ws_path: "<%=request.getContextPath()%>/websocket/collaborate",
		message: {
			start: "Start",
			nick: "Nick",
			startup: "<p>Welcome to your Data Analytics Cuddler.<br/><br/> <a href='http://www.amplixbi.com'>amplixbi</a> robo assist are here for help you.<br> To learn more about intelligent cuddler for your business, please visit <a href='https://amplixbi.com'>our website</a>.</p>",
			sponsor: "<span>Data Analytics Cuddler<br></span>Created by <a href='http://www.amplixbi.com/'>amplixbi.com</a>"
		}
	});
	
	$("#main_loading").hide();
	$("#app_cuddle").show();
	robo.load_app();
	
	window._robo_inst = robo;
}

$(document).ready(function() {
	setTimeout(function() {start_cuddle();}, 1000);
});
</script>
</head>
<body scroll="no">
<noscript>
	<div class="igc-noscript-warn">
		Please enable JavaScript and refresh the page to use this website.
	</div>
</noscript>
<div id="app_cuddle"></div>
<div id="loading" class="loading">
	<div class="loading_bg"></div>
	<div class="loading-msg">
		<img src="./images/ico_loading_circle.png" width="30" height="30" alt="" />
	</div>
</div>
<div class="mainLoadingWrap" id="main_loading">
	<div class="mainLoading">
		<p>Calling agent to cuddle you.<br/>I am more then happy to serve you!<br/><span>Please wait a moment.</span></p>		
		<div class="progressWrap">
			<p class="line"></p>
			<img src="./images/ico_mainloading.png" width="18" height="14" alt="" />
		</div>
	</div>
</div>
<div id="popup_error" class="popupContainer">
	<div class="popupWrap">
		<div class="popupContentWrap">
			<div class="popupImgWrap">
				<img src="./images/img_alert.png" width="80" height="80" alt="" />
			</div>
			<div id="msg_area" class="popupContent">
				<p id="msg_title" class="title"></p>
				<p id="msg_content"></p>
			</div>
			<div class="popupBtnWrap">
				<a id="btn_close" class="btn close">Close</a>
			</div>
		</div>
	</div>
	<div class="popupDimmed"></div>
</div>
</body>
</html>