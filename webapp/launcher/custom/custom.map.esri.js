IG$.__chartoption.charttype = IG$.__chartoption.charttype || [];

IG$.__chartoption.charttype.push(
	{
		label:"ArcGIS map",
		charttype: "esri",
		subtype: "esri",
		img: "map_arcgis",
		grp: "map"
	}
);

IG$.__chartoption.chartext.esri = function(owner) {
	this.owner = owner;
};

IG$.__chartoption.chartext.esri.prototype = {
	drawChart: function(owner, results) {
		/**
		 * dynamic loading worker javascript and necessary arcgis javascript / css file in browser
		 */
		var me = this;
		
		if (IG$.__chartoption.chartext.esri._loading)
		{
			/**
			 * case javascript is loading and before initialization
			 * Keep monitoring drawchart api in worker is ready
			 */
			setTimeout(function() {
				me.drawChart.call(me, owner, results);
			}, 500);
			
			return;
		}
		
		/**
		 * dynamic loading based on version
		 */
		if (!IG$.__chartoption.chartext.esri._loaded)
		{
			var js;

			/**
			 * ig$.arcgis_* : management - UI configuration parameter
			 * make default variable in case the configuration is not set
			 * default value: arcgis version 3.33 latest
			 */

			me._esri_version = ig$.arcgis_version || "3.33";
			
			if (me._esri_version == "4.16")
			{
				// version 4 need proxy setting to allow COR issues
				js = [
					ig$.arcgis_css || "https://js.arcgis.com/4.16/esri/themes/light/main.css",
					ig$.arcgis_js || "https://js.arcgis.com/4.16/",
					"./custom/custom.map.esri.worker.js",
					"./custom/custom.map.esri.clustermarker.js",
					"./custom/custom.map.esri.worker.v4.js"
				];
			}
			else if (me._esri_version == "3.17")
			{
				js = [
					ig$.arcgis_css || "https://js.arcgis.com/3.17/esri/css/esri.css",
					ig$.arcgis_js || "https://js.arcgis.com/3.17/",
					"./custom/custom.map.esri.worker.v3.17.js"
				];
			}
			else
			{
				js = [
					ig$.arcgis_css || "https://js.arcgis.com/3.33/esri/css/esri.css",
					ig$.arcgis_js || "https://js.arcgis.com/3.33/",
					"./custom/custom.map.esri.worker.js"
				];
			}
			
			IG$.__chartoption.chartext.esri._loading = 1;
			
			IG$.getScriptCache(
				js, 
				new IG$.callBackObj(this, function() {
					IG$.__chartoption.chartext.esri._loaded = 1;
					me.drawChart.call(me, owner, results);
				})
			);
		}
	},

	updatedisplay: function(owner, w, h) {
		var me = this,
			map = me.map_inst;
			
		if (map)
		{
			map.resize();
		}
	}
};
