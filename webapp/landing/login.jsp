<%@ page contentType="text/html; charset=utf-8" pageEncoding="utf-8"%>
<%@ page import="java.util.*" %>
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
%>
<!DOCTYPE html>
<html>

<head>

<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate">
<meta http-equiv="Pragma" content="no-cache">
<meta http-equiv="Expires" content="0">
<title>amplix | Login</title>

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

$(document).ready(init_login);
</script>

</head>

<body class="gray-bg">
    <div class="loginColumns animated fadeInDown">
    	<div class="row">

            <div class="col-md-6">
                <h2 class="font-bold">Welcome to <a href="http://www.amplixbi.com/">amplix</a></h2>

                 <p>
                    More than dashboard and reporting without any programming effort.
                </p>

                <p>
                    To make intuitive data visualization takes a lot effort. Reduce time to analysis with our R statistics and Python integration.
                </p>

                <p>
                    We are proud to introduce all of our great features. These are few that milestone key factors why you need choose us.
                </p>

                <p>
                    <small>Demo request or business enquiry is always open for you. We hope to contribute your successful business.</small>
                </p>

            </div>
            <div class="col-md-6">
                <div class="ibox-content">
                    <form id="form_login" class="m-t" role="form" method="POST">
                        <div class="form-group">
                            <input id="userid" type="email" class="form-control" placeholder="Username" required="">
                        </div>
                        <div class="form-group">
                            <input id="userpassword" type="password" class="form-control" placeholder="Password" required="">
                        </div>
                        <button id="btn_login" type="submit" class="btn btn-primary block full-width m-b">Login</button>
                        
                        <div id="il_err"><span class="igc-errorinfo-msg"></span></div>

                        <a href="./forgot_password.jsp">
                            <small>Forgot password?</small>
                        </a>

                        <p class="text-muted text-center">
                            <small>Do not have an account?</small>
                        </p>
                        <a class="btn btn-sm btn-white btn-block" href="register.jsp">Create an account</a>
                    </form>
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
