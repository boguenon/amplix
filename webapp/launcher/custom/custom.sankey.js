IG$.__chartoption.charttype = IG$.__chartoption.charttype || [];

IG$.__chartoption.charttype.push(
	{
		label:"Sankey Diagram",
		charttype: "sankey",
		subtype: "sankey",
		img: "sankey",
		grp: "scientific"
	}
);

// https://maps.googleapis.com/maps/api/js?&sensor=false
IG$.cVis.sankey = $s.extend(IG$.cVis.base, {
	draw: function(results) {
		var me = this;
		
		if (IG$.cVis.sankey._loading)
		{
			setTimeout(function() {
				me.draw(results);
			}, 500);
			
			return;
		}
		
		if (!IG$.cVis.sankey._loaded)
		{
			var js = [
					"./custom/custom.sankey.worker.js"
				];

			IG$.cVis.sankey._loading = 1;
			
			IG$.getScriptCache(
				js, 
				new IG$.callBackObj(this, function() {
					IG$.cVis.sankey._loaded = 1;
					me.draw(results);
				})
			);
		}
	},

	updatedisplay: function(w, h) {
		var me = this;
		
		if (me.chartview && me.$mresult)
		{
			me.draw(me.$mresult);
		}
	},
	
	dispose: function() {
		var me = this;
	}
});

