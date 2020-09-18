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
	
//	dojo.connect(map, "onExtentChange", function(extent) {
//		me.validateData.call(me, extent);
//	});

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

/**
 * data visualization routine with report result set
 */
IG$.__chartoption.chartext.esri.prototype.setData = function(owner, results) {
	var me = this,
		esri = me.esri,
		sop = owner.sheetoption ? owner.sheetoption.model : null,
		cop = owner.cop, // chart option information
		copsettings = cop.settings || {},
		map = me.map_inst,
		seriesname,
		i, j,
		styles_ = [],
		sizes = [53, 56, 66, 78, 90],
		defaultLevel,
		mlng = 150.644,
		mlat = -34.397,
		minLng, maxLng, minLat, maxLat,
		m_lat, m_lng, trow,
		c_lat =  -1, c_lng = -1,
		geodata = results ? results.geodata : null,
		tabledata = results._tabledata,
		rowfix = results.rowfix,
		colors = [],
		n_lat, n_lng, bs = 0,
		c_color_categ = -1,
		m_marker_symbol = copsettings.m_marker_symbol || "STYLE_CIRCLE";
		
	copsettings.m_min_color && colors.push(copsettings.m_min_color);
	copsettings.m_mid_color && colors.push(copsettings.m_mid_color);
	copsettings.m_max_color && colors.push(copsettings.m_max_color);
	
	for (i = 1; i <= 5; ++i) {
		styles_.push({
			'url': "./images/m" + i + ".png",
			'height': sizes[i - 1],
			'width': sizes[i - 1]
		});
	}

	defaultLevel = parseInt(cop.m_zoom_level) || 11;
	
	m_lat = copsettings.m_lat;
	m_lng = copsettings.m_lng;
		
	if (results.source != 1)
	{
		if (m_lat && m_lng && sop)
		{
			$.each(sop.rows, function(i, s) {
				if (s.uid == m_lat)
				{
					c_lat = i;
				}
				
				if (s.uid == m_lng)
				{
					c_lng = i;
				}
			});
		}
		
		if (copsettings.m_color_categ && sop)
		{
			$.each(sop.rows, function(i, s) {
				if (s.uid == copsettings.m_color_categ)
				{
					c_color_categ = i;
				}
			});
		}
		
		if (c_lat > -1 && c_lng > -1)
		{
			geodata = results.geodata = [];
			
			for (i=rowfix; i < tabledata.length; i++)
			{
				trow = tabledata[i];
				
				var m = {
					lng: trow[c_lng].code,
					lat: trow[c_lat].code,
					row: i
				};
				
				if (m.lat && m.lng)
				{
					geodata.push(m);
				}
			}
		}
		
		if (geodata && geodata.length > 0)
		{
			for (i=0; i < geodata.length; i++)
			{
				n_lat = Number(geodata[i].lat);
				n_lng = Number(geodata[i].lng);
				
				if (isNaN(n_lat) || isNaN(n_lng))
				{
					continue;
				}
				
				minLng = (!bs) ? n_lng : Math.min(minLng, n_lng);
				maxLng = (!bs) ? n_lng : Math.max(maxLng, n_lng);
				minLat = (!bs) ? n_lat : Math.min(minLat, n_lat);
				maxLat = (!bs) ? n_lat : Math.max(maxLat, n_lat);
				bs = 1;
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
		nmax, nmin,
		n_min = parseInt(cop.m_min) || 1000, 
		n_max = parseInt(cop.m_max) || 10000,
		colormap = {},
		colorseq = 0;

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

	if (!me.infowindow)
	{
		me.infowindow = new esri.InfoWindowLite(null, esri.domConstruct.create("div", null, null, map.root));
		me.infowindow.startup();
		map.setInfoWindow(me.infowindow);
	}
	
	me._glayers = [];
	
	var ratio = 1 / (nmax - nmin);
	if (colors && colors.length)
	{
		for (n=0; n < colors.length; n++)
		{
			colors[n] = IG$._pcolor(colors[n]);
			colors[n].push(0.3); // alpha
		}
	}
	
	var c_cset = cop.colorset || results.c_cset,
		colorsel,
		m_marker_size = Number(copsettings.m_marker_size || "20");
	
	if (IG$.__chartoption && IG$.__chartoption.chartcolors && IG$.__chartoption.chartcolors[c_cset])
	{
		colorsel =  IG$.__chartoption.chartcolors[c_cset];
	}
	else
	{
		$.each(IG$.__chartoption.chartcolors, function(k, value) {
			c_cset = k;
			return false;
		});
		colorsel = IG$.__chartoption.chartcolors[c_cset]
	}
	
	var g = new esri.GraphicsLayer({});
	map.addLayer(g);
	me._glayers.push(g);

	geodata && $.each(geodata, function(i, p) {
		var mkey = p.lat + "_" + p.lng,
			pt = new esri.Point(p.lng, p.lat),
			dval,
			r, marker,
			symbol,
			gp,
			n, nr;
			
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

			symbol = new esri.SimpleFillSymbol();
			marker = new esri.Circle({
				center: pt,
				radius: r
			});

			gp = esri.Graphic(marker, symbol);
			
			var c = [255,0,0,.3];
			
			if (colors.length > 0)
			{
				if (colors.length == 1)
				{
					c = colors[0];
				}
				else
				{
					nr = ratio * (dval - nmin);
					
					var rng = nr * (colors.length - 1),
						m = Math.floor(rng),
						c1 = colors[m],
						c2 = colors[m+1],
						cr = nr * (colors.length - 1) - m;
						
					if (m == colors.length-1)
					{
						c = colors[colors.length-1];
					}
					else
					{
						c = IG$._interpolate_color(c1, c2, cr);
					}
					c.push(0.5);
				}
			}
			
			symbol.setColor(new esri.Color(c));
			
			marker.m_gdata = [p];
			gp.p = p;
			gp.pt = pt;
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
			marker.setSize(m_marker_size);
			marker.setStyle(esri.SimpleMarkerSymbol[m_marker_symbol]);
			
			var c = [255,0,0,0.5];
			
			if (c_color_categ > -1)
			{
				var row = p.data,
					rval = row[c_color_categ],
					t = rval ? rval.text || rval.code : null,
					ct;
					
				if (t)
				{
					if (colormap[t])
					{
						c = colormap[t];
					}
					else
					{
						ct = colorsel[colorseq % (colorsel.length-1)];
						colormap[t] = IG$._pcolor(ct);
						colorseq++;
						c = colormap[t];
					}
				}
			}
			
			marker.setColor(new esri.Color(c));
			marker.m_gdata = [p];
			// marker.setPosition(pt);
			// marker.setMap(map);

			gp = new esri.Graphic(pt, marker);
			gp.p = p;
			gp.pt = pt;
			g.add(gp);
		}
	});
	
	g.on("click", function(evt) {
		var infow = map.infoWindow,
			i, j, ct, t,
			gp = evt.graphic,
			series_name = "", point_name = "",
			sep = IG$._separator,
			mval = "<div>",
			p,
			pt;

		if (!gp)
			return;
			
		p = gp.p;
		
		if (!p)
			return;
			
		pt = gp.pt;
			
		for (i=0; i < p.data.length; i++)
		{
			mval += (i > 0 ? "<br/>" : "");
			
			if (i >= colfix)
			{
				for (j=0; j < rowfix; j++)
				{
					t = tabledata[j][i].text || tabledata[j][i].code;
					if (i == colfix)
					{
						series_name += (series_name ? sep : "") + (t || " ");
					}
					ct = (j == 0) ? t : ct + "|" + t;
				}
				
				mval += "<span>" + ct + ": </span>";
			}
			
			t = (p.data[i].text || p.data[i].code);
			if (i < colfix)
			{
				point_name += (point_name ? sep : "") + (t || " ");
			} 
			mval += "<span>" + t + "</span>";
		}
		mval += "</div>";
		infow.setContent(mval);
		infow.show(pt);

		var param = {
				point: {
					name: point_name
				}
			},
			sender = {
				name: series_name
			};

		// drill event triggering
		owner.procClickEvent.call(owner, sender, param);
	});
};

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