IG$.__chartoption.chartext.esri.prototype.map_initialize = function(container) {
    var me = this,
        esri = me.esri,
        map,
        mapOptions = {
            zoom: 8
        },
        infow,
        infot;

    map = new esri.Map(container, {
        center: [-118, 34.5],
        zoom: 8,
        basemap: "topo"
    });
    
    me.map_inst = map;
    
/*
    infow = new esri.InfoWindowLite(null, esri.domConstruct.create("div", null, null, map.root));
    infow.startup();
    map.setInfoWindow(infow);
    
    infot = new esri.InfoTemplate();
    infot.setTitle("<b>${STATE_NAME} - ${STATE_ABBR}</b>");
    infot.setContent("${STATE_NAME} is in the ${SUB_REGION} sub region.");
*/  
    // map.infoWindow.resize(200, 75);
    
//    dojo.connect(map, "onExtentChange", function(extent) {
//        me.validateData.call(me, extent);
//    });

    return map;
};

IG$.__chartoption.chartext.esri.prototype.drawChart = function(owner, results) {
// insert logic with report result
    var me = this,
        map_inst = me.map_inst,
        i,
		_esri_version = me._esri_version;
		    
	require([
		"esri/Map",
		"esri/views/MapView",
		"esri/symbols/SimpleMarkerSymbol"
	], function(Map, MapView, SimpleMarkerSymbol) {
        var esri = {
                Map: Map,
				MapView: MapView,
                SimpleMarkerSymbol: SimpleMarkerSymbol
            },
            i, l;
        
        me.esri = esri;
        
        if (!map_inst)
        {
            me.map_initialize(owner.container);
        }
        
        if (me._glayers)
        {
            for (i=0; i < me._glayers.length; i++)
            {
                me.map_inst.removeLayer(me._glayers[i]);
            }
            
            me._glayers = [];
        }
    
        me.setData(owner, results);
    });
}