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
    
    String tmp = params.get("mts");
    tmp = (tmp == null) ? "" : tmp;
    
    String theme = params.get("theme");
    
    String version = com.amplix.rpc.igcServer.version;
    
     // sso related function
    // case : hide security information on session variable and use in sso module
    // javax.servlet.http.HttpSession session = request.getSession(true);
    // exaple key - value transfer to sso java class
    // session.setAttribute("__sso_info", "sso_sim_b6118e61573e4aaa_key_map:admin");
    // session.setAttribute("__sso_val_svr", "admins");
    // end of sso related function 
    
    boolean is_debug = (params.get("debug") != null && params.get("debug").equals("true") ? true : false);
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
<link rel="stylesheet" type="text/css" href="./css/bootstrap.3.3.7.min.css"/>
<link rel="stylesheet" type="text/css" href="./css/apps.min.css?_dc=202501030718" />
<link rel="stylesheet" type="text/css" href="./css/custom_lang_<%=lang.toLowerCase()%>.css?_dc=202501030718" />
<link rel="stylesheet" type="text/css" href="./css/dworks.min.css?_dc=202501030718" />
<link rel="stylesheet" type="text/css" href="./css/dataworks.css?_dc=202501030718" />

<%
if (theme != null && theme.length() > 0)
{
	out.println("<link rel=\"stylesheet\" type=\"text/css\" href=\"./css/" + theme.toLowerCase() + ".css?_dc=202501030718\" />");
}
%>
<link rel="stylesheet" type="text/css" href="./css/custom.css?_dc=202501030718" />
<script type="text/javascript" src="./js/jquery-3.6.4.min.js"></script>
<script type="text/javascript" src="./js/bootstrap.3.3.7.min.js"></script>
<script type="text/javascript" src="../config.js?_dc=202501030718"></script>
<script type="text/javascript" src="../bootconfig<%=(is_debug ? "_debug" : "")%>.js?_dc=202501030718"></script>
<script type="text/javascript" src="./js/igca<%=(is_debug ? "" : ".min")%>.js?_dc=202501030718"></script>
<script type="text/javascript" src="./js/igcdw.min.js?_dc=202501030718"></script>
<script type="text/javascript">

var useLocale = "<%=lang%>";
var m$mts = "<%=mts%>";
var m$_d = "";
var m$dw = 1;
// var use_session_key = true;

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

IG$.__ep_ = "<%=tmp%>";

<%
if (theme != null && theme.length() > 0)
{
	out.println("ig$.theme_id=\"" + theme + "\";");
}
%>

var modules = [
	"framework", 
	"app_dataworks", 
	"appnc", 
	"vis_ec", 
	"vis_ec_theme", 
	"dataworks_main",
	"custom",
	"summernote"]; // , "sso", "./custom/sso_client.police.js"];
