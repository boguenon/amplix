IG$.__chartoption.charttype = IG$.__chartoption.charttype || [];

IG$.__chartoption.charttype.push(
    {
        label: "Naver Map",
        charttype: "navermap",
        subtype: "navermap",
        img: "map_naver",
        grp: "scientific"
    }
);

IG$.__chartoption.chartext.navermap = function(owner) {
};

IG$.__chartoption.chartext.navermap.prototype = {
    drawChart: function(owner, results) {
		if (!ig$.naver_map_api_key)
		{
			IG$.alertmsg(ig$.appname, "API key is missing!", null, null, 0, "error");
			return;	
		}
		
        var me = this,
            js = [
				"https://openapi.map.naver.com/openapi/v3/maps.js?ncpClientId=" + ig$.naver_map_api_key,
                "./custom/custom.map.naver.worker.js"
            ];
        
        if (IG$.__chartoption.chartext.navermap_main)
        {
            if (me.dmain)
            {
                me.dmain.dispose();
                me.dmain = null;
            }
            
            me.dmain = new IG$.__chartoption.chartext.navermap_main(owner);
            me.dmain.drawChart.call(me.dmain, owner, results);
        }
        else
        {
            if (!IG$.__chartoption.chartext.navermap._loaded)
            {
                IG$.getScriptCache(
                    js, 
                    new IG$.callBackObj(this, function() {
                        IG$.__chartoption.chartext.navermap._loaded = 1;
                        var dmain = new IG$.__chartoption.chartext.navermap_main(owner);
                        me.dmain = dmain;
                        dmain.drawChart.call(dmain, owner, results);
                    })
                );
            }
        }
    },
    
    updatedisplay: function(owner, w, h) {
        var me = this;
        
        if (me.dmain)
        {
            me.dmain.updatedisplay.call(me.dmain, owner, w, h);
        }
    }
};