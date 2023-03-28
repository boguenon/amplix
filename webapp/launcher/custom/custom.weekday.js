IG$.__chartoption.charttype = IG$.__chartoption.charttype || [];

IG$.__chartoption.charttype.push(
	{
		label:"Heatmap",
		charttype: "weekday",
		subtype: "weekday",
		img: "weekday",
		grp: "scientific"
	}
);

IG$.cVis.weekday = $s.extend(IG$.cVis.base, {
	draw: function(results) {
		var me = this;
		
		if (IG$.cVis.weekday._loading)
		{ 
			setTimeout(function() {
				me.draw(results);
			}, 500);
		}
		
		if (!IG$.cVis.weekday._loaded)
		{
			var js = [
					"./custom/custom.weekday.worker.js"
				];
			
			IG$.cVis.weekday._loading = 1;
			
			IG$.getScriptCache(
				js, 
				new IG$.callBackObj(this, function() {
					IG$.cVis.weekday._loaded = 1;
					me.draw(results);
				})
			);
		}
	},
	
	updatedisplay: function(w, h) {
	},
	
	getExportData: IG$.__chartoption.chartext.$export_echart
});