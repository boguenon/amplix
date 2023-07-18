/**
 * @module framework/login/custom/sso_client
 * @desc sso login loader
 */


/**
 * override show login
 * rs: 0 (first page load)
 * rs: 1 (logout button clicked)
 * rs: 2 (session expired)
 * rs: 3 (print page login)
 *
 * ig$.$sso_module_name : module short name to specify single sign on server class
 * @param rs {integer} login source
 * @memberof module:framework/login/custom/sso_client
 */
IG$.showLogin = function(instance, callback, rs, __encrypt) // show login screen
{
	$("#idv-mnu-pnl", instance.target).hide();

	var nmts,
		dlgLogin = instance.dlgLogin;
	
	window.$sso_try_count = window.$sso_try_count || 0;

	if (!IG$._g$a)
	{
		var url_params = IG$._parse_url().params;
		nmts = url_params["mts"] || "ROOT";
	}
	
	if (dlgLogin)
	{
		dlgLogin.callback = new IG$.callBackObj(this, function() {
			$("#loginWindow", instance.target).hide();
			IG$.showLoginProc.call(this, instance);
		});
	}
	
	if (window.hist)
	{
		window.hist.addHistory("");
	}
	
	var lform = $("#loginWindow", instance.target),
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
			var sess = instance.dlgLogin;
			
			if (__encrypt == false)
			{
				var req = new IG$._rpc$();
				
				var encpwd = [fkey, ""];
				// passwd = encpwd.toString(CryptoJS.enc.Hex);
				req.init(sess, 
					{
						ack: "login",
						payload: {userid: encpwd[0], passwd: encpwd[1], sso_module: ig$.$sso_module_name || "dbsync", encrypt: "no", keyvar: instance.rsa_kinfo},
						mbody: {lang: useLocale, mts: IG$._g$a || "", app: '', session_expire: ("" + ig$.session_expire) || "0"}
					}, sess, sess.rdoStartSession, function(xdoc) {
						var r;
						
						if (callback)
							r = callback.execute(xdoc);
						
						if (progress)
						{
							progress.hide();
						}
						
						return r;
					}, progress);
				req.send();
			}
			else
			{
				sess.getKeyPair(fkey, "", progress, IG$._g$a, 
					// login error handler
					new IG$.callBackObj(this, function(xdoc) {
						// move to portal login page if necessary
						// sform.fadeOut();
						// progress.hide();
						// mc.fadeIn();
						
						sform.show();
						mc.hide();
						
						ig$.$sso_config = ig$.$sso_config || {};
						
						$(".login-sso-msg", sform).html(ig$.$sso_config.sso_fail_msg || "<span>Session key expired! Please refresh browser and login again!</span>");
						progress.hide();
						
						var location_hash = window.location.href,
							lurl,
							thash,
							newhash,
							nhash,
							thashmap = {},
							retrycount = 0,
							bproc,
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
							
							if (window.$sso_try_count > 0 && retrycount < window.$sso_try_count)
							{
								nhash = [];
	
								$.each(thashmap, function(i, tstr) {
									nhash.push("" + i + "=" + tstr);
								});
								
								newhash = nhash.join("&");
								
								bproc = 1;
								
								setTimeout(function() {
									window.location.href = lurl + "?" + newhash;
								}, 5000);
							}
						}
						
						if (!bproc && thash && window.$sso_try_count > 0 && retrycount < window.$sso_try_count)
						{
							bproc = 1;
							
							setTimeout(function() {
								window.location.reload(false);
							}, 5000);
						}
						else if (!bproc)
						{
							ig$.$sso_config = ig$.$sso_config || {};
							
							if (ig$.$sso_config.sso_fail_handler)
							{
								ig$.$sso_config.sso_fail_handler.apply(null);
							}
						}
						
						return false;
					})
				, ig$.$sso_module_name || "dbsync");
			}
		}
		else
		{
			IG$.doStartSession(instance, fkey, "", progress, null, new IG$.callBackObj(this, function(xdoc) {
				// move to portal login page if necessary
				sform.fadeOut();
				progress.hide();
				mc.fadeIn();
			}), {
				sso_module: ig$.$sso_module_name || "dbsync"
			});
		}
	}
	
	// rs: 0 (first page load)
	// rs: 1 (logout button clicked)
	// rs: 2 (session expired)
	// rs: 3 (print page login)
	// rs: 5 (loginstatus result session invalid)
	if (rs == 5)
	{
		// do nothing
		progress.show();
	}
	else if (rs != 1) 
	{
		sform.show();
		mc.hide();
		progress.show();
		// request automatic login
		setTimeout(function() {
			var fkey = window.$session_key || "sso_sim_b6118e61573e4aaa_key_map:";

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
							instance.rsaPublicKeyModules = p1;
							instance.rsaPublicKeyExpoenent = p2;
							instance.rsa_kinfo = item.p3;
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
			
				lreq.send(instance);
			}
			else
			{
				do_session(fkey);
			}
		}, 10);
	}
	else
	{
		ig$.$sso_config = ig$.$sso_config || {};
		
		// sform.hide();
		// mc.show();
		sform.show();
		mc.hide();
		$(".login-sso-msg", sform).html(ig$.$sso_config.logout_msg || "<span>Session expired! Please refresh browser and login again!</span>");
		progress.hide();
	}
}