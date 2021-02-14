IG$.__chartoption.charttype = IG$.__chartoption.charttype || [];

IG$.__chartoption.charttype.push(
	{
		label:"Hierarchy Chart",
		charttype: "hierarchy",
		subtype: "hierarchy",
		img: "hierarchy",
		grp: "scientific"
	}
);

IG$.__chartoption.chartext.hierarchy = function(owner) {
	this.owner = owner;
}

IG$.__chartoption.chartext.hierarchy.prototype = {
	drawChart: function(owner, results) {
		var me = this;
		
		if (IG$.__chartoption.chartext.hierarchy._loading)
		{ 
			setTimeout(function() {
				me.drawChart.call(me, owner, results);
			}, 500);
		}
		
		if (!IG$.__chartoption.chartext.hierarchy._loaded)
		{
			var js = [
					"./custom/custom.hierarchy.module.js",
					"./custom/custom.hierarchy.worker.js"
				];
			
			IG$.__chartoption.chartext.hierarchy._loading = 1;
			
			IG$.getScriptCache(
				js, 
				new IG$.callBackObj(this, function() {
					IG$.__chartoption.chartext.hierarchy._loaded = 1;
					me.drawChart.call(me, owner, results);
				})
			);
		}
	},
	
	updatedisplay: function(owner, w, h) {
	},
	
	getExportData: IG$.__chartoption.chartext.$export_echart
};