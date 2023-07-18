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

IG$.cVis.kpi = $s.extend(IG$.cVis.base, {
	draw: function(results) {
		var me = this;
		
		if (IG$.cVis.kpi._loading)
		{
			setTimeout(function() {
				me.draw(results);
			}, 500);
			return;
		}
		
		if (!IG$.cVis.kpi._loaded)
		{
			var js = [
					"./custom/custom.kpi.worker.js"
				];

			IG$.cVis.kpi._loading = true;
			
			IG$.getScriptCache(
				js, 
				new IG$.callBackObj(this, function() {
					IG$.cVis.kpi._loaded = 1;
					me.draw(results);
				})
			);
		}
	},
	getExportData: IG$.__chartoption.chartext.$export_html
});
