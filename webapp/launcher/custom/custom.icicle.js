IG$.__chartoption.charttype = IG$.__chartoption.charttype || [];

IG$.__chartoption.charttype.push(
	{
		label:"ICicle",
		charttype: "icicle",
		subtype: "icicle",
		img: "icicle",
		grp: "scientific"
	}
);

// https://maps.googleapis.com/maps/api/js?&sensor=false

IG$.cVis.icicle = $s.extend(IG$.cVis.base, {
	draw: function(results) {
		var me = this;
		
		if (IG$.cVis.icicle._loading)
		{
			setTimeout(function() {
				me.draw(results);
			}, 500);
			
			return;
		}
		
		if (!IG$.cVis.icicle._loaded)
		{
			var js = [
					"./custom/custom.icicle.worker.js"
				];

			IG$.cVis.icicle._loading = 1;
			
			IG$.getScriptCache(
				js, 
				new IG$.callBackObj(this, function() {
					IG$.cVis.icicle._loaded = 1;
					me.draw(results);
				})
			);
		}
	},

	updatedisplay: function(w, h) {
		var me = this;
		
		if (me._results)
		{
			me.draw(me._results);
		}
	},
	
	dispose: function() {
		var me = this;
	}
});

