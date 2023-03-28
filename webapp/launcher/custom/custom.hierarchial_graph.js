IG$.__chartoption.charttype = IG$.__chartoption.charttype || [];

IG$.__chartoption.charttype.push(
	{
		label:"Hierarcial Graph Chart",
		charttype: "hierarchialgraph",
		subtype: "hierarchialgraph",
		img: "hierarchialgraph",
		grp: "scientific"
	}
);

IG$.cVis.hierarchialgraph = $s.extend(IG$.cVis.base, {
	draw: function(results) {
		var me = this;
		
		if (IG$.cVis.hierarchialgraph._loading)
		{ 
			setTimeout(function() {
				me.draw(results);
			}, 500);
		}
		
		if (!IG$.cVis.hierarchialgraph._loaded)
		{
			var js = [
					"./custom/custom.hierarchial_graph.worker.js"
				];
			
			IG$.cVis.hierarchialgraph._loading = 1;
			
			IG$.getScriptCache(
				js, 
				new IG$.callBackObj(this, function() {
					IG$.cVis.hierarchialgraph._loaded = 1;
					me.draw(results);
				})
			);
		}
	},
	
	updatedisplay: function(w, h) {
	},
	
	getExportData: IG$.cVis.$export_echart
});