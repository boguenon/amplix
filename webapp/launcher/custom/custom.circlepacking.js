IG$.__chartoption.charttype.push(
	{
		label: "Circle Packing",
		charttype: "circlepacking",
		subtype: "circlepacking",
		img: "circlepacking",
		grp: "scientific"
	}
);

IG$.cVis.circlepacking = $s.extend(IG$.cVis.base, {
	draw: function(results) {
		var me = this;
		
		if (IG$.cVis.circlepacking._loading)
		{
			setTimeout(function() {
				me.draw(results);
			}, 500);
			
			return;
		}
		
		if (!IG$.cVis.circlepacking._loaded)
		{
			var js = [
					"./custom/d3-array.v2.min.js",
					"./custom/custom.circlepacking.worker.js"
				];
			
			IG$.cVis.circlepacking._loading = 1;
			
			IG$.getScriptCache(
				js, 
				new IG$.callBackObj(this, function() {
					IG$.cVis.circlepacking._loaded = 1;
					me.draw(results);
				})
			);
		}
	},
	updatedisplay: function(w, h) {
	}
});
