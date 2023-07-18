IG$.__chartoption.charttype = IG$.__chartoption.charttype || [];

IG$.__chartoption.charttype.push(
	{
		label: "VWorld Map",
		charttype: "vworldmap",
		subtype: "vworldmap",
		img: "map",
		grp: "map"
	}
);

IG$.cVis.vworldmap = $s.extend(IG$.cVis.base, {
	draw: function(results) {
		var me = this,
			js = [
				"./custom/custom.map.vworld.worker.js"
			];

		if (IG$.cVis.vworldmap._loading)
		{
			setTimeout(function() {
				me.draw(results);
			}, 500);
			
			return;
		}
		
		if (!IG$.cVis.vworldmap._loaded)
		{
			IG$.cVis.vworldmap._loading = 1;
			
			IG$.getScriptCache(
				js, 
				new IG$.callBackObj(this, function() {
					IG$.cVis.vworldmap._loaded = 1;
					me.draw(results);
				})
			);
		}
	},
	
	updatedisplay: function(w, h) {
	}
});