IG$.__chartoption.charttype.push(
	{
		label: "Stock Chart",
		charttype: "hstock",
		subtype: "hstock",
		img: "hstock",
		grp: "h-stock"
	}
);


IG$.cVis.hstock = $s.extend(IG$.cVis.base, {	
	draw: function(results) {
		var me = this;
		
		if (IG$.cVis.hstock._loading)
		{
			setTimeout(function() {
				me.draw(results);
			}, 500);
			
			return;
		}
		
		if (!IG$.cVis.hstock._loaded)
		{
			var js = [
					"./custom/custom.hstock.worker.js"
				];
			
			IG$.cVis.hstock._loading = 1;
			
			IG$.getScriptCache(
				js, 
				new IG$.callBackObj(this, function() {
					IG$.cVis.hstock._loaded = 1;
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