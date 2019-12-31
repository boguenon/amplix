<%@ page contentType="text/html; charset=utf-8" pageEncoding="utf-8"%>
<%@ page import="java.util.*" %>
<%
    request.setCharacterEncoding("utf-8");
    Date today = new Date();
    Calendar cal = Calendar.getInstance();
    cal.setTime(today);
    
    int year = cal.get(Calendar.YEAR);
    
    String prod = request.getParameter("prod");
    prod = prod == null ? "" : prod;
    if (prod.equals("trial") == false && prod.equals("dedicated") == false && prod.equals("enterprise") == false)
    {
    	String redirectURL = "http://www.amplixbi.com/main/lang_en/index.html#pricing";
        response.sendRedirect(redirectURL);
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
<title>amplix | Register</title>
    
<link href="css/bootstrap.min.css" rel="stylesheet">
<link href="font-awesome/css/font-awesome.css" rel="stylesheet">
<link href="css/igcc.min.css" rel="stylesheet">

<script type="text/javascript" src="js/jquery-2.1.1.js"></script>
<script type="text/javascript" src="js/bootstrap.min.js"></script>
<script type="text/javascript" src="js/igcc.min.js"></script>
<script type="text/javascript" src="../config.js"></script>

<script>
var cloud_prod = "<%= prod %>";
var secure_key = null;

$(document).ready(init_register);
</script>
</head>

<body class="gray-bg">
    <div class="loginColumns animated fadeInDown">
    	<div class="row">

            <div class="col-md-6">
                <h2 class="font-bold">Welcome to <a href="http://www.amplixbi.com/">amplix</a></h2>

                <p>
                    Create account to see it in action. 
                </p>

                <p>
                    Business domain email is required to get free access on cloud server.
                </p>

                <p>
                    We craft reporting, dashboard and analysys. We are AMPLIX.  
                </p>

                <p>
                    <small>The next generation BI, visualizing big data for easy analytics. Powerful, Flexible and Reasonable BI solutions, you need experience today.</small>
                </p>

            </div>
            <div class="col-md-6">
                <div id="div_form" class="ibox-content">
                    <form id="form_register" class="m-t" role="form" method="POST">
                    	<input name="encusername" type="hidden">
		            	<input name="encpassword" type="hidden">
		                <div class="form-group">
		                    <input name="username" type="text" class="form-control" placeholder="Name" required="">
		                </div>
		                <div class="form-group">
		                    <input name="useremail" type="email" class="form-control" placeholder="Email" required="">
		                </div>
		                <div class="form-group">
		                    <input id="password" name="password" type="password" class="form-control" placeholder="Password" required="">
		                    <div class="help-block">Minimum of 6 characters</div>
		                </div>
		                <div class="form-group">
		                    <input id="confirm_password" name="confirm_password" type="password" class="form-control" placeholder="Password Confirm" required="">
		                </div>
		                <div class="form-group">
		                    <div id="policy_check" class="checkbox i-checks"><label> <input type="checkbox" name="chk_policy" required=""><i></i> Agree the terms and policy <div class="form-error"></div></label></div>
		                </div>
		                
		                <div id="il_err"><span class="igc-errorinfo-msg"></span></div>
		                
                        <button id="btn_register" class="btn btn-primary block full-width m-b">Register</button>

                		<p class="text-muted text-center"><small>Already have an account?</small></p>
                		<a class="btn btn-sm btn-white btn-block" href="login.jsp">Login</a>
                    </form>
                    <p class="m-t">
                        <small>amplix we help your business success! &copy; <%=year%></small>
                    </p>
                </div>
                <div id="div_success" class="ibox-content" style="display:none;">
	                <div class="middle-box text-center animated fadeInRightBig">
	                    <h3 class="font-bold">We sent you email with secure 4-digit code.</h3>
	                    <div class="error-desc">
	                        Thank you for your registration. You will get 4-digt secure code shortly.
	                        Please enter code to verify your email address.  
	                        <br/><a id="btn_validate" class="btn btn-primary m-t">Validate</a>
	                    </div>
	                </div>
                    <p class="m-t">
                        <small>amplix we help your business success! &copy; <%=year%></small>
                    </p>
                </div>
            </div>
        </div>
        <hr/>
        <div class="row">
            <div class="col-md-6">
                Copyright amplixbi.com
            </div>
            <div class="col-md-6 text-right">
               <small>© 2014-<%=year%>amplixbi.com</small>
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
