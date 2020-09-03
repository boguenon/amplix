IG$.__chartoption.chartext.esri.prototype.map_initialize = function(owner, container) {
    var me = this,
        esri = me.esri,
        map,
		cop = owner.cop,
		copsettings = cop.settings,
		geocenter,
        infow,
        infot,
		mapconfig = {
			center: [-118, 34.5],
        	zoom: 8
		};
	
	if (copsettings && copsettings.m_map_center)
	{
		if (copsettings.m_map_center.indexOf(",") > -1)
		{
			geocenter = copsettings.m_map_center.split(",");
			mapconfig.center = [Number(geocenter[0]), Number(geocenter[1])];
		}
		else if (copsettings.m_map_center == "-")
		{
			delete mapconfig["center"];
		}
	}
	else if (ig$.geo_map_center)
	{
		if (ig$.geo_map_center.indexOf(",") > -1)
		{
			geocenter = ig$.geo_map_center.split(",");
			mapconfig.center = [Number(geocenter[0]), Number(geocenter[1])];
		}
		else if (ig$.geo_map_center == "-")
		{
			delete mapconfig["center"];
		}
	}
	
	if (!ig$.arcgis_basemap$)
	{
		ig$.arcgis_basemap$ = {};
		
		if (ig$.arcgis_basemap)
		{
			var prows = ig$.arcgis_basemap.split("\n"),
				i, prec, j,
				pinst;
				
			for (i=0; i < prows.length; i++)
			{
				prec = prows[i].split(",");
				
				if (prec.length > 1 && prec[0] && prec[1])
				{
					pinst = {
						name: prec[0],
						urls: []
					};
					
					for (j=1; j < prec.length; j++)
					{
						if (prec[j])
						{
							pinst.urls.push({
								url: prec[j]
							});
						}
					}
					
					ig$.arcgis_basemap$[prec[0]] = pinst;
					
					if (ig$.arcgis_basemap$dval)
					{
						ig$.arcgis_basemap$dval = prec[0];
					}
				}
			}
		}
	}
	
	$.each(ig$.arcgis_basemap$, function(i, bmap) {
		esri.Basemaps[bmap.name] = {
			title: bmap.name,
			baseMapLayers: bmap.urls
		}
	});
	
	var basemap = cop.settings && cop.settings.m_arc_basemap ? cop.settings.m_arc_basemap : (ig$.arcgis_basemap$dval || "streets");
	
	if (basemap != "-")
	{
		mapconfig.basemap = basemap;
	}

    map = new esri.Map(container, mapconfig);

    me.map_inst = map;
    
    infow = new esri.InfoWindowLite(null, esri.domConstruct.create("div", null, null, map.root));
    infow.startup();
    map.setInfoWindow(infow);
    
    infot = new esri.InfoTemplate();
    infot.setTitle("<b>${STATE_NAME} - ${STATE_ABBR}</b>");
    infot.setContent("${STATE_NAME} is in the ${SUB_REGION} sub region.");
    
    // map.infoWindow.resize(200, 75);
    
//    dojo.connect(map, "onExtentChange", function(extent) {
//        me.validateData.call(me, extent);
//    });

    return map;
};

IG$.__chartoption.chartext.esri.prototype.validateData = function(extent) {
    var me = this;

    clearTimeout(me._ptimer);

    me._ptimer = setTimeout(function() {
        me.req_cnt = 0;
        me.updateData.call(me, extent);
    }, 1000);
},

IG$.__chartoption.chartext.esri.prototype.updateData = function() {
    var me = this,
        map = me.map_inst,
        extent = map.extent,
        zoom = map.getZoom(),
        owner = me.owner,
        cnt = extent ? extent.getCenter() : null,
        bopt;
    
    setTimeout(function() {
        me.updateData.call(me);
    }, 300);
}

