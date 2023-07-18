IG$.__chartoption.charttype.push(
	{
		label: "Bubble Cloud",
		charttype: "bubblecloud",
		subtype: "bubblecloud",
		img: "bubblecloud",
		grp: "scientific"
	}
);

IG$.cVis.bubblecloud = $s.extend(IG$.cVis.base, {
	draw: function(results) {
		var me = this;
		
		if (IG$.cVis.bubblecloud._loading)
		{
			setTimeout(function() {
				me.draw(results);
			}, 500);
			
			return;
		}
		
		if (!IG$.cVis.bubblecloud._loaded)
		{
			var js = [
					"./custom/custom.bubblecloud.worker.js"
				];
			
			IG$.cVis.bubblecloud._loading = 1;
			
			IG$.getScriptCache(
				js, 
				new IG$.callBackObj(this, function() {
					IG$.cVis.bubblecloud._loaded = 1;
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
