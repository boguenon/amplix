IG$.__chartoption.charttype = IG$.__chartoption.charttype || [];

IG$.__chartoption.charttype.push(
	{
		label:"ICicle",
		charttype: "icicle",
		subtype: "icicle",
		img: "icicle",
		grp: "scientific"
	}
);

IG$.__chartoption.chartext.icicle = function(owner) {
	this.owner = owner;
};

// https://maps.googleapis.com/maps/api/js?&sensor=false

IG$.__chartoption.chartext.icicle.prototype = {
	drawChart: function(owner, results) {
		var me = this;
		
		if (IG$.__chartoption.chartext.icicle._loading)
		{
			setTimeout(function() {
				me.drawChart.call(me, owner, results);
			}, 500);
			
			return;
		}
		
		if (!IG$.__chartoption.chartext.icicle._loaded)
		{
			var js = [
					"./custom/custom.icicle.worker.js"
				];

			IG$.__chartoption.chartext.icicle._loading = 1;
			
			IG$.getScriptCache(
				js, 
				new IG$.callBackObj(this, function() {
					IG$.__chartoption.chartext.icicle._loaded = 1;
					me.drawChart.call(me, owner, results);
				})
			);
		}
	},

	updatedisplay: function(owner, w, h) {
		var me = this;
		
		if (me._owner && me._results)
		{
			me.drawChart.call(me, me._owner, me._results);
		}
	},
	
	destroy: function() {
		var me = this;
	}
};