IG$.__chartoption.chartext.esri.prototype.drawChart = function(owner, results) {
// insert logic with report result
    var me = this,
        map_inst = me.map_inst,
		cop = owner.cop,
        i;
    
	require([
		"esri/config",
		"esri/map", 
		"esri/basemaps",
        "esri/symbols/MarkerSymbol",
		"esri/layers/ArcGISDynamicMapServiceLayer",
		"esri/layers/ArcGISTiledMapServiceLayer",
		"esri/layers/ArcGISImageServiceLayer",
		"esri/layers/ArcGISImageServiceVectorLayer",
		"esri/layers/DataAdapterFeatureLayer",
		"esri/layers/CSVLayer",
		"esri/layers/DataSource",
		"esri/layers/DimensionalDefinition",
		"esri/layers/Domain",
		"esri/layers/DynamicLayerInfo",
		"esri/layers/DynamicMapServiceLayer",
		"esri/layers/FeatureLayer",
		"esri/layers/FeatureTemplate",
		"esri/layers/FeatureType",
		"esri/layers/KMLGroundOverlay",
		"esri/layers/KMLLayer",
		"esri/layers/LabelLayer",
		"esri/layers/MapImageLayer",
		"esri/layers/OpenStreetMapLayer",
		"esri/layers/RasterLayer",
		"esri/layers/StreamLayer",
		"esri/layers/WebTiledLayer",
		"esri/layers/WFSLayer",
		"esri/layers/WMSLayer",
		"esri/layers/WMTSLayer",
        "esri/symbols/SimpleMarkerSymbol",
        "esri/geometry/Point",
        "esri/dijit/InfoWindowLite",
        "esri/InfoTemplate",
        "esri/graphic",
        "esri/layers/GraphicsLayer",
        "esri/geometry/Circle",
        "esri/symbols/SimpleFillSymbol",
        "esri/Color",
        "dojo/dom-construct",
        "dojo/domReady!"
	], function(esriConfig, Map, Basemaps, MarkerSymbol, ArcGISDynamicMapServiceLayer, ArcGISTiledMapServiceLayer, 
		ArcGISImageServiceLayer, ArcGISImageServiceVectorLayer,
		DataAdapterFeatureLayer, CSVLayer, DataSource, DimensionDefinition,
		Domain, DynamicLayerInfo, DynamicMapServiceLayer, FeatureLayer, FeatureTemplate, FeatureType, KMLGroundOverlay,
		KMLLayer, LabelLayer, MapImageLayer, OpenStreetMapLayer, RasterLayer, StreamLayer, WebTiledLayer,
		WFSLayer, WMSLayer, WMTSLayer,
		SimpleMarkerSymbol, Point, InfoWindowLite, InfoTemplate, Graphic, GraphicsLayer, 
        Circle, SimpleFillSymbol, Color,
        domConstruct) {
        var esri = {
				esriConfig: esriConfig,
                Map: Map,
				Basemaps: Basemaps,
                MarkerSymbol: MarkerSymbol,
				ArcGISDynamicMapServiceLayer: ArcGISDynamicMapServiceLayer,
				ArcGISTiledMapServiceLayer: ArcGISTiledMapServiceLayer,
				ArcGISImageServiceLayer: ArcGISImageServiceLayer,
				ArcGISImageServiceVectorLayer: ArcGISImageServiceVectorLayer,
				DataAdapterFeatureLayer: DataAdapterFeatureLayer,
				CSVLayer: CSVLayer,
				DataSource: DataSource,
				DimensionDefinition: DimensionDefinition,
				Domain: Domain,
				DynamicLayerInfo: DynamicLayerInfo,
				DynamicMapServiceLayer: DynamicMapServiceLayer,
				FeatureLayer: FeatureLayer,
				FeatureTemplate: FeatureTemplate,
				FeatureType: FeatureType,
				KMLGroundOverlay: KMLGroundOverlay,
				KMLLayer: KMLLayer,
				LabelLayer: LabelLayer,
				MapImageLayer: MapImageLayer,
				OpenStreetMapLayer: OpenStreetMapLayer,
				RasterLayer: RasterLayer,
				StreamLayer: StreamLayer,
				WebTiledLayer: WebTiledLayer,
				WFSLayer: WFSLayer,
				WMSLayer: WMSLayer,
				WMTSLayer: WMTSLayer,
                SimpleMarkerSymbol: SimpleMarkerSymbol,
                Point: Point,
                InfoWindowLite: InfoWindowLite,
                InfoTemplate: InfoTemplate,
                Graphic: Graphic,
                GraphicsLayer: GraphicsLayer,
                Circle: Circle,
                Color: Color,
                SimpleFillSymbol: SimpleFillSymbol,
                domConstruct: domConstruct
            },
            i, l;
        
        me.esri = esri;
        
        if (!map_inst)
        {
            me.map_initialize(owner, owner.container);
        }

		map_inst = me.map_inst;
		
		cop.settings = cop.settings || {};

		if (ig$.arcgis_basemap != "-" && cop.settings.m_arc_basemap)
		{
			map_inst.setBasemap(cop.settings.m_arc_basemap);
		}
        
        if (me._glayers)
        {
            for (i=0; i < me._glayers.length; i++)
            {
                me.map_inst.removeLayer(me._glayers[i]);
            }
            
            me._glayers = [];
        }

		me._glayers = me._glayers || [];

		me.load_api_layers(owner, results);
    
        me.setData(owner, results);
    });
}

IG$.__chartoption.chartext.esri.prototype.load_api_layers = function(owner, results) {
	var me = this,
		map_inst = me.map_inst,
		esri = me.esri,
		cop = owner.cop,
		m_arc_layers = cop.settings.m_arc_layers;
	
	var layers = [],
		selected_map = {};
		
	if (ig$.arcgis_rest$)
	{
		
	}
	else if (ig$.arcgis_rest)
	{
		ig$.arcgis_rest$ = [];
		var v = ig$.arcgis_rest.split("\n"),
			i, sv;
			
		for (i=0; i < v.length; i++)
		{
			if (v[i])
			{
				sv = v[i].split(",");
				
				if (sv.length == 3 && sv[0] && sv[1] && sv[2])
				{
					ig$.arcgis_rest$.push({
						name: sv[0],
						loader: sv[1],
						url: sv[2]
					});
				}
			}
		}
	}
		
	if (m_arc_layers)
	{
		$.each(m_arc_layers, function(i, layer) {
			selected_map[layer] = 1;
		});
		
		$.each(ig$.arcgis_rest$, function(i, l) {
			if (selected_map[l.name])
			{
				layers.push(l);
			}
		});
	}
		
	$.each(layers, function(i, lobj) {
		var l = new esri[lobj.loader](lobj.url);
		map_inst.addLayer(l);
		me._glayers.push(l);
	});
}

IG$.__chartoption.chartext.esri.prototype.setData = function(owner, results) {
    var me = this,
        esri = me.esri,
        cop = owner.cop, // chart option information
		copsettings = cop.settings,
        map = me.map_inst,
        seriesname,
        i, j,
        styles_ = [],
        sizes = [53, 56, 66, 78, 90],
        defaultLevel,
        mlng = 150.644,
        mlat = -34.397,
        minLng, maxLng, minLat, maxLat,
		geodata = results ? results.geodata : null,
		tabledata = results._tabledata;
    
    for (i = 1; i <= 5; ++i) {
        styles_.push({
            'url': "./images/m" + i + ".png",
            'height': sizes[i - 1],
            'width': sizes[i - 1]
        });
    }

	defaultLevel = parseInt(cop.m_zoom_level) || 11;
        
    if (results.source != 1)
    {
        if (geodata && geodata.length > 0)
        {
            for (i=0; i < geodata.length; i++)
            {
                minLng = (i == 0) ? Number(geodata[i].lng) : Math.min(minLng, Number(geodata[i].lng));
                maxLng = (i == 0) ? Number(geodata[i].lng) : Math.max(maxLng, Number(geodata[i].lng));
                minLat = (i == 0) ? Number(geodata[i].lat) : Math.min(minLat, Number(geodata[i].lat));
                maxLat = (i == 0) ? Number(geodata[i].lat) : Math.max(maxLat, Number(geodata[i].lat));
            }

            mlng = (maxLng + minLng) / 2;
            mlat = (maxLat + minLat) / 2;
            
            var mpoint = new esri.Point(mlng, mlat);
			if (copsettings && copsettings.m_map_center == "-")
			{
				// ignore settings
			}
			else
			{
				if (copsettings && !copsettings.m_map_center && ig$.geo_map_center && ig$.geo_map_center == "-")
				{
					// ignore
				}
				else
				{
            		map.centerAt(mpoint);
				}
			}
        }
    }

	map.setZoom(defaultLevel);

    var colfix = results.colfix,
        rowfix = results.rowfix,
        p,
        d,
        dval,
        dindex = 0,
        nmax, nmin, pt,
        oLabel,
        n_min = parseInt(cop.m_min) || 1000, 
        n_max = parseInt(cop.m_max) || 10000, 
        r,
        marker,
        cluster,
        contentString,
        gl;

    if (colfix > -1 && colfix < results.colcnt)
    {
        for (i=0; i < rowfix; i++)
        {
            seriesname = (i==0) ? tabledata[i][colfix].code : seriesname + " " + tabledata[i][colfix].code;
        }
    }

    oLabel = new esri.SimpleMarkerSymbol();

	if (geodata)
	{
	    for (i=0; i < geodata.length; i++)
	    {
	        p = geodata[i];
	        p.lat = Number(p.lat);
	        p.lng = Number(p.lng);
	        d = tabledata[p.row];
	        p.data = d;
	        for (j=0; j < colfix; j++)
	        {
	            p.disp = (j==0) ? d[j].text : p.disp + " " + d[j].text;
	        }
	
	        dval = Number(d.length > colfix + dindex ? d[colfix + dindex].code : 0);
	        if (isNaN(dval) == false)
	        {
	            nmax = isNaN(nmax) ? dval : Math.max(nmax, dval);
	            nmin = isNaN(nmin) ? dval : Math.min(nmin, dval);
	        }
	        p.dval = dval;
	    }
    }

    if (!me.infowindow && me._esri_version != 4)
    {
        me.infowindow = new esri.InfoWindowLite(null, esri.domConstruct.create("div", null, null, map.root));
        me.infowindow.startup();
        map.setInfoWindow(me.infowindow);
    }
    
    me._glayers = [];

    geodata && $.each(geodata, function(i, p) {
        var mkey = p.lat + "_" + p.lng,
            pt = new esri.Point(p.lng, p.lat),
            dval,
            r, marker,
            symbol,
            g, gp;

        if (cop.m_marker == "circle")
        {
            dval = Number(p.data[colfix].code);

            if (nmax - nmin > 0)
            {
                r = n_min + (n_max - n_min) * (dval - nmin) / (nmax - nmin);
            }
            else
            {
                r = n_min;
            }

			g = new esri.GraphicsLayer({});
			map.addLayer(g);
			me._glayers.push(g);
			 
            symbol = new esri.SimpleFillSymbol();
            marker = new esri.Circle({
                center: pt,
                radius: r
            });

			gp = esri.Graphic(marker, symbol);
            
            symbol.setColor(new esri.Color([255,0,0,.3]));
            
            marker.m_gdata = [p];
            g.add(gp);
        }
        else
        {
			/*
            if (p.c)
            {
                cluster = new ClusterMarker_(pt, p.cc, styles_, 60);
                cluster.setMap(map);
            }
            else
            {
			*/``
            marker = new esri.SimpleMarkerSymbol(); // (oIcon, { title : '��Ŀ : ' + pt.toString() });
            marker.setSize(20);
            marker.setStyle(esri.SimpleMarkerSymbol.STYLE_CIRCLE);
			marker.setColor(new esri.Color([255,0,0,0.5]));
            marker.m_gdata = [p];
            // marker.setPosition(pt);
            // marker.setMap(map);
            
            g = new esri.GraphicsLayer({});
            map.addLayer(g);
            me._glayers.push(g);

            gp = new esri.Graphic(pt, marker);
            g.add(gp);
            
            g.on("click", function(evt) {
                var infow = map.infoWindow,
                    i, j, ct,
                    mval = "<div>";
                for (i=0; i < p.data.length; i++)
                {
                    mval += (i > 0 ? "<br/>" : "");
                    
                    if (i >= colfix)
                    {
                        for (j=0; j < rowfix; j++)
                        {
                            ct = (j == 0) ? tabledata[j][i].text : ct + "|" + tabledata[j][i].text;
                        }
                        
                        mval += "<span>" + ct + ": </span>";
                    }
                    mval += "<span>" + (p.data[i].text || p.data[i].code) + "</span>";
                }
                mval += "</div>";
                infow.setContent(mval);
                infow.show(pt);
            });
        }
    });
},

IG$.__chartoption.chartext.esri.prototype.updatedisplay = function(owner, w, h) {
    var me = this,
        map = me.map_inst;
        
    if (map)
    {
        map.resize();
    }
}

IG$.__chartoption.chartext.esri.prototype.destroy = function() {
	// called when need to dispose the component
	var me = this,
		map = me.map_inst;
		
	if (map)
	{
		map.destroy();
	}
}