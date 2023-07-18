<%@ page contentType="text/html; charset=utf-8" pageEncoding="utf-8"%>
<%@ page import = "com.amplix.external.CommonService" %>
<%@ page import = "java.io.FileInputStream" %>
<%@ page import = "java.io.ByteArrayOutputStream" %>
<%@ page import = "java.io.DataOutputStream" %>
<%@ page import = "java.net.URLEncoder" %>
<%
    request.setCharacterEncoding("utf-8");
    String _d = request.getParameter("_d");
    String ukey = "?_d=" + _d;
    String lang = request.getParameter("lang");
    lang = (lang == null) ? "en_US" : lang;
	
	String mts = request.getParameter("mts");
    mts = (mts == null) ? "" : mts;
    
    CommonService.processDownloadFiles(request, response);
%>