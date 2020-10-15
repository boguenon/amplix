IG$.__chartoption.charttype.push(
	{
		label: "Word Cloud",
		charttype: "wordcloud",
		subtype: "wordcloud",
		img: "wordcloud",
		grp: "scientific"
	}
);

IG$.__chartoption.chartext.wordcloud = function(owner) {
	this.owner = owner;
}

IG$.__chartoption.chartext.wordcloud.prototype = {
	drawChart: function(owner, results) {
		var me = this;
		
		if (IG$.__chartoption.chartext.wordcloud._loading)
		{
			setTimeout(function() {
				me.drawChart.call(me, owner, results);
			}, 500);
			
			return;
		}
		
		if (!IG$.__chartoption.chartext.wordcloud._loaded)
		{
			var js = [
					"./custom/custom.wordcloud.worker.js"
				];
			
			IG$.__chartoption.chartext.wordcloud._loading = 1;
			
			IG$.getScriptCache(
				js, 
				new IG$.callBackObj(this, function() {
					IG$.__chartoption.chartext.wordcloud._loaded = 1;
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
