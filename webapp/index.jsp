<%@ page contentType="text/html; charset=utf-8" pageEncoding="utf-8"%>
<%
    request.setCharacterEncoding("utf-8");
    java.text.SimpleDateFormat formatter = new java.text.SimpleDateFormat("yyyyMMddHHmmss");
    String _d = formatter.format(new java.util.Date());
    
    String uri = request.getServerName();
%>
<!DOCTYPE html>
<html>
  <head>
    <title>amplix</title>
    <meta http-equiv="X-UA-Compatible" content="chrome=IE8">
    <meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate">
	<meta http-equiv="Pragma" content="no-cache">
	<meta http-equiv="Expires" content="0">
    <link rel="stylesheet" href="./main/css/main.min.css?_dc=202202041103" />
<!--[if lt IE 9]>
    <link rel="stylesheet" href="./main/css/mainpage_ie.css" />
<![endif]-->
    <link rel="icon" href="./favicon.png" type="image/png">
    <script type="text/javascript" src="./main/js/jquery-3.5.1.min.js"></script>
    <script type="text/javascript">
    var __mts_id = null;
    var __uri = "<%=uri%>";
   	</script>
   	<script type="text/javascript" src="./config.js?_dc=202202041103"></script>
    <script type="text/javascript" src="./main/js/main.min.js?_dc=202202041103"></script>
</head>
<body class="index nav-light hoverable">
	

	<div id="header" class="header" role="banner">
	   <div class="header-item with-site-logo">
	      <a class="site-logo site-logo-link" href="./">
	         <div class="site-logo-image">
	            amplix
	         </div>
	      </a>
	   </div>
	   <div class="nav nav-site" data-nav-name="mobile">
	      <ul>
	         <li>
	            <a class="meet" href="http://www.amplixbi.com/">Who we are</a>
	         </li>
	         <li class="mobile-is-hidden device-is-hidden">
	            <a class="download" href="http://www.amplixbi.com/en/download.jsp">Download</a>
	         </li>
	         <li class="last-default">
	            <a class="help" href="http://www.amplixbi.com/en/manual/">Help</a>
	         </li>
	         <li class="mobile-is-hidden float-in">
	            <a id="btn_maintop" class="go-to-drive get-started" href="">Go to Top</a>
	         </li>
	      </ul>
	   </div>
	   <div class="mobile-nav-toggle js-mobilenav">
	      <div class="icon toggle-nav-open js-mobilenav-toggle icon-mobile-open" data-target-nav="mobile"></div>
	      <div class="icon icon-mobile-close toggle-nav-closed js-mobilenav-toggle-close" data-target-nav="mobile"></div>
	   </div>
	</div>
	
	

	<div class="section section-intro section-panel-fullscreen js-fullscreen" style="opacity: 1;">
	   <div class="section-photo-fullscreen section-photo js-parallax-image js-responsive-image loaded" data-breakpoints="320,768,1024,1200,1600" data-known-dimensions="false" data-origin="0" data-preserve-aspect-ratio="false" data-reverse-parallax="true" data-src="./main/images/home/intro.jpg" style="height: 872px; background-image: url(./main/images/main_bg.png);"></div>
	   <div class="section-centered section-vertical-align js-vertical-align js-parallax-image" data-origin="0" data-parallax-fade="true" data-parallax-speed="3" data-reverse-parallax="true" style="opacity: 1;">
	      <div class="one-whole">
	         <h1 class="section-headline section-headline-large section-headline-white">
	            Scientific Analytics, ready for you
	         </h1>
	         <a class="maia-button button-download mobile-is-hidden get-started" href="#start">Go to Demo</a>
	      </div>
	   </div>
	   <div class="arrow-hint">
	      <a class="gweb-smoothscroll-control" href="#start">
	         <div class="icon icon-arrow-hint animated-arrow-1"></div>
	         <div class="icon icon-arrow-hint animated-arrow-2"></div>
	      </a>
	   </div>
	</div>
	




	<div class="unfixed-wrapper" id="start" style="opacity: 1;">
	   <div id="nav-tick" style="top: -68px;"></div>
	   <div class="section section-filetypes js-hinted-fullscreen" style="height: 303px">
	      <div class="content">
	      	
	         <div class="column column-left with-example">
	         	<div class="category-panels-container">
				    <div class="category-panel">
				        <div class="category-tab-summary">
				            <div class="text-group-category">
				                <div class="category-title">Applications</div>
				                <div class="category-desc">
				                    <div>Make, Create and Innovate.</div>
				                </div>
				            </div>
				        </div>
				        <div class="service-list-background-container">
				            <div class="service-two-columns2">
				                <div class="service-summary2">
				                    <div class="text-group-service">
				                        <div class="service-title-preview-layout">
				                            <div class="service-name-summary-tab" data-trackas="service-name-summary-tab">        
				                            	<a id="btn_item1" href="">Analytics Builder</a>
				                            </div>
				                        </div>
				                        <div class="service-title-summary-tab">Provides statistical analytics framework make you to be a power users.</div>
				                    </div>
				                </div>
				            </div>
							<!--
				            <div class="service-two-columns2">
				                <div class="service-summary2">
				                    <div class="text-group-service">
				                        <div class="service-title-preview-layout">
				                            <div class="service-name-summary-tab" data-trackas="service-name-summary-tab">        
				                            	<a id="btn_item2" href="">Dashboard</a>
				                            </div>
				                        </div>
				                        <div class="service-title-summary-tab">Interactive dashboard with dynamic filtering.</div>
				                    </div>
				                </div>
				            </div>
							-->
							<!--
				            <div class="service-two-columns2">
				                <div class="service-summary2">
				                    <div class="text-group-service">
				                        <div class="service-title-preview-layout">
				                            <div class="service-name-summary-tab" data-trackas="service-name-summary-tab">        
				                            	Mobile
				                            </div>
				                        </div>
				                        <div class="service-title-summary-tab">Standard Web3.0 Mobile Screen without furthur development. (Under Development)</div>
				                    </div>
				                </div>
				            </div>
							-->
				        </div>
				    </div>
				</div>
				
	         </div>
	         <div class="column column-right with-copy">
	            <div class="copy text-left">
	               <h2 class="heading-headline">
	                  Click applications to work with
	               </h2>
	               <p class="section-body allow-orphan">
	                  Full web integration of Apache R statistical engine, and various visualization chart on single Business Analysis Framework. Build your report and view in dashboard without IT support.
	               </p>
	            </div>
	         </div>
	      </div>
	   </div>
	   
	</div>
	
	

	<div class="maia-footer" id="maia-footer">
	    <div id="maia-footer-global">
	        <div class="maia-aux">
	            <div class="maia-locales">
	                <label>
	                    <select id="b_loc">
	                        <option selected="" value="en_US">English</option>
	                        <option value="zh_CN">Chinese Simplified</option>
	                        <option value="zh_TW">Chinese Traditional</option>
	                        <option value="ja_JP">Japanese</option>
	                        <option value="ko_KR">Korean</option>
	                    </select>
	                </label>
	            </div>
	            <ul>
	                <li>
	                    <a href="/">&copy; amplixbi.com All rights reserved.</a>
	                </li>
	                <li>
	                    <a href="./about.html">About amplix</a>
	                </li>
	                <li>
	                    <a href="./policy.html">Privacy &amp; Terms</a>
	                </li>
	            </ul>
	        </div>
	    </div>
	</div>
</body>
</html>