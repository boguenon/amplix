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

IG$.__chartoption.chartext.imgviewer = function(owner) {
	this.owner = owner;
}

IG$.__chartoption.chartext.imgviewer.prototype = {
	drawChart: function(owner, results) {
		var me = this;
		
		if (IG$.__chartoption.chartext.imgviewer._loading)
		{
			setTimeout(function() {
				me.drawChart.call(me, owner, results);
			}, 500);
			
			return;
		}
		
		if (!IG$.__chartoption.chartext.imgviewer._loaded)
		{
			var js = [
					"./custom/custom.imageviewer.worker.js"
				];

			IG$.__chartoption.chartext.imgviewer._loading = 1;
			
			IG$.getScriptCache(
				js, 
				new IG$.callBackObj(this, function() {
					IG$.__chartoption.chartext.imgviewer._loaded = true;
					me.drawChart.call(me, owner, results);
				})
			);
		}
	},
	
	updatedisplay: function(owner, w, h) {
	}
};