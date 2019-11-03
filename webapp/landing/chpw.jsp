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
    
    String muid = null;
    
    if (request.getSession().getAttribute("__pwd_change_") != null)
    {
    	muid = request.getSession().getAttribute("__pwd_change_").toString();
    }
    
    String error = null;
    
    if (muid == null || (muid != null && muid.length() == 0))
    {
    	error = "Session expired!. Request password request again!";
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
	
$(document).ready(function() {
<% if (error != null) { %>
	setTimeout(function() {
		document.location.href = "./forgot_password.jsp";
	}, 5000);
<% } else { %>
	init_chpw();
<% } %>
});
</script>

</head>

<body class="gray-bg">

    <div class="passwordBox animated fadeInDown">
        <div class="row">

            <div class="col-md-12">
                <div class="ibox-content">

                    <h2 class="font-bold">Forgot password</h2>

                    <p>
                        All done. Now change your password. Remember make your password secure!
                    </p>

                    <div class="row">
                        <div id="div_form" class="col-lg-12" <%= error != null ? "style=\"display:none;\"" : "" %>>
                            <form id="form_chkpwd" class="m-t" role="form" method="POST">
				                <div class="form-group">
				                    <input id="password" name="password" type="password" class="form-control" placeholder="Password" required="">
				                    <div class="help-block">Minimum of 6 characters</div>
				                </div>
				                <div class="form-group">
				                    <input id="confirm_password" name="confirm_password" type="password" class="form-control" placeholder="Password Confirm" required="">
				                </div>
								
                                <button type="submit" class="btn btn-primary block full-width m-b">Change password</button>
								
								<div id="il_err"><span class="igc-errorinfo-msg"></span></div>
								
                                <small>Do not have an account?</small>
                                <a href="./login.jsp" class="btn btn-sm btn-white btn-block">Login</a>
                            </form>
                        </div>
                        <div id="div_success" class="ibox-content" <%= error == null ? "style=\"display:none;\"" : "" %>>
			                <div class="middle-box text-center animated fadeInRightBig">
			                    <h3 class="font-bold">Your request done successfully!</h3>
			                    <div class="error-desc">
			                    	<% if (error != null) { %>
			                    	<%= error %>
			                    	<% } else { %>
			                        Your password successfully updated.
			                        <% } %>
			                        <br/><a href="<%= error != null ? "./forgot_password.jsp" : "./login.jsp" %>" class="btn btn-primary m-t"><%= error != null ? "Try Again" : "Login" %></a>
			                    </div>
			                </div>
		                    <p class="m-t">
		                        <small>amplix we help your business success! &copy; <%=year%></small>
		                    </p>
		                </div>
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
