IG$.__chartoption.charttype = IG$.__chartoption.charttype || [];

IG$.__chartoption.charttype.push(
	{
		label:"KPI Indicator",
		charttype: "kpi",
		subtype: "kpi",
		img: "kpi",
		grp: "scientific"
	}
);

IG$.__chartoption.chartext.kpi = function(owner) {
	this.owner = owner;
}

IG$.__chartoption.chartext.kpi.prototype = {
	drawChart: function(owner, results) {
		var me = this;
		
		if (IG$.__chartoption.chartext.kpi._loading)
		{
			setTimeout(function() {
				me.drawChart.call(me, owner, results);
			}, 500);
			return;
		}
		
		if (!IG$.__chartoption.chartext.kpi._loaded)
		{
			var js = [
					"./custom/custom.kpi.worker.js"
				];

			IG$.__chartoption.chartext.kpi._loading = true;
			
			IG$.getScriptCache(
				js, 
				new IG$.callBackObj(this, function() {
					IG$.__chartoption.chartext.kpi._loaded = 1;
					me.drawChart.call(me, owner, results);
				})
			);
		}
	},
	
	updatedisplay: function(owner, w, h) {
	}
};