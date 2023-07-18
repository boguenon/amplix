if (!window.IG$)
{
	window.IG$ = {};
}

IG$.__amplix_loader = function(modules) {
	var bc = ig$.bootconfig.boot,
		all_modules = [],
		i;
	
	while (mod = modules.shift())
    {
        var sc = typeof(mod) == "string" ? bc[mod] : mod;
        
        if (sc && sc.length)
        {
        	for (i=0; i < sc.length; i++)
        	{
        		all_modules.push(sc[i]);
        	}
        }
    }
	
	IG$.getScriptCache(
        all_modules, 
        new IG$.callBackObj(this, function() {
            // __microloader();
        }),
        mod == "appnc"
    );
};

IG$.getScriptCache = function(scripts, callback, nocache) {
    var loaded = [],
        head= document.head, // getElementsByTagName("head")[0],
        firstScript = document.scripts[0],
        __tscripts = [],
        sclength,
        nocache_key;
    
    IG$.___loaded_scr = IG$.___loaded_scr || {}; 
    
    $.each(scripts, function(i, sc) {
    	if (sc && !IG$.___loaded_scr[sc])
    	{
    		__tscripts.push(sc);
    	}
    });
    
    sclength = __tscripts.length;
    
    var afterloaded = function() {
        if (loaded.length == sclength)
        {
            callback && callback.execute();
        }
    }
    
    if (nocache)
    {
    	var dt = new Date();
    	
    	nocache_key = 
    		"" + dt.getFullYear() + 
			(1+dt.getMonth()) +
			dt.getDate() +
			dt.getHours() + 
			"00" + // dt.getMinutes() +
			"00" // dt.getSeconds();
    }
        
    // watch scripts load in IE
    var loadScript = function(scs) {
            var sc = scs.shift(),
                script,
                is_css,
                ctag = "script",
                cache = nocache_key || ig$.bootconfig.cache;
            
            if (!sc)
            {
                return;
            }
            
            is_css = sc.indexOf(".css") == sc.length - 4;
            ctag = is_css ? "link" : ctag;
            
            if (IG$.___loaded_scr[sc])
            {
            	return;
            }
            
            IG$.___loaded_scr[sc] = 1;
            
            if ('async' in firstScript) // modern browsers
            {
                script= document.createElement(ctag);
                
                if (is_css)
                {
                    script.rel = "stylesheet";
                    script.type = "text/css";
                    script.media = "all";
                }
                else
                {
                    script.type= "text/javascript";
                    script.async = false;
                }
                
                script.onload = function() {
                    loaded.push(sc);
                    afterloaded();
                };

                script.onerror = function() {
                    throw "dynamic loader : " + this.src;
                };
                
                if (is_css)
                {
                    script.href = sc + "?sc=" + cache;
                }
                else
                {
                    script.src = sc + "?sc=" + cache;
                }
                
                head.appendChild(script);
                
                // keep loading scripts
                loadScript(scs);
            }
            else if (firstScript.readyState) // IE < 10
            {
                // create a script and add it to our toto pile
                script = document.createElement(ctag);
                if (is_css)
                {
                    script.rel = "stylesheet";
                    script.type = "text/css";
                    script.media = "all";
                }
                else
                {
                    script.type= "text/javascript";
                }
                script.onreadystatechange = function() {
                    // execute as many scripts in order as we can
                    if (this.readyState == "loaded" || this.readyState == "complete")
                    {
                        // avoid future loading events from this script (ie if src changes)
                        script.onreadystatechange = null;
                        
                        firstScript.parentNode.insertBefore(script);
                        
                        loaded.push(sc);
                        // async loading
                        // loadScript(scs);
                        
                        afterloaded();
                    }
                };
                
                if (is_css)
                {
                    script.href = sc + "?sc=" + cache;
                }
                else
                {
                    script.src = sc + "?sc=" + cache;
                }
                loadScript(src);
            }
            else
            {
                document.write("<script src='" + sc + "' type='text/javascript'></script>");
            }
        };
    
    if (!sclength)
    {
    	sclength = 0;
    	afterloaded();
    }
    else
    {
    	loadScript(__tscripts);
    }
};

if (!IG$.callBackObj)
{
	IG$.callBackObj = function(callerptr, callexec, callparam) {
		var me = this;
	    me.p1 = callerptr;
	    me.p2 = callexec;
	    me.p3 = callparam;
	}
	
	IG$.callBackObj.prototype = {
	    execute: function() {
	        var me = this,
	        	arg = arguments,
	        	marg = [],
	        	i,
				ret;
	        
	        if (me.p2)
	        {
	        	for (i=0; i < arg.length; i++)
	        	{
	        		marg.push(arg[i]);
	        	}
	        	if (me.p3)
	        	{
	        		marg.push(me.p3);
	        	}
	            ret = me.p2.apply(me.p1 || null, marg);
	        }
	        
	        return ret;
	    }
	};
}

window.useLocale = window.useLocale || ig$.useLocale;

var _amplix_load_content = [
	[
		"./css/apps.min.css",
		"./viewer/css/viewer.css",
		"./css/custom.css"
	],
	[
		"./js/igca.min.js"
	],
	"framework",
	"vis_ec", "vis_ec_theme", "app_dashboard", "appnc", "custom"
];

IG$.__amplix_loader(_amplix_load_content);

IG$.amplix_ready = function(callback) {
	IG$._amplix_ready$ = IG$._amplix_ready$ || [];
	IG$._amplix_ready$.push(callback);
}