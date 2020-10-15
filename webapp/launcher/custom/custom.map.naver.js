IG$.__chartoption.charttype = IG$.__chartoption.charttype || [];

IG$.__chartoption.charttype.push(
	{
		label: "Naver Map",
		charttype: "navermap",
		subtype: "navermap",
		img: "map_naver",
		grp: "map"
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

		if (IG$.__chartoption.chartext.navermap._loading)
		{
			setTimeout(function() {
				me.drawChart.call(me, owner, results);
			}, 500);
			return;
		}

		if (!IG$.__chartoption.chartext.navermap._loaded)
		{
			IG$.__chartoption.chartext.navermap._loading = true;
			
			IG$.getScriptCache(
				js, 
				new IG$.callBackObj(this, function() {
					IG$.__chartoption.chartext.navermap._loaded = 1;
					me.drawChart.call(me, owner, results);
				})
			);
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