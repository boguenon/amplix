<%@ page contentType="text/html; charset=utf-8" pageEncoding="utf-8"%>
<%
	request.setCharacterEncoding("utf-8");
	String _d = request.getParameter("_d");
	String ukey = "?_d=" + _d;
	String lang = request.getParameter("lang");
	lang = (lang == null) ? "en_US" : lang;
	
	String mts = request.getParameter("mts");
	mts = (mts == null) ? "" : mts;
	
	String theme = request.getParameter("theme");
    theme = (theme == null) ? "" : theme;
	
	boolean is_debug = (request.getParameter("debug") != null && request.getParameter("debug").equals("true") ? true : false);
%>
<!DOCTYPE html>
<html lang="en">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate">
<meta http-equiv="Pragma" content="no-cache">
<meta http-equiv="Expires" content="0">
<link rel="icon" href="../favicon.png" type="image/png">
<title><%= com.amplix.launcher.App.CompanyName %></title>

<style type="text/css">
body {
	width: 100%;
	height: 100%;
}

body, div {
	margin: 0px;
	padding: 0px;
	overflow: hidden;
}
</style>
<link rel="stylesheet" href="./css/appsl.min.css?_dc=202006122120" type="text/css">
<% if (lang.equals("ko_KR")) {%>
<link rel="stylesheet" type="text/css" href="./fonts/hangul_nanum.css?_dc=202006122120" />
<% } %>
<link rel="stylesheet" type="text/css" href="./css/custom.css?_dc=202006122120" />
<script type="text/javascript" src="./js/jquery-1.12.0.min.js"></script>
<script type="text/javascript" src="../config.js?_dc=202006122120"></script>
<script type="text/javascript" src="./js/igc8<%=(is_debug ? "" : ".min")%>.js?_dc=202006122120"></script>

<script type="text/javascript">
var useLocale = "en_US";
var loadingApp;

function parseLocation() {
	var hash = window.location.hash.substring(1);
	
	if (hash == "" && window.location.search && window.location.search != "")
	{
		hash = window.location.search.substring(1).split('&');
	}
	else
	{
		hash = hash.split('&');
	}
	
	for (var i=0; i < hash.length; i++)
	{
		if (hash[i].length > 0 && hash[i].indexOf('=') > -1)
		{
			var hname = hash[i].substring(0, hash[i].indexOf('=')),
				hvalue = hash[i].substring(hash[i].indexOf('=') + 1);
			
			switch (hname)
			{
			case 'lang':
				useLocale = hvalue;
				break;
			case "theme":
				ig$.theme_id = hvalue;
            	break;
			case 'app':
				loadingApp = hvalue;
				break;
			}
		}
	}
}

ig$.theme_id = ig$.theme_id || "<%=theme%>" || $.cookie("theme");

function initPage() {
	var uid = $.cookie("lui") || "",
		upd = "",
		mts = "<%=mts%>";
		
	if (ig$.theme_id)
    {
    	IG$.getScriptCache(
   	        ["./css/" + ig$.theme_id.toLowerCase() + ".css"], 
   	        new IG$.callBackObj(this, function() {
   	            // __microloader();
   	        }),
   	        true
   	    );
    }
	
	IG$.createLoginPanel(uid, upd, false);

	var bg = $("div.login-progress").hide();

	$("#b_loc").bind("change", function(e) {
		var b_loc = $("#b_loc"),
			selvalue = $("option:selected", b_loc).val(),
			redirect = $(location).attr('href'),
			p, hv, h = {},
			k, v,
			i, s = false;
			
		if (selvalue && selvalue != window.useLocale)
		{
			$.removeCookie("lang");
        	$.cookie("lang", selvalue, {
        		path: "/"
        	});
        	
			if (redirect.indexOf("?") > -1)
			{
				p = redirect.substring(0, redirect.indexOf("?"));
				hv = redirect.substring(redirect.indexOf("?") + 1);
				h = hv.split("&");
				
				for (i=0; i < h.length; i++)
				{
					if (h[i].substring(0, 5) == "lang=")
					{
						h[i] = h[i].substring(0, 5) + selvalue;
						s = true;
						break;
					}
				}
				
				hv = h.join("&");
				
				redirect = p + "?" + hv;
			}
			
			if (s == true)
			{
				bg.show();
				
				setTimeout(function() {
					window.location.replace(redirect);
				}, 100);
			}
		}
	});
	
	$("#b_theme").bind("change", function(e) {
        var b_theme = $("#b_theme"),
            selvalue = $("option:selected", b_theme).val(),
            redirect = $(location).attr('href'),
            p, hv, h = {},
            k, v,
            i, s = false;
        
        if (selvalue != ig$.theme_id)
        {
        	$.removeCookie("theme");
        	$.cookie("theme", selvalue, {
        		path: "/"
        	});
        	
            if (redirect.indexOf("?") > -1)
            {
                p = redirect.substring(0, redirect.indexOf("?"));
                hv = redirect.substring(redirect.indexOf("?") + 1);
                h = hv.split("&");
                
                for (i=0; i < h.length; i++)
                {
                    if (h[i].substring(0, 6) == "theme=")
                    {
                        h[i] = h[i].substring(0, 6) + selvalue;
                        s = true;
                        break;
                    }
                }
                
                if (!s)
                {
                	h.push("theme=" + selvalue);
                	s = true;
                }
                
                hv = h.join("&");
                
                redirect = p + "?" + hv;
            }
            
            if (s == true)
            {
                bg.show();
                
                setTimeout(function() {
                    window.location.replace(redirect);
                }, 100);
            }
        }
    });
		
	$('#login_btn').bind('click', function() {
		var userid = $('#userid').val(),
			passwd = $('#userpassword').val();
		IG$.doStartSession(userid, passwd, bg, mts);
		return false;
	});
	$('#userpassword').bind('keypress', function(e) {
		if (e.keyCode == 13)
		{
			var userid = $('#userid')[0].value,
				passwd = $('#userpassword')[0].value;
			
			IG$.doStartSession(userid, passwd, bg, mts);
			
			return false;
		}
		
		return true;
	});

	IG$.chkSess(null, function() {
		IG$.chkSvrInfo(function() {
			$('#loginWindow').show();
		});
	});
}

$(document).ready(function() {
	parseLocation();
	initPage();
});
</script>
</head>
<body scroll="no">
</body>
</html>