IG$.__chartoption.charttype = IG$.__chartoption.charttype || [];

IG$.__chartoption.charttype.push(
	{
		label:"TreeHierarchy Chart",
		charttype: "treehierarchy",
		subtype: "treehierarchy",
		img: "treehierarchy",
		grp: "scientific"
	}
);

IG$.cVis.treehierarchy = $s.extend(IG$.cVis.base, {
	draw: function(results) {
		var me = this;
		
		if (IG$.cVis.treehierarchy._loading)
		{ 
			setTimeout(function() {
				me.draw(results);
			}, 500);
		}
		
		if (!IG$.cVis.treehierarchy._loaded)
		{
			var js = [
					"./custom/custom.treehierarchy.worker.js"
				];
			
			IG$.cVis.treehierarchy._loading = 1;
			
			IG$.getScriptCache(
				js, 
				new IG$.callBackObj(this, function() {
					IG$.cVis.treehierarchy._loaded = 1;
					me.draw(results);
				})
			);
		}
	},
	
	updatedisplay: function(w, h) {
	},
	
	getExportData: IG$.cVis.$export_echart
});