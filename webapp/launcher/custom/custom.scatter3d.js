IG$.__chartoption.charttype = IG$.__chartoption.charttype || [];

IG$.__chartoption.charttype.push(
	{
		label:"Scatter 3D",
		charttype: "scatter3d",
		subtype: "scatter3d",
		img: "scatter3d",
		grp: "scientific"
	}
);

IG$.cVis.scatter3d = $s.extend(IG$.cVis.base, {
	draw: function(results) {
		var me = this;
		
		if (IG$.cVis.scatter3d._loading)
		{ 
			setTimeout(function() {
				me.draw(results);
			}, 500);
		}
		
		if (!IG$.cVis.scatter3d._loaded)
		{
			var js = [
					"./custom/custom.scatter3d.worker.js"
				];
			
			IG$.cVis.scatter3d._loading = 1;
			
			IG$.getScriptCache(
				js, 
				new IG$.callBackObj(this, function() {
					IG$.cVis.scatter3d._loaded = 1;
					me.draw(results);
				})
			);
		}
	},
	
	updatedisplay: function(w, h) {
	},
	dispose: function() {
		var me = this,
			hchart = me.customchart;
	
		if (hchart)
		{
			hchart.dispose && hchart.dispose();
			hchart.destroy && hchart.destroy();
		}
	}
});