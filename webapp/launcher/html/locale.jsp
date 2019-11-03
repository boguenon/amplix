<%@ page language="java" %>
<%@ page import="java.util.Map" %>
<%@ page import="java.util.HashMap" %>
<%!
	public final Map<String, Map<String, String>> locales = new HashMap<String, Map<String, String>>();
%>
<%!
	public void setLocale(String lang, String name, String value) {
		Map<String, String> mlocale = null;
		
		if (locales.containsKey(lang) == true)
		{
			mlocale = locales.get(lang);
		}
		else
		{
			mlocale = new HashMap<String, String>();
			locales.put(lang, mlocale);
		}
		
		mlocale.put(name, value);
	}
%>
<%!
	public String getLocale(String lang, String name) {
		String r = "*" + name;
		
		if (locales.containsKey(lang) == true)
		{
			if (locales.get(lang).containsKey(name) == true)
			{
				r = locales.get(lang).get(name);
			}
		}
		
		return r;
	}
%>
<%
	setLocale("ko_KR", "USER.NAME", "사용자명");
	setLocale("ko_KR", "USER.LAST_LOGIN_TIME", "최종 접속시간");
	setLocale("ko_KR", "USER.LAST_LOGIN_HOST", "최종 접속 HOST");
	setLocale("ko_KR", "USER.CURR_LOGIN_HOST", "현재 접속 HOST");
	
	setLocale("en_US", "USER.NAME", "User Name");
	setLocale("en_US", "USER.LAST_LOGIN_TIME", "Last login time");
	setLocale("en_US", "USER.LAST_LOGIN_HOST", "Last login host");
	setLocale("en_US", "USER.CURR_LOGIN_HOST", "Current host");
%>
<%
	String lang = request.getParameter("lang");
	
	if (lang == null)
	{
		lang = "en_US";
	}
%>