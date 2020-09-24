IG$.showLogin = function(callback, rs) // show login screen
{
	$("#idv-mnu-pnl").hide();

	var nmts;
	
	var max_try_count = 3;
	
	window.$sso_try_count = window.$sso_try_count || 0;

	if (!IG$._g$a)
	{
		var url_params = IG$._parse_url().params;
		nmts = url_params["mts"] || "ROOT";
	}
	
	if (IG$.dlgLogin)
	{
		IG$.dlgLogin.callback = new IG$.callBackObj(this, function() {
			$("#loginWindow").hide();
		});
	}
	
	if (window.hist)
	{
		window.hist.addHistory("");
	}
	
	var lform = $("#loginWindow"),
		login_container = $(".login-container", lform),
		mc,
		progress = $("#login-progress", lform),
		lf, sform,
		browser = window.bowser;
		
	lf = "<div class='login-smc'>"
		+ "<div class='login-ic'>"
		+ "<img class='login-logo' src='./images/logo_7186.png'>"
		+ "<div class='login-sso-msg'><span>" + 
			(useLocale == "ko_KR" ? "잠시만 기다려 주십시오." : "") + 
			(useLocale == "en_US" ? "Please Wait a minutes." : "")
			+ "<span></div>"
			+ "<div id='license'>Licensed to: " + (ig$.appInfo ? ig$.appInfo.licensed || "xxx" : "...") + "</div>";
		lf += "</div></div>";
		  
	sform = $(".login-smc", lform);
	
	if (!sform.length)
	{
		sform = $(lf).appendTo(login_container).hide();
	}
	
	mc = $(".login-mc", lform);
	
	lform.css({zIndex: 99});
	if (browser.msie)
	{
		lform.css({position: "absolute", top: 0, left: 0, right: 0, bottom: 0, width: "100%", height: "100%", margin: 0, padding: 0});
	}
	lform.show();

	var do_session = function(fkey) {
		if (IG$.sessionUtils)
		{
			var sess = IG$.dlgLogin;
			sess.getKeyPair(fkey, "", progress, IG$._g$a, 
				// login error handler
				new IG$.callBackObj(this, function(xdoc) {
					// move to portal login page if necessary
					// sform.fadeOut();
					// progress.hide();
					// mc.fadeIn();
					
					sform.show();
					mc.hide();
					
					$(".login-sso-msg", sform).html("<span>Session key expired! Please refresh browser and login again!</span>");
					progress.hide();
					
					var location_hash = window.location.href,
						lurl,
						thash,
						newhash,
						nhash,
						thashmap = {},
						retrycount = 0,
						i;
					
					if (location_hash && location_hash.indexOf("?") > 0)
					{
						lurl = location_hash.substring(0, location_hash.indexOf("?"));
						location_hash = location_hash.substring(location_hash.indexOf("?") + 1);
						thash = location_hash.split("&");
						retrycount = 0;
						
						$.each(thash, function(i, tstr) {
							if (tstr.indexOf("=") > 0)
							{
								thashmap[tstr.substring(0, tstr.indexOf("="))] = tstr.substring(tstr.indexOf("=") + 1);
							}
						});
						
						retrycount = Number(thashmap["retry"] || "0") || 0;
						
						thashmap["retry"] = "" + (++retrycount);
						
						if (retrycount < 3)
						{
							nhash = [];

							$.each(thashmap, function(i, tstr) {
								nhash.push("" + i + "=" + tstr);
							});
							
							newhash = nhash.join("&");
							window.location.href = lurl + "?" + newhash;
						}
					}
					
					if (thash && retrycount < 3)
					{
						setTimeout(function() {
							window.location.reload(false);
						}, 100);
					}
				})
			, ig$.$sso_module_name || "dbsync");
		}
		else
		{
			IG$.doStartSession(fkey, "", progress, null, new IG$.callBackObj(this, function(xdoc) {
				// move to portal login page if necessary
				sform.fadeOut();
				progress.hide();
				mc.fadeIn();
			}));
		}
	}
	
	// rs: 0 (first page load)
	// rs: 1 (logout button clicked)
	// rs: 2 (session expired)
	// rs: 3 (print page login)
	if (rs != 1 && window.$sso_try_count < max_try_count) 
	{
		sform.show();
		mc.hide();
		progress.show();
		// request automatic login
		setTimeout(function() {
			var fkey = window.$session_key || "sso_sim_b6118e61573e4aaa_key_map:";

			window.$sso_try_count++;

			if (nmts && nmts.length)
			{
				var lreq = new IG$._rpc$(),
					panel = this;
				
				lreq.init(panel,
					{
						ack: "security",
						payload: {mts: nmts},
						mbody: {}
					}, panel, function(item) {
						var p1 = item.p1,
							p2 = item.p2;
						
						if (p1 && p2)
						{
							IG$.rsaPublicKeyModules = p1;
							IG$.rsaPublicKeyExpoenent = p2;
							IG$._g$a = item.mts;
							
							do_session(fkey);
						}
						else
						{
							do_session(fkey);
						}
					}, function() {
						do_session(fkey);
					});
			
				lreq.send();
			}
			else
			{
				do_session(fkey);
			}
		}, 10);
	}
	else
	{
		if (window.$sso_try_count > max_try_count)
			return;

		// sform.hide();
		// mc.show();
		sform.show();
		mc.hide();
		$(".login-sso-msg", sform).html("<span>Session expired! Please refresh browser and login again!</span>");
		progress.hide();
	}
}