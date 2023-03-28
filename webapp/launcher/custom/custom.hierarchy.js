IG$.__chartoption.charttype = IG$.__chartoption.charttype || [];

IG$.__chartoption.charttype.push(
	{
		label:"Hierarchy Chart",
		charttype: "hierarchy",
		subtype: "hierarchy",
		img: "hierarchy",
		grp: "scientific"
	}
);

IG$.cVis.hierarchy = $s.extend(IG$.cVis.base, {
	draw: function(results) {
		var me = this;
		
		if (IG$.cVis.hierarchy._loading)
		{ 
			setTimeout(function() {
				me.draw(results);
			}, 500);
		}
		
		if (!IG$.cVis.hierarchy._loaded)
		{
			var js = [
					"./custom/custom.hierarchy.module.js",
					"./custom/custom.hierarchy.worker.js"
				];
			
			IG$.cVis.hierarchy._loading = 1;
			
			IG$.getScriptCache(
				js, 
				new IG$.callBackObj(this, function() {
					IG$.cVis.hierarchy._loaded = 1;
					me.draw(results);
				})
			);
		}
	},
	
	updatedisplay: function(w, h) {
	},
	
	getExportData: IG$.cVis.$export_echart
});