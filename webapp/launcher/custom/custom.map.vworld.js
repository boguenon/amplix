IG$.__chartoption.charttype = IG$.__chartoption.charttype || [];

IG$.__chartoption.charttype.push(
	{
		label: "VWorld Map",
		charttype: "vworldmap",
		subtype: "vworldmap",
		img: "map",
		grp: "map"
	}
);

IG$.__chartoption.chartext.vworldmap = function(owner) {
};

IG$.__chartoption.chartext.vworldmap.prototype = {
	drawChart: function(owner, results) {
		var me = this,
			js = [
				"./custom/custom.map.vworld.worker.js"
			];

		if (IG$.__chartoption.chartext.vworldmap._loading)
		{
			setTimeout(function() {
				me.drawChart.call(me, owner, results);
			}, 500);
			
			return;
		}
		
		if (!IG$.__chartoption.chartext.vworldmap._loaded)
		{
			IG$.__chartoption.chartext.vworldmap._loading = 1;
			
			IG$.getScriptCache(
				js, 
				new IG$.callBackObj(this, function() {
					IG$.__chartoption.chartext.vworldmap._loaded = 1;
					me.drawChart.call(me, owner, results);
				})
			);
		}
	},
	
	updatedisplay: function(owner, w, h) {
	}
};