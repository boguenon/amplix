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
	
    String _d = params.get("_d");
    String ukey = "?_d=" + _d;
    String lang = params.get("lang");
    lang = (lang == null) ? "en_US" : lang;
	String mts = params.get("mts");
	mts = (mts == null) ? "" : mts;
	String tmp = params.get("tmp");
    tmp = (tmp == null) ? "" : tmp;
    
    String theme = params.get("theme");
    
    String version = com.amplix.rpc.igcServer.version;
	boolean is_debug = (params.get("debug") != null && params.get("debug").equals("true") ? true : false);
%>
<!DOCTYPE html>
<html lang="en">
<head>
<title>Amplix</title>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate">
<meta http-equiv="Pragma" content="no-cache">
<meta http-equiv="Expires" content="0">
<link rel="icon" href="../favicon.png" type="image/png">
<link rel="stylesheet" type="text/css" href="./css/apps.min.css?_dc=202411122218" />
<%
if (theme != null && theme.length() > 0)
{
	out.println("<link rel=\"stylesheet\" type=\"text/css\" href=\"./css/" + theme.toLowerCase() + ".css?_dc=202411122218\" />");
}
%>
<link rel="stylesheet" type="text/css" href="./css/custom_lang_<%=lang.toLowerCase()%>.css?_dc=202411122218" />
<link rel="stylesheet" type="text/css" href="./css/custom.css?_dc=202411122218" />
<script type="text/javascript" src="./js/jquery-3.6.4.min.js"></script>    
<script type="text/javascript" src="../config.js?_dc=202411122218"></script>
<script type="text/javascript" src="../bootconfig<%=(is_debug ? "_debug" : "")%>.js?_dc=202411122218"></script>
<script type="text/javascript" src="./js/igca<%=(is_debug ? "" : ".min")%>.js?_dc=202411122218"></script>

<script type="text/javascript">
var useLocale = "<%=lang%>";
var m$mts = "<%=mts%>";
var m$_d = "";
// Fix issues on chrome iframe session persistency.
// var use_session_key = true;

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
<%
if (theme != null && theme.length() > 0)
{
	out.println("ig$.theme_id=\"" + theme + "\";");
}
%>

var modules = ["framework", "app", "appnc", "vis_ec", "vis_ec_theme", "custom"];
IG$.__microloader(modules, function() {
	$s.ready(function() {
		var instance = new IG$.amplix_instance({
			target: "#mainview"
		});
		
		instance.create();

		_load_cuddler(instance);
	});
});
</script>
<!-- start ai data explorer -->
<link rel="stylesheet" href="./css/igccud.min.css?_dc=202411122218"></link>
<script type="text/javascript">
function _load_cuddler(instance) {
	var assist_message = [
		"Welcome to amplixbi! <br/>I am here to assit you!",
		"We have agents to help you. <br/> Just click me!"
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

	rotate_msg();

	$("#robo_wrap").bind("click", function(e) {
		e.preventDefault();
		e.stopPropagation();
		
		$("#robo_main").show();
		
		var robo_inst;

		if (!IG$._robo_inst)
		{
			robo_inst = IG$._robo_inst = new IG$._wcollab({
				instance: instance,
				_container: $("#robo_embed_area")
			});
		}
		else
		{
			robo_inst = IG$._robo_inst;
		}

		robo_inst.load_app();
	});
	
	$("#robo_close", "#robo_main").bind("click", function(e) {
		e.preventDefault();
		e.stopPropagation();
		
		$("#robo_main").fadeOut();
	});

	$("#robo_dock", "#robo_main").bind("click", function(e) {
		e.preventDefault();
		e.stopPropagation();

		if (!IG$._robo_inst)
			return;

		IG$._robo_inst._dockmode = !IG$._robo_inst._dockmode;

		var robo_container_dock = $("#robo_container_dock"),
			body = $("body");

		if (IG$._robo_inst._dockmode)
		{
			$("#mainview").appendTo(robo_container_dock);
			$("#robo_main")
				.appendTo(robo_container_dock)
				.css("height", "");
				
			$("#robo_wrap").appendTo(robo_container_dock);

			$("#robo_main").resizable("option", "handles", "W, s, sw");

			robo_container_dock.show();
		}
		else
		{
			$("#mainview", robo_container_dock).appendTo(body);
			$("#robo_main", robo_container_dock).appendTo(body);
			$("#robo_wrap", robo_container_dock).appendTo(body);

			$("#robo_main").resizable("option", "handles", "e, s, se");

			robo_container_dock.hide();
		}
	});
}
</script>
<!-- end ai data explorer -->
</head>
<body scroll="no">
	<div id="mainview">
		<div id="loading-mask" style=""></div>
		<div id="loading">
			<div class="cmsg">
				<div class="msg">Loading Amplix...</div>
				<div class="lpb">
					<div id="lpt" style="width: 10%;"></div>
				</div>
			</div>
		</div>
	</div>
	
	<!-- start ai data explorer --> 
	<div class="robo_wrap" id="robo_wrap" style="display:none;">
		<div class="robo_icon">
			<img src="./images/cuddler.png" width="55px" height="42px">
		</div>
		<div class="assist_message" id="assist_message">
		</div>
	</div>
	<div class="robo_main fadeInRight animated" id="robo_main">
		<div class="robo_area">
			<div class="robo_title">
				<span class="robo_title_text">AI Data Explorer!</span>
				<div class="robo_title_button">
					<a id="robo_dock" class="robo_dock">
						<i class="robo-window-dock"></i>
					</a>
					<a id="robo_close" class="robo_close">
						<i class="robo-window-close"></i>
					</a>
				</div>
			</div>
			<div class="robo_embed_area" id="robo_embed_area">
			</div>
		</div>
	</div>
	<div class="robo_container_dock" id="robo_container_dock" style="display:none;"></div>
	<!-- end ai data explorer -->
</body>
</html>
