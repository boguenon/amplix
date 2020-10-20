/**
 * @module custom/map/esri
 * @desc esri boot loader
 *
 * @property {object} owner - chart module owner
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

IG$.__chartoption.chartext.esri = function(owner) {
	this.owner = owner;
	this._esri_version = ig$.arcgis_version || "3.33";
};

IG$.__chartoption.chartext.esri.prototype = {
	/**
	 * dynamic loading worker javascript and necessary arcgis javascript / css file in browser
 	 * @memberof module:custom/map/esri
	 */
	drawChart: function(owner, results) {
		var me = this;
		
		if (IG$.__chartoption.chartext.esri._loading)
		{
			/*
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
	
	/**
	 * custom chart resize handler
 	 * @memberof module:custom/map/esri
	 */
	updatedisplay: function(owner, w, h) {
		var me = this,
			map = me.map_inst;
			
		if (map)
		{
			map.resize();
		}
	},
	
	getExportData: function(callback) {
		var me = this,
			container = me.owner.container,
			opt = {logging:false, useCORS:true, imageTimeout:0};
		html2canvas(container, opt).then(function(canvas) {
			document.body.appendChild(canvas);
			var canvasData = canvas.toDataURL("image/png"),
				r = {image_type: "png", image_data: canvasData};
			callback.execute(r);
		});
		return false;
	}
};
