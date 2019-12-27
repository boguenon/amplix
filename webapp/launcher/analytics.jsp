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
    
    String version = com.amplix.rpc.igcServer.version;
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
<link rel="stylesheet" type="text/css" href="./css/apps.min.css?_dc=201912262113" />
<% if (lang.equals("ko_KR")) {%>
<link rel="stylesheet" type="text/css" href="./fonts/hangul_nanum.css?_dc=201912262113" />
<% } %>
<link rel="stylesheet" type="text/css" href="./css/custom.css?_dc=201912262113" />
<script type="text/javascript" src="./js/jquery-1.12.0.min.js"></script>    
<script type="text/javascript" src="../config.js?_dc=201912262113"></script>
<script type="text/javascript" src="../bootconfig.js?_dc=201912262113"></script>
<script type="text/javascript" src="./js/igca.min.js?_dc=201912262113"></script>

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

var bc = ig$.bootconfig.boot,
    scripts,
    i, j,
    modules = ["framework", "vis", "app", "custom"],
    s, cache = ig$.bootconfig.cache || new Date().getTime(),
    __microloader = function() {
        while (mod = modules.shift())
        {
            var sc = bc[mod];
            
            if (sc && sc.length)
            {
                IG$.getScriptCache(
                    sc, 
                    new IG$.callBackObj(this, function() {
                        __microloader();
                    })
                );
                break;
            }
        }
    };

__microloader();
</script>
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

	<div id="main"></div>
</body>
</html>
