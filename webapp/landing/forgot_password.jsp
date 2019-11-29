<%@ page contentType="text/html; charset=utf-8" pageEncoding="utf-8"%>
<%@ page import="java.util.*" %>
<%@ page import="com.amplix.rpc.igcServer" %>
<%@ page import="com.amplix.model.ActionRequest" %>
<%@ page import="com.amplix.model.ActionResult" %>
<%@ page import="com.amplix.external.cloud.CloudRegisterService" %>
<%
    request.setCharacterEncoding("utf-8");
    Date today = new Date();
    Calendar cal = Calendar.getInstance();
    cal.setTime(today);
    
    int year = cal.get(Calendar.YEAR);
    
    String userLocale = request.getHeader("Accept-Language");
    // out.println(userLocale);
    Locale lc = request.getLocale();
    String userlanguage = lc.getDisplayLanguage();
    // out.println("LANG :" + lc.getLanguage());
    // out.println("DISPLAY LANG :" + lc.getDisplayLanguage());
    
    String locale = lc.toLanguageTag();
    
    locale = locale.replaceAll("-", "_");
    
    String vkey = request.getParameter("vkey");
    String vkeyuid = null;
    
    if (vkey != null && vkey.length() > 0)
    {
    	vkey = java.net.URLDecoder.decode(vkey, "UTF-8");
    	Map<String, String> vkeymap = CloudRegisterService.decodeSecureKeyValue(vkey);
    	vkeyuid = vkeymap.get("uid");
    }
%>
<!DOCTYPE html>
<html>

<head>

<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate">
<meta http-equiv="Pragma" content="no-cache">
<meta http-equiv="Expires" content="0">
<link rel="icon" href="../favicon.png" type="image/png">
<title>amplix | Forgot password</title>

<link href="css/bootstrap.min.css" rel="stylesheet">
<link href="font-awesome/css/font-awesome.css" rel="stylesheet">
<link href="css/igcc.min.css" rel="stylesheet">
    
<script type="text/javascript" src="js/jquery-2.1.1.js"></script>
<script type="text/javascript" src="js/bootstrap.min.js"></script>
<script type="text/javascript" src="js/igcc.min.js"></script>
<script type="text/javascript" src="../config.js"></script>


<script type="text/javascript">
var mts = null,
    useLocale = "<%=locale%>",
    loadingApp = "mdi";
	
$(document).ready(init_forgot_password);
</script>

</head>

<body class="gray-bg">

    <div class="passwordBox animated fadeInDown">
        <div class="row">

            <div class="col-md-12">
                <div class="ibox-content">

                    <h2 class="font-bold">Forgot password</h2>

                    <p>
                    	<% if (vkeyuid == null) { %>
                        Enter your email address. 4 digit code will be emailed to you.
                        <% } else { %>
                        Check your email and enter 4 dit code sent for password reset.
                        <% } %>
                    </p>

                    <div class="row">
						<% if (vkeyuid == null) { %>
                        <div id="div_chkpwd" class="col-lg-12">
                            <form id="form_chkpwd" class="m-t" role="form" method="POST">
                                <div class="form-group">
                                    <input id="useremail" type="email" class="form-control" placeholder="Email address" required="">
                                </div>
								
                                <button type="submit" class="btn btn-primary block full-width m-b">Send securre 4-digit code</button>
								
								<div id="il_err"><span class="igc-errorinfo-msg"></span></div>
								
                                <small>Do not have an account?</small>
                                <a href="./login.jsp" class="btn btn-sm btn-white btn-block">Login</a>
                            </form>
                            <form id="form_chkpwd_vkey" method="POST" action="forgot_password.jsp" style="display:none;">
                            	<input type="hidden" name="vkey" id="vkey">
                            	<input type="hidden" name="vkey_email" id="vkey_email">
                            </form>
                        </div>
                        <% } else { %>
                        <div id="div_reset" class="col-lg-12">
                            <form id="form_reset" class="m-t" role="form" method="POST">
                            	<input id="vkey" type="hidden" name="vkey" value="<%=vkey %>">	
								<div class="form-group">
                                    <input id="secure_code" type="text" name="secure_code" class="form-control" placeholder="4 digit secure code" required="">
                                </div>
                                
                                <button type="submit" class="btn btn-primary block full-width m-b">Confirm Code</button>
								
								<div id="il_err"><span class="igc-errorinfo-msg"></span></div>
								
								<small>Resend 4-digit code?</small>
                                <a id="btn_resend_code" class="btn btn-sm btn-white btn-block">Resend code</a>
                                
                                <small>Do not have an account?</small>
                                <a href="./login.jsp" class="btn btn-sm btn-white btn-block">Login</a>
                            </form>
                            
                        </div>
                        <% } %>
                    </div>
                </div>
            </div>
        </div>
        <hr/>
        <div class="row">
            <div class="col-md-6">
                Copyright amplixbi.com
            </div>
            <div class="col-md-6 text-right">
               <small>&copy; 2014-<%=year%></small>
            </div>
        </div>
    </div>
	<div class='login-progress'></div>
<script>
  (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
  })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');

  ga('create', 'UA-110159277-1', 'auto');
  ga('send', 'pageview');

</script>
</body>

</html>
