IG$.__chartoption.charttype = IG$.__chartoption.charttype || [];

IG$.__chartoption.charttype.push(
	{
		label:"TreeHierarchy Chart",
		charttype: "treehierarchy",
		subtype: "treehierarchy",
		img: "treehierarchy",
		grp: "scientific"
	}
);

IG$.__chartoption.chartext.treehierarchy = function(owner) {
	this.owner = owner;
}

IG$.__chartoption.chartext.treehierarchy.prototype = {
	drawChart: function(owner, results) {
		var me = this;
		
		if (IG$.__chartoption.chartext.treehierarchy._loading)
		{ 
			setTimeout(function() {
				me.drawChart.call(me, owner, results);
			}, 500);
		}
		
		if (!IG$.__chartoption.chartext.treehierarchy._loaded)
		{
			var js = [
					"./custom/custom.treehierarchy.worker.js"
				];
			
			IG$.__chartoption.chartext.treehierarchy._loading = 1;
			
			IG$.getScriptCache(
				js, 
				new IG$.callBackObj(this, function() {
					IG$.__chartoption.chartext.treehierarchy._loaded = 1;
					me.drawChart.call(me, owner, results);
				})
			);
		}
	},
	
	updatedisplay: function(owner, w, h) {
	},
	
	getExportData: IG$.__chartoption.chartext.$export_echart
};