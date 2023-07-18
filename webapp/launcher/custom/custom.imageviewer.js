IG$.__chartoption.charttype = IG$.__chartoption.charttype || [];

IG$.__chartoption.charttype.push(
	{
		label:"Image Viewer",
		charttype: "imgviewer",
		subtype: "imgviewer",
		img: "imgviewer",
		grp: "scientific"
	}
);

IG$.cVis.imgviewer = $s.extend(IG$.cVis.base, {
	draw: function(results) {
		var me = this;
		
		if (IG$.cVis.imgviewer._loading)
		{
			setTimeout(function() {
				me.draw(results);
			}, 500);
			
			return;
		}
		
		if (!IG$.cVis.imgviewer._loaded)
		{
			var js = [
					"./custom/custom.imageviewer.worker.js"
				];

			IG$.cVis.imgviewer._loading = 1;
			
			IG$.getScriptCache(
				js, 
				new IG$.callBackObj(this, function() {
					IG$.cVis.imgviewer._loaded = true;
					me.draw(results);
				})
			);
		}
	},
	
	updatedisplay: function(w, h) {
	}
});