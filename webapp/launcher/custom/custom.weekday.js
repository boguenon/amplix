IG$.__chartoption.charttype = IG$.__chartoption.charttype || [];

IG$.__chartoption.charttype.push(
	{
		label:"Heatmap",
		charttype: "weekday",
		subtype: "weekday",
		img: "weekday",
		grp: "scientific"
	}
);

IG$.__chartoption.chartext.weekday = function(owner) {
	this.owner = owner;
}

IG$.__chartoption.chartext.weekday.prototype = {
	drawChart: function(owner, results) {
		var me = this;
		
		if (IG$.__chartoption.chartext.weekday._loading)
		{ 
			setTimeout(function() {
				me.drawChart.call(me, owner, results);
			}, 500);
		}
		
		if (!IG$.__chartoption.chartext.weekday._loaded)
		{
			var js = [
					"./custom/custom.weekday.worker.js"
				];
			
			IG$.__chartoption.chartext.weekday._loading = 1;
			
			IG$.getScriptCache(
				js, 
				new IG$.callBackObj(this, function() {
					IG$.__chartoption.chartext.weekday._loaded = 1;
					me.drawChart.call(me, owner, results);
				})
			);
		}
	},
	
	updatedisplay: function(owner, w, h) {
	},
	
	getExportData: IG$.__chartoption.chartext.$export_echart
};