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
    
    String igc_theme = request.getParameter("igc_theme");
    igc_theme = (igc_theme != null && "".equals(igc_theme) == true) ? null : igc_theme;
    
    String igc_theme_name = null;
    
    if (igc_theme != null)
    {
    	igc_theme_name = igc_theme.toLowerCase().replaceAll(" ", "");
    }
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
<link rel="stylesheet" type="text/css" href="./css/apps.min.css?_dc=201912310158" />
<% if (lang.equals("ko_KR")) {%>
<link rel="stylesheet" type="text/css" href="./fonts/hangul_nanum.css?_dc=201912310158" />
<% } %>
<link rel="stylesheet" type="text/css" href="./css/custom.css?_dc=201912310158" />

<%
if (igc_theme != null)
{
	out.println("<link rel=\"stylesheet\" type=\"text/css\" href=\"./css/theme_" + igc_theme_name + ".css\" />");
}
%>

<script type="text/javascript" src="./js/jquery-1.12.0.min.js"></script>    
<script type="text/javascript" src="../config.js?_dc=201912310158"></script>
<script type="text/javascript" src="../bootconfig.js?_dc=201912310158"></script>
<script type="text/javascript" src="./js/igca.min.js?_dc=201912310158"></script>

<script type="text/javascript">
var useLocale = "<%=lang%>";
var m$mts = "<%=mts%>";
var m$_d = "";

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

<%
	if (igc_theme != null)
	{
		out.println("ig$.theme_id=\"" + igc_theme + "\";");
	}
%>

var _report_prompt = [];
<%
String param_names = request.getParameter("param_names");
String[] params = (param_names != null && param_names.equals("") == false) ? param_names.split(";") : null;

if (params != null)
{
    for (int i=0; i < params.length; i++)
    {
        String pname = params[i];
        
        if (pname.equals("") == false)
        {
            String pvalue = request.getParameter(pname);
            
            if (pvalue != null && pvalue.equals("") == false)
            {
                out.println("_report_prompt.push({name: \"" + pname + "\", values: [{code: \"" + pvalue + "\", value: \"" + pvalue + "\"}]});\n");
            }
        }
    }
} 
%>

function loadParameter(param) {
    window._report_prompt = [];
    var i;
    for (i=0; param._report_prompt.length; i++)
    {
        window._report_prompt.push(param._report_prompt);
    }
}
</script>
<script type="text/javascript">
ig$.appInfo.apprelease = "<%= version%>";
ig$.bootconfig.cache = ig$.appInfo.apprelease + "_" + ig$.appInfo.date.replace(/[{}]/g, "");

var bc = ig$.bootconfig.boot,
    scripts,
    i, j,
    modules = ["framework", "vis", "app_dashboard", "custom"],
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
<script type="text/javascript">
$(document).ready(function() {
	var btn_logout = $("#igc_logout"),
		igc_login_dr = $("#igc_login_dr"),
		m_user = $("#m_user"),
		m_pwd = $("#m_pwd"),
		m_passwd = $("#m_passwd", m_user),
		m_logout = $("#m_logout", m_user),
		m_style = $("#m_style"),
		doc = $(document),
		body = $("body"),
		f = function(e) {
			m_user.hide();
			doc.unbind("click", f);
		},
		f1 = function(e) {
			m_style.hide();
			doc.unbind("click", f1);
		},
		b_style = $("#b_style");
	
	btn_logout.bind("click", function() {
		IG$.showLogout();
	});
	
	m_logout.bind("click", function(e) {
		e.preventDefault();
		e.stopPropagation();
		
		m_user.hide();
		doc.unbind("click", f);
		
		IG$.showLogout();
	});
	
	m_passwd.bind("click", function(e) {
		e.preventDefault();
		e.stopPropagation();

		doc.unbind("click", f);
		
		var u1 = $("#u1", m_pwd),
			u2 = $("#u2", m_pwd),
			u3 = $("#u3", m_pwd);
			
		u1.val("");
		u2.val("");
		u3.val("");
		
		m_pwd.show();
		
		m_user.hide();
	});
	
	igc_login_dr.bind("click", function(e) {
		e.stopPropagation();
		e.preventDefault();
		
		m_user.css({
			top: 20,
			left: "initial",
			right: 10
		});
		m_user.toggle();
		m_style.hide();
		doc.bind("click", f);
		doc.unbind("click", f1);
	});
	
	b_style.bind("click", function(e) {
		e.stopPropagation();
		e.preventDefault();
		
		m_style.css({
			top: 20,
			left: "initial",
			right: 10
		});
		
		m_user.hide();
		doc.unbind("click", f);
		
		m_style.toggle();
		doc.bind("click", f1);
	});
	
	window.app_themes = function(themes) {
		var m_style = $("#m_style");
		
		if (themes && m_style)
		{
			$.each(themes, function(i, theme) {
				var m = $("<li><a class='btn_button'>" + theme.name + "</a></li>").appendTo(m_style);
				
				m.bind("click", function(e) {
					e.preventDefault();
					e.stopPropagation();
					
					window.set_themes(theme.name);
					
					m_style.hide();
					doc.unbind("click", f1);
				});
			});
		}
	};
	
	window.set_themes = function(themename) {
		var vars = {}, 
			hash,
			murl = window.location.href,
			qseq = murl.indexOf("?"),
			url = qseq > 0 ? murl.substring(0, qseq) : null,
	    	hashes = qseq > 0 ? murl.slice(qseq + 1).split('&') : null,
	    	nurl,
	    	i,
	    	nseq = 0;
	    
	    if (hashes)
	    {
		    for(i = 0; i < hashes.length; i++)
		    {
		        hash = hashes[i].split('=');
		        vars[hash[0]] = hash[1];
		    }
	    }
	    
	    vars["igc_theme"] = themename;
	    
	    nurl = url + "?";
	    
	    $.each(vars, function(k, v) {
	    	nurl += (nseq > 0 ? "&" : "") + k + "=" + v;
	    	nseq++;
	    });
	    
	    window.location.replace(nurl);
	};
});

function _btn_handler(view, key) {
	if (key == "custom1")
	{
		IG$._n2("013138da-01f4ab0a", "report", null, false);
	}
}

ig$.dashboard_custom = {
	menu_loaded: function(menus, panel, snav) {
		var item = menus[0];
		snav.empty();
		panel.L3.call(panel, snav, item, 0);
	}
};
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
 	
 	<div id="navbar" class="navbar">
 		<div class="navbar-header">
 			<a class="navbar-brand">
 				<%= com.amplix.launcher.App.CompanyName %>...
 			</a>
 			<div id="navbar_dmenu" class="igc-nav-btn-menu"></div>
 		</div>
 		<div class="navbar-top-menu">
 		</div>
 		<div class="navbar-btns-cnt">
 			<ul class="navbar-btns">
 				<li class="light-blue">
 					<span class="user-info">
 						<span class="fa fa-tasks" style="font-size:14px;" id="b_style"></span><span class="igc-uname" id="igc_login_dr"><span id="igc_login_user"></span><b class="caret"></b></span> <span id="igc_logout" class="igc-logout fa-sign-out"></span>
 					</span>
 				</li>
 			</ul>
 		</div>
 	</div>
 	
 	<div id="sidebar-shortcuts" class="sidebar-shortcuts">
 		<div class="sidebar-btn sidebar-btn-d-menu">
 		</div>
 		<div class="sidebar-btn sidebar-btn-n-menu">
 		</div>
 	</div>
 	<div id="sidebar" class="sidebar">
 		<div class="side-nav">
 		</div>
 	</div>
 	
 	<div id="sidebar_fav" class="sidebar">
 		<div class="side-nav">
 		</div>
 	</div>
 	
 	<div id="breadcrumbs" class="breadcrumbs">
 		<ul class="breadcrumb">
 			<!-- li><span class="link">Home</span></li -->
 		</ul>
 		<div class="nav-search" style="display:none;">
 			<span class="input-icon">
 				<input type="text" placeholder="Search ..." class="nav-search-input" autocomplete="off"></input>
 				<i class="nav-search-icon">M</i>
 			</span>
 		</div>
 	</div>
 	
 	<ul id="m_user" class="dropdown-menu animated fadeInRight m-t-xs">
        <li><a class="btn_button" id="m_passwd">Password</a></li>
        <li class="divider"></li>
        <li><a class="btn_button" id="m_logout">Logout</a></li>
    </ul>
    
    <ul id="m_style" class="dropdown-menu animated fadeInRight m-t-xs">
    </ul>
</body>
</html>
