<%@ page contentType="text/html; charset=utf-8" pageEncoding="utf-8"%>
<%
    request.setCharacterEncoding("utf-8");
	String redirectURL = "./launcher/login.jsp?lang=ko_KR&app=mdi&mts=ROOT";
	response.sendRedirect(redirectURL);
%>