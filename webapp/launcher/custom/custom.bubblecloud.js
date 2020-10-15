IG$.__chartoption.charttype.push(
	{
		label: "Bubble Cloud",
		charttype: "bubblecloud",
		subtype: "bubblecloud",
		img: "bubblecloud",
		grp: "scientific"
	}
);

IG$.__chartoption.chartext.bubblecloud = function(owner) {
	this.owner = owner;
}

IG$.__chartoption.chartext.bubblecloud.prototype = {
	drawChart: function(owner, results) {
		var me = this;
		
		if (IG$.__chartoption.chartext.bubblecloud._loading)
		{
			setTimeout(function() {
				me.drawChart.call(me, owner, results);
			}, 500);
			
			return;
		}
		
		if (!IG$.__chartoption.chartext.bubblecloud._loaded)
		{
			var js = [
					"./custom/custom.bubblecloud.worker.js"
				];
			
			IG$.__chartoption.chartext.bubblecloud._loading = 1;
			
			IG$.getScriptCache(
				js, 
				new IG$.callBackObj(this, function() {
					IG$.__chartoption.chartext.bubblecloud._loaded = 1;
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
}
