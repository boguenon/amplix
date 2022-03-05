<%@ page contentType="text/html; charset=utf-8" pageEncoding="utf-8"%>
<%@include file="locale.jsp" %>
<div id="welcome">

    <div class="col">
    	<div class="introblock" id="home_app_title">
	    	<h1>amplix Business Analytics for your business.</h1>
	    </div>
    	<div class="intro-top">
	    	<div class="introblock" id="home_app_desc">
	            Create scientific reports using amplixbi.com. 
	            amplix data science tool helps to make statistical analysis with easy guided user interfaces.
	        </div>
	        <div id="pg_links" class="intro-pg-links">

	        </div>
	    </div>
	    <div class="intro-right">
	    	<div class="intro-block">
	    		<div class="igc-last-login" id="last_login">
		        	<span class="title"><%= getLocale(lang, "USER.NAME") %></span>
		        	<span class="cur_login_user_id">-</span> (<span class="cur_login_user_nm">-</span>)
		        	<br />
		        	<span class="title"><%= getLocale(lang, "USER.LAST_LOGIN_TIME") %> : </span>
		        	<span class="last_login_time">-</span>
		        	<br />
		        	<span class="title"><%= getLocale(lang, "USER.LAST_LOGIN_HOST") %> : </span>
		        	<span class="last_login_host">-</span>
		        	<br />
		        	<span class="title"><%= getLocale(lang, "USER.CURR_LOGIN_HOST") %> : </span>
		        	<span class="cur_login_host">-</span>
		        </div>
	    	</div>
	    </div>
	    <div class="intro-line-break"></div>
        <div id="idv_intro_cnt" class="introbox introbox_1">
    		<h2 id="mbutton1">
    			Recent visit and favorites..
    		</h2>
    		<div id="idv_recitems"></div>
        	<p><!-- Vegetable oil needs treatment before it can be burned in a diesel...--></p>
        </div>
    </div>
</div>