IG$.__microloader(modules, function() {
	$s.ready(function() {
		var instance = new IG$.amplix_instance({
			target: $("body")
		});
		
		instance.create();
	});
});
</script>
</head>
<body scroll="no">
<div id="wrapper" style="width: 100%; height: 100%">
	<div id="wrapper">
		<nav class="navbar-default navbar-static-side" role="navigation">
		    <div class="sidebar-collapse">
		        <ul class="nav metismenu" id="side-menu">
		            <li class="nav-header">
		                <div id="logo_normal" class="dropdown profile-element">
		                    <a data-toggle="dropdown" class="dropdown-toggle" href="#">
		                    	<span class="clear"> 
		                    		<span class="block m-t-xs"> 
		                    			<strong id="logo_txt" class="font-bold">amplix</strong>
		                    		</span> 
		                    		<!-- 
		                    		<span class="text-muted text-xs block">Art Director <b class="caret"></b></span>
		                    		 --> 
		                    	</span> 
		                    </a>
		                    <!-- 
		                    <ul class="dropdown-menu animated fadeInRight m-t-xs">
		                        <li><a href="profile.html">Profile</a></li>
		                        <li><a href="contacts.html">Contacts</a></li>
		                        <li><a href="mailbox.html">Mailbox</a></li>
		                        <li class="divider"></li>
		                        <li><a href="login.html">Logout</a></li>
		                    </ul>
		                     -->
		                </div>
		                <div id="logo_small" class="logo-element">
		                    AMP
		                </div>
		            </li>
		        </ul>
		    </div>
		</nav>
	</div>
	<div id="wrapper" style="width: 100%; height: 100%;">
		<div id="page-wrapper" class="gray-bg dashbard-1" style="overflow-x: hidden;overflow-y: auto;">
			<div class="row border-bottom">
		        <nav class="navbar navbar-static-top" role="navigation" style="margin-bottom: 0">
		            <div class="navbar-header">
		                <a class="navbar-minimalize minimalize-styl-2 btn btn-primary " href="#"><i class="fa fa-bars"></i> </a>
		                <!-- form role="search" class="navbar-form-custom" action="search_results.html">
		                    <div class="form-group">
		                        <input type="text" amp_type="placeholder" amp_locale="B_SEARCH" placeholder="Search for something..." class="form-control" name="top-search" id="top-search">
		                    </div>
		                </form -->
		            </div>
		            <ul class="nav navbar-top-links navbar-right">
		                <li>
		                    <span class="m-r-sm text-muted welcome-message" amp_type="locale" amp_locale="L_WELCOME">Welcome to amplix.</span>
		                </li>
		                <li class="dropdown">
		                    <a class="dropdown-toggle count-info" data-toggle="dropdown" href="#">
		                    <i class="fa fa-envelope"></i>  <span class="label label-warning">16</span>
		                    </a>
		                    <ul class="dropdown-menu dropdown-messages">
		                        <li>
		                            <div class="dropdown-messages-box">
		                                <a href="profile.html" class="pull-left">
		                                <!-- img alt="image" class="img-circle" src="img/a7.jpg" -->
		                                </a>
		                                <div class="media-body">
		                                    <small class="pull-right">46h ago</small>
		                                    <strong>Mike Loreipsum</strong> started following <strong>Monica Smith</strong>. <br>
		                                    <small class="text-muted">3 days ago at 7:58 pm - 10.06.2014</small>
		                                </div>
		                            </div>
		                        </li>
		                        <li class="divider"></li>
		                        <li>
		                            <div class="dropdown-messages-box">
		                                <a href="profile.html" class="pull-left">
		                                <!-- img alt="image" class="img-circle" src="img/a4.jpg" -->
		                                </a>
		                                <div class="media-body ">
		                                    <small class="pull-right text-navy">5h ago</small>
		                                    <strong>Chris Johnatan Overtunk</strong> started following <strong>Monica Smith</strong>. <br>
		                                    <small class="text-muted">Yesterday 1:21 pm - 11.06.2014</small>
		                                </div>
		                            </div>
		                        </li>
		                        <li class="divider"></li>
		                        <li>
		                            <div class="dropdown-messages-box">
		                                <a href="profile.html" class="pull-left">
		                                </a>
		                                <div class="media-body ">
		                                    <small class="pull-right">23h ago</small>
		                                    <strong>Monica Smith</strong> love <strong>Kim Smith</strong>. <br>
		                                    <small class="text-muted">2 days ago at 2:30 am - 11.06.2014</small>
		                                </div>
		                            </div>
		                        </li>
		                        <li class="divider"></li>
		                        <li>
		                            <div class="text-center link-block">
		                                <a href="mailbox.html">
		                                <i class="fa fa-envelope"></i> <strong>Read All Messages</strong>
		                                </a>
		                            </div>
		                        </li>
		                    </ul>
		                </li>
		                <li class="dropdown">
		                    <a class="dropdown-toggle count-info" data-toggle="dropdown" href="#">
		                    <i class="fa fa-bell"></i>  <span class="label label-primary">8</span>
		                    </a>
		                    <ul class="dropdown-menu dropdown-alerts">
		                        <li>
		                            <a href="mailbox.html">
		                                <div>
		                                    <i class="fa fa-envelope fa-fw"></i> You have 16 messages
		                                    <span class="pull-right text-muted small">4 minutes ago</span>
		                                </div>
		                            </a>
		                        </li>
		                        <li class="divider"></li>
		                        <li>
		                            <a href="profile.html">
		                                <div>
		                                    <i class="fa fa-twitter fa-fw"></i> 3 New Followers
		                                    <span class="pull-right text-muted small">12 minutes ago</span>
		                                </div>
		                            </a>
		                        </li>
		                        <li class="divider"></li>
		                        <li>
		                            <a href="grid_options.html">
		                                <div>
		                                    <i class="fa fa-upload fa-fw"></i> Server Rebooted
		                                    <span class="pull-right text-muted small">4 minutes ago</span>
		                                </div>
		                            </a>
		                        </li>
		                        <li class="divider"></li>
		                        <li>
		                            <div class="text-center link-block">
		                                <a href="notifications.html">
		                                <strong>See All Alerts</strong>
		                                <i class="fa fa-angle-right"></i>
		                                </a>
		                            </div>
		                        </li>
		                    </ul>
		                </li>
		                <li>
		                    <a href="" id="btn_login">
		                    	<i class="fa fa-sign-out"></i> <span amp_type="locale" amp_locale="L_LOGOUT">Log out</span>
		                    </a>
		                </li>
		                <li>
		                    <a class="right-sidebar-toggle" id="btn_style">
		                    <i class="fa fa-tasks"></i>
		                    </a>
		                </li>
		            </ul>
		        </nav>
		    </div>
		    
			<div id="tab_wrapper">
				
				
			</div>
		    <div class="footer">
	            <div class="pull-right">
	                10GB of <strong>250GB</strong> Free.
	            </div>
	            <div>
	                <strong>Copyright</strong> amplixbi.com &copy; 2014-2017
	            </div>
	        </div>
		</div>
	</div>
</div>
<div id="loading-mask" style=""></div>
<div id="loading">
    <div class="cmsg">
        <div class="msg">Loading amplix...</div>
        <div class="lpb">
            <div id="lpt" style="width: 10%;"></div>
        </div>
    </div>
</div>
</body>
</html>
