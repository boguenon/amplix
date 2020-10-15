IG$.__chartoption.charttype.push(
	{
		label: "Calendar Chart",
		charttype: "calendar",
		subtype: "calendar",
		img: "calendar",
		grp: "h-stock"
	}
);

IG$.__chartoption.chartext.calendar = function(owner) {
	this.owner = owner;
}

IG$.__chartoption.chartext.calendar.prototype = {	
	drawChart: function(owner, results) {
		var me = this;
		
		if (IG$.__chartoption.chartext.calendar._loading)
		{
			setTimeout(function() {
				me.drawChart.call(me, owner, results);
			}, 500);
			
			return;
		}
		
		if (!IG$.__chartoption.chartext.calendar._loaded)
		{
			var js = [
					"./custom/custom.calendar.worker.js"
				];
			
			IG$.__chartoption.chartext.calendar._loading = 1;
			
			IG$.getScriptCache(
				js, 
				new IG$.callBackObj(this, function() {
					IG$.__chartoption.chartext.calendar._loaded = 1;
					me.drawChart.call(me, owner, results);
				})
			);
		}
	},
	updatedisplay: function(owner, w, h) {
	},
	destroy: function() {
		var me = this;

		if (me.hchart && me.hchart.dispose)
		{
			me.hchart.dispose();
			me.hchart = null;
		}
	}
};