IG$.__chartoption.charttype.push(
	{
		label: "Word Cloud",
		charttype: "wordcloud",
		subtype: "wordcloud",
		img: "wordcloud",
		grp: "scientific"
	}
);

IG$.cVis.wordcloud = $s.extend(IG$.cVis.base, {
	draw: function(results) {
		var me = this;
		
		if (IG$.cVis.wordcloud._loading)
		{
			setTimeout(function() {
				me.draw(results);
			}, 500);
			
			return;
		}
		
		if (!IG$.cVis.wordcloud._loaded)
		{
			var js = [
					"./custom/custom.wordcloud.worker.js"
				];
			
			IG$.cVis.wordcloud._loading = 1;
			
			IG$.getScriptCache(
				js, 
				new IG$.callBackObj(this, function() {
					IG$.cVis.wordcloud._loaded = 1;
					me.draw(results);
				})
			);
		}
	},
	updatedisplay: function(w, h) {
	},

	dispose: function() {
		var me = this;

		if (me.hchart && me.hchart.dispose)
		{
			me.hchart.dispose();
			me.hchart = null;
		}
	}
});
