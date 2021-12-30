IG$.__chartoption.charttype = IG$.__chartoption.charttype || [];

IG$.__chartoption.charttype.push(
	{
		label:"Hierarcial Graph Chart",
		charttype: "hierarchialgraph",
		subtype: "hierarchialgraph",
		img: "hierarchialgraph",
		grp: "scientific"
	}
);

IG$.__chartoption.chartext.hierarchialgraph = function(owner) {
	this.owner = owner;
}

IG$.__chartoption.chartext.hierarchialgraph.prototype = {
	drawChart: function(owner, results) {
		var me = this;
		
		if (IG$.__chartoption.chartext.hierarchialgraph._loading)
		{ 
			setTimeout(function() {
				me.drawChart.call(me, owner, results);
			}, 500);
		}
		
		if (!IG$.__chartoption.chartext.hierarchialgraph._loaded)
		{
			var js = [
					"./custom/custom.hierarchial_graph.worker.js"
				];
			
			IG$.__chartoption.chartext.hierarchialgraph._loading = 1;
			
			IG$.getScriptCache(
				js, 
				new IG$.callBackObj(this, function() {
					IG$.__chartoption.chartext.hierarchialgraph._loaded = 1;
					me.drawChart.call(me, owner, results);
				})
			);
		}
	},
	
	updatedisplay: function(owner, w, h) {
	},
	
	getExportData: IG$.__chartoption.chartext.$export_echart
};