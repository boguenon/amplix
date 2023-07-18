/**
 * @module custom/map/esri
 * @desc esri boot loader
 *
 */
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

IG$.cVis.esri = $s.extend(IG$.cVis.base, {
	initComponent: function() {
		var me = this;
		me._esri_version = ig$.arcgis_version || "3.33";

		IG$.cVis.esri.superclass.initComponent.apply(me, arguments);
	},
	draw: function(results) {
		var me = this;
		
		if (IG$.cVis.esri._loading)
		{
			/*
				* case javascript is loading and before initialization
				* Keep monitoring draw api in worker is ready
				*/
			setTimeout(function() {
				me.draw(results);
			}, 500);
			
			return;
		}
		
		/**
		 * dynamic loading based on version
		 */
		if (!IG$.cVis.esri._loaded)
		{
			var js;

			/**
			 * ig$.arcgis_* : management - UI configuration parameter
			 * make default variable in case the configuration is not set
			 * default value: arcgis version 3.33 latest
			 */

			if (me._esri_version == "4.16")
			{
				// version 4 need proxy setting to allow COR issues
				js = [
					ig$.arcgis_css || "https://js.arcgis.com/4.16/esri/themes/light/main.css",
					ig$.arcgis_js || "https://js.arcgis.com/4.16/",
					"./custom/custom.map.esri.worker.v4.js"
				];
			}
			/*
			else if (me._esri_version == "3.17")
			{
				js = [
					ig$.arcgis_css || "https://js.arcgis.com/3.17/esri/css/esri.css",
					ig$.arcgis_js || "https://js.arcgis.com/3.17/",
					"./custom/custom.map.esri.worker.v3.17.js"
				];
			}
			*/
			else
			{
				js = [
					ig$.arcgis_css || "https://js.arcgis.com/3.33/esri/css/esri.css",
					ig$.arcgis_js || "https://js.arcgis.com/3.33/",
					"./custom/custom.map.esri.worker.js"
				];
			}
			
			IG$.cVis.esri._loading = 1;
			
			IG$.getScriptCache(
				js, 
				new IG$.callBackObj(this, function() {
					IG$.cVis.esri._loaded = 1;
					me.draw(results);
				})
			);
		}
	},
	updatedisplay: function(w, h) {
		var me = this,
			map = me.map_inst;
			
		if (map)
		{
			map.resize();
		}
	},
	getExportData: IG$.__chartoption.chartext.$export_html
});

