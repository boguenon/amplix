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

IG$.cVis.navermap = $s.extend(IG$.cVis.base, {
	draw: function(results) {
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

		if (IG$.cVis.navermap._loading)
		{
			setTimeout(function() {
				me.draw(results);
			}, 500);
			return;
		}

		if (!IG$.cVis.navermap._loaded)
		{
			IG$.cVis.navermap._loading = true;
			
			IG$.getScriptCache(
				js, 
				new IG$.callBackObj(this, function() {
					IG$.cVis.navermap._loaded = 1;
					me.draw(results);
				})
			);
		}
	},
	
	updatedisplay: function(w, h) {
		var me = this;
		
		if (me.dmain)
		{
			me.dmain.updatedisplay.call(me.dmain, w, h);
		}
	}
});
