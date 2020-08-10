IG$.__chartoption.charttype = IG$.__chartoption.charttype || [];

IG$.__chartoption.charttype.push(
    {
        label:"ArcGIS map",
        charttype: "esri",
        subtype: "esri",
        img: "map",
        grp: "scientific"
    }
);

IG$.__chartoption.chartext.esri_api_layers = {
	data: [
		{name: "MapLayer1", loader: "ArcGISDynamicMapServiceLayer", url: "http://sampleserver1.arcgisonline.com/ArcGIS/rest/services/Specialty/ESRI_StatesCitiesRivers_USA/MapServer"},
		{name: "MapLayer2", loader: "ArcGISDynamicMapServiceLayer", url: "http://sampleserver1.arcgisonline.com/ArcGIS/rest/services/Specialty/ESRI_StatesCitiesRivers_USA/MapServer"}
	]
};

IG$.__chartoption.chartext.esri = function(owner) {
    this.owner = owner;
};

// https://maps.googleapis.com/maps/api/js?&sensor=false

IG$.__chartoption.chartext.esri.prototype = {
    drawChart: function(owner, results) {
		var me = this;
		
		if (IG$.__chartoption.chartext.esri._loading)
		{
			setTimeout(function() {
				me.drawChart.call(me, owner, results);
			}, 500);
			
			return;
		}
		
        if (!IG$.__chartoption.chartext.esri._loaded)
        {
            var js;

			me._esri_version = 3.33;
			// me._esri_version = 3.17;
			
			if (me._esri_version == 4)
			{
				// version 4 need proxy setting to allow COR issues
				js = [
					"https://js.arcgis.com/4.16/esri/themes/light/main.css",
					"https://js.arcgis.com/4.16/",
                    "./custom/custom.map.esri.worker.js",
					"./custom/custom.map.esri.clustermarker.js",
					"./custom/custom.map.esri.worker.v4.js"
                ];
			}
			else if (me._esri_version == 3.17)
			{
				js = [
					"https://js.arcgis.com/3.17/esri/css/esri.css",
					"https://js.arcgis.com/3.17/",
                    "./custom/custom.map.esri.worker.v3.17.js"
                ];
			}
			else
			{
				js = [
					"https://js.arcgis.com/3.33/esri/css/esri.css",
					"https://js.arcgis.com/3.33/",
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
