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
    
    String vemail = null;
    
    String validatedUrl = null;
    String validatedMsg = null;
    
    if (vkey != null && vkey.length() > 0)
    {
    	Map<String, String> vkeymap = CloudRegisterService.decodeSecureKeyValue(vkey); 
    	if (vkeymap.containsKey("email"))
    	{
    		vemail = vkeymap.get("email");
    	}
    	
    	String clientIP = request.getRemoteAddr();
		String hostname = clientIP; // req.getRemoteHost();
    	
    	ActionRequest areq = new ActionRequest();
		areq.ack_value = "validate_regcode";
		areq.option = vkeymap;
		igcServer m_base = (igcServer) getServletContext().getAttribute("_mecserver_");
		CloudRegisterService regservice = new CloudRegisterService(m_base, null, areq, false, false, request.getSession(true), false, clientIP, hostname);
		ActionResult aret = regservice.processRequest();
		
		Map<String, String> data = aret.result != null ? (Map<String, String>) aret.result : null;
    	
   		if (aret.errorcode == null)
   		{
   			if (data != null && data.containsKey("mts"))
   			{
   				validatedUrl = "http://cloud.amplixbi.com/go?";
   				validatedMsg = "You are validated and account is ready.";
   			}
   			else
   			{
   				validatedUrl = "http://www.amplixbi.com/";
   				validatedMsg = "Thank you for confirming your email.";
   			}
   		}
   		else
   		{
   			if (aret.errorcode.equals("0x0504")) // already verified
   			{
   				validatedUrl = "http://www.amplixbi.com/";
   				validatedMsg = "You are validated and we will send you instance detail on your email soon!";
   			}
   			else if (aret.errorcode.equals("0x0506")) // key expired
   			{
   				validatedUrl = "http://cloud.amplixbi.com/landing/register.jsp?prod=trial";
   				validatedMsg = "Your key expired and need to register again.";
   			}
   		}
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
<title>amplix | validate</title>

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
	<% if (validatedUrl != null) { %>
		setTimeout(function() {
			document.location.href = "<%= validatedUrl%>";
		}, 5000);
	<% } else { %>
	init_validate();
    <% } %>
});
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
                <div id="div_form" class="ibox-content" <%= (validatedUrl != null ? "style=\"display:none;\"" : "") %>>
                    <form id="form_login" class="m-t" role="form" method="POST">
                        <div class="form-group">
                            <input id="email" type="email" class="form-control" placeholder="Your email" required="" value="<%= (vemail != null ? vemail : "") %>">
                        </div>
                        <div class="form-group">
                            <input id="vcode" type="text" class="form-control" placeholder="4-digit validate code" required="">
                        </div>
                        <button id="btn_login" type="submit" class="btn btn-primary block full-width m-b">Validate</button>
                        
                        <div id="il_err"><span class="igc-errorinfo-msg"></span></div>
                    </form>
                    <p class="m-t">
                        <small>amplix we help your business success! &copy; <%=year%></small>
                    </p>
                </div>
                <div id="div_success" class="ibox-content" <%= (validatedUrl == null ? "style=\"display:none;\"" : "") %>>
	                <div class="middle-box text-center animated fadeInRightBig">
	                    <h3 class="font-bold">We are working for your request!</h3>
	                    <div class="error-desc">
	                    	<% if (validatedMsg == null) { %>
	                        Thank you for your registration. The tenant for your email domain will be created shortly and will send you email for our new email.
	                        <% } else { %>
	                        <%= validatedMsg %>
	                        <% } %>
	                        <br/><a href="<%= (validatedUrl != null ? validatedUrl : "http://www.amplixbi.com/") %>" class="btn btn-primary m-t">Home</a>
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
               <small>© 2014-<%=year%> amplixbi.com</small>
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
