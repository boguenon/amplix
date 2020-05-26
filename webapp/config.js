var ig$ = {
    useLocale: "en_US",
    servlet: "../servlet/krcp",
    companyname: "amplix",
    appname: "amplix",
    appbg: "bg_7186.png",
    companydomain: "http://www.amplixbi.com",
    applink: "launcher/viewer.jsp?objid={objid}",
    copy: "&copy; 2005-" + (new Date()).getFullYear() + " amplixbi.com Inc. <br />ALL RIGHTS RESERVED. <br />amplix. Confidential Information",
    intropage: "navi_intro",
    timer_rsn: 300000,
    timer_ping: 0,
    basemap: "googlemap",
//    appInfo: {
//        appversion:'1.2',
//        apprelease:'1.2.060'
//    },
    isdev: true,
    vmode: 0,
    _fix_split: 0,
    register: false,
    file_encoding: [
        {name: "UTF-8", value: "UTF-8"},
        {name: "MS949", value: "MS949"},
        {name: "ISO8859-1", value: "ISO-8859-1"},
        {name: "US-ASCII", value: "US-ASCII"},
        {name: "UTF-16", value: "UTF-16"},
        {name: "UTF-16BE", value: "UTF-16BE"},
        {name: "UTF-16LE", value: "UTF-16LE"}
    ],
    mainmenu: {
        trashbin: ["admins"],
        regdb: ["admins"]
    },
    geo_encoding: [
        {name: "SGIS", value: "com.mplix.geo.SGIS"}
    ],
    chartlogo: {
        enabled: false,
        clsname: "idv-chart-credit"
    },
    toolbar: {
        enable_scheduler: true,
        ml: true,
        gfilter: true
    },
    uiconfig: {
        navigator: {
            search_hidden: true,
            list_hidden: false,
            list_pos: "south",
            show_tree_items: false
        }
    },
    maxtapcount: 15,
    session_expire: 0,
    /*
    valueselect: {
        width: 50
    },
    */
    loading_msg: "Loading... Please wait for processing",
	
    lang: [
        {code: "en_US", disp: "English", l1: "User ID", l2: "Password", l3: "Login"},
		{code: "zh_CN", disp: "Chinese Simplified", l1: "User ID", l2: "Password", l3: "Login"},
		{code: "zh_TW", disp: "Chinese Traditional", l1: "User ID", l2: "Password", l3: "Login"},
        {code: "ja_JP", disp: "Japan", l1: "ユーザーID", l2: "パスワード", l3: "ログイン"},
		{code: "ko_KR", disp: "Korean", l1: "사용자 아이디", l2: "패스워드", l3: "로그인"}
    ],
    themes: [
    	{code: "", disp: "Basic"},
    	{code: "DesertLight", disp: "Desert Light"},
    	{code: "DarkBrown", disp: "Dark Brown"}
    ],
    sheet_toolbar: [
        {name: "Custom1", key: "custom1", label: "Custom1", cls: "igc-btn-text", handler: function(view, key) {
            window._btn_handler(view, key);
        }},
        {name: "Custom2", key: "custom2", label: "Custom2", cls: "igc-btn-text", handler: function(view, key) {
            window._btn_handler(view, key);
        }}
    ],
	echarts_theme: "amplix",
	appInfo: {
		date: "202005252142",
		web_revision: "1206-4.13-133-ge65bada2"
	}
    // hide_report_help: true
};

// ig$.theme_id = "test1";