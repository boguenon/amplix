IG$.__chartoption.charttype.push(
	{
		label: "Calendar Chart",
		charttype: "calendar",
		subtype: "calendar",
		img: "calendar",
		grp: "h-stock"
	}
);

IG$.cVis.calendar = $s.extend(IG$.cVis.base, {	
	draw: function(results) {
		var me = this;
		
		if (IG$.cVis.calendar._loading)
		{
			setTimeout(function() {
				me.draw(results);
			}, 500);
			
			return;
		}
		
		if (!IG$.cVis.calendar._loaded)
		{
			var js = [
					"./custom/custom.calendar.worker.js"
				];
			
			IG$.cVis.calendar._loading = 1;
			
			IG$.getScriptCache(
				js, 
				new IG$.callBackObj(this, function() {
					IG$.cVis.calendar._loaded = 1;
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