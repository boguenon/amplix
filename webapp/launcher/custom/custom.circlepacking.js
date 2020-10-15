IG$.__chartoption.charttype.push(
	{
		label: "Circle Packing",
		charttype: "circlepacking",
		subtype: "circlepacking",
		img: "circlepacking",
		grp: "scientific"
	}
);

IG$.__chartoption.chartext.circlepacking = function(owner) {
	this.owner = owner;
}

IG$.__chartoption.chartext.circlepacking.prototype = {
	drawChart: function(owner, results) {
		var me = this;
		
		if (IG$.__chartoption.chartext.circlepacking._loading)
		{
			setTimeout(function() {
				me.drawChart.call(me, owner, results);
			}, 500);
			
			return;
		}
		
		if (!IG$.__chartoption.chartext.circlepacking._loaded)
		{
			var js = [
					"./custom/d3-array.v2.min.js",
					"./custom/custom.circlepacking.worker.js"
				];
			
			IG$.__chartoption.chartext.circlepacking._loading = 1;
			
			IG$.getScriptCache(
				js, 
				new IG$.callBackObj(this, function() {
					IG$.__chartoption.chartext.circlepacking._loaded = 1;
					me.drawChart.call(me, owner, results);
				})
			);
		}
	},
	updatedisplay: function(owner, w, h) {
	}
}
