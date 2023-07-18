IG$.__chartoption.charttype.push(
	{
		label: "Time Series",
		charttype: "nation",
		subtype: "nation",
		img: "nation",
		grp: "scientific"
	}
);

IG$.cVis.nation = $s.extend(IG$.cVis.base, {	
	draw: function(results) {
		var me = this;
		
		if (IG$.cVis.nation._loading)
		{
			setTimeout(function() {
				me.draw(results);
			}, 500);
			
			return;
		}
		
		if (!IG$.cVis.nation._loaded)
		{
			var js = [
					"./custom/custom.nation.worker.js"
				];
			
			IG$.cVis.nation._loading = 1;
			
			IG$.getScriptCache(
				js, 
				new IG$.callBackObj(this, function() {
					IG$.cVis.nation._loaded = 1;
					me.draw(results);
				})
			);
		}
	},
	updatedisplay: function(w, h) {
	},
	dispose: function() {
		var me = this;

		if (me.hchart && me.hchart.dispose)
		{
			me.hchart.dispose();
			me.hchart = null;
		}
	}
});