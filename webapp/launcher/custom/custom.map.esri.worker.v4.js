/**
 * create chart instance
 */
IG$.__chartoption.chartext.esri.prototype.map_initialize = function(owner, container) {
	var me = this,
		esri = me.esri,
		map,
		view,
		cop = owner.cop,
		copsettings = cop.settings || {},
		geocenter,
		mapconfig = {
			center: [-118, 34.5],
			zoom: 8,
			// sliderStyle : 'large',
			sliderPosition : 'top-right',
			logo : false,
			autoResize : true,
			fadeOnZoom : true,
			isScrollWheelZoom: true
		},
		geo_extent;
		
	if (copsettings && copsettings.m_map_center)
	{
		if (copsettings.m_map_center.indexOf(",") > -1)
		{
			geocenter = copsettings.m_map_center.split(",");
			
			if (geocenter.length > 3)
			{
				geo_extent = [Number(geocenter[0]), Number(geocenter[1]), Number(geocenter[2]), Number(geocenter[3])];
				delete mapconfig["center"];
			}
			else
			{
				mapconfig.center = [Number(geocenter[0]), Number(geocenter[1])];
			}
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
	
	if (copsettings.m_map_camera)
	{
		var m_map_camera = copsettings.m_map_camera.split(",");
		
		if (m_map_camera.length > 2)
		{
			mapconfig.camera = {
				position: {
					latitude: Number(m_map_camera[0]),
					longitude: Number(m_map_camera[1]),
					z: Number(m_map_camera[2])
				},
				tilt: Number(m_map_camera[3]),
				heading: Number(m_map_camera[4])
			};
		}
	}
	
	if (!mapconfig.camera)
	{
		mapconfig.camera = {
			position: {
				latitude: 34.027,
				longitude: -118.805,
				z: 1534560
			},
			tilt: 45,
			heading: 10
		};
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
	
	var basemaps = {};
	
	$.each(ig$.arcgis_basemap$, function(i, bmap) {
		var config = {
			title: bmap.name,
			baseLayers: []
		};
		
		$.each(bmap.urls, function(j, url) {
			var layer = new esri.MapImageLayer({
				url: url
			});
			config.baseLayers.push(layer);
		});
		basemaps[bmap.name] = new esri.Basemap(config);
	});
	
	var basemap = cop.settings && cop.settings.m_arc_basemap ? cop.settings.m_arc_basemap : (ig$.arcgis_basemap$dval || "streets");
	
	if (basemap != "-")
	{
		if (basemaps[basemap])
		{
			mapconfig.basemap = basemaps[basemap];
		}
		else
		{
			mapconfig.basemap = basemap;
		}
	}

	map = new esri.Map(mapconfig);
	
	if (copsettings.m_arc_view == "SceneView")
	{
		view = new esri.SceneView({
			container: container,
			map: map,
			center: mapconfig.center, // longitude, latitude
			zoom: 13,
			camera: mapconfig.camera,
			highlightOptions: {
				color: [255, 255, 0, 1],
				haloOpacity: 0.9,
				fillOpacity: 0.9,
			}
	    });
	}
	else
	{
		view = new esri.MapView({
			container: container,
			map: map,
			center: mapconfig.center, // longitude, latitude
			zoom: 13,
			highlightOptions: {
				color: [255, 255, 0, 1],
				haloOpacity: 0.9,
				fillOpacity: 0.9,
			}
	    });
	}
	
	me.map_inst = map;
	me.map_view = view;
	
	if (geo_extent)
	{
		map.on("load", function() {
			var next = new esri.Extent(geo_extent[0], geo_extent[1], geo_extent[2], geo_extent[3], map.spatialReference);
			next.setSpatialReference(map.spatialReference);
			map.setExtent(next);
		});
	}
	
	me._ignore_update = true;
	
	if (copsettings.m_map_save_stat == "T")
	{
		var update_setting = function() {
			var extent = view.extent,
				np, pt;
				
			if (me._ignore_update)
				return;
				
			cop.m_zoom_level = "" + view.zoom;
			
			if (extent)
			{
				pt = view.center;
				np = esri.webMercatorUtils.webMercatorToGeographic(pt);
				if (np && isNaN(np.x) == false && isNaN(np.y) == false)
				{
					copsettings.m_map_center = "" + np.x + "," + np.y;
				}
			}
			
			if (view.camera)
			{
				var cam = [];
				
				cam.push(view.camera.position.latitude);
				cam.push(view.camera.position.longitude);
				cam.push(view.camera.position.z);
				cam.push(view.camera.tilt);
				cam.push(view.camera.heading);
				copsettings.m_map_camera = cam.join(",");
			}
		}
		
		esri.watchUtils.whenTrue(view, "stationary", function() {
			update_setting();
		});
	}
	
	// infow = new esri.Popup(null, esri.domConstruct.create("div", null, null, map.root));
	// infow.startup();
	// map.setInfoWindow(infow);
	
	// infot = new esri.InfoTemplate();
	// infot.setTitle("<b>${STATE_NAME} - ${STATE_ABBR}</b>");
	// infot.setContent("${STATE_NAME} is in the ${SUB_REGION} sub region.");
		
	// map.infoWindow.resize(200, 75);
	
	return map;
};

IG$.__chartoption.chartext.esri.prototype.validateData = function(extent) {
	var me = this;

	clearTimeout(me._ptimer);

	me._ptimer = setTimeout(function() {
		me.req_cnt = 0;
		me.updateData.call(me, extent);
	}, 1000);
};

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
};

/**
 * main routine to draw chart
 * called from report viewer, widget
 */
IG$.__chartoption.chartext.esri.prototype.drawChart = function(owner, results) {
// insert logic with report result
	var me = this,
		map_inst = me.map_inst,
		cop = owner.cop,
		i;
		
	me.owner = owner;
	
	/**
	 * arcgis module loading
	 * loaded module class is cached in esri object 
	 */
	require([
		"esri/Map", 
		"esri/Color",
		"esri/views/MapView",
		"esri/views/SceneView",
		"esri/Basemap",
		"esri/core/watchUtils",
		"esri/layers/MapImageLayer",
		"esri/PopupTemplate",
		"esri/geometry/Point",
		"esri/layers/GraphicsLayer",
		"esri/layers/FeatureLayer",
		"esri/renderers/ClassBreaksRenderer",
		"esri/renderers/UniqueValueRenderer",
		"esri/symbols/SimpleMarkerSymbol",
		"esri/symbols/SimpleFillSymbol",
		"esri/symbols/SimpleLineSymbol",
		"esri/Graphic",
		"esri/geometry/Circle",
		"esri/geometry/support/webMercatorUtils",
		"esri/widgets/Popup",
		"esri/widgets/Legend",
		"dojo/dom-construct",
		"dojo/domReady!"
	], function(Map, Color, MapView, SceneView, Basemap, 
		watchUtils, 
		MapImageLayer, 
		PopupTemplate, Point, 
		GraphicsLayer, FeatureLayer,
		ClassBreaksRenderer, UniqueValueRenderer,
		SimpleMarkerSymbol,
		SimpleFillSymbol, SimpleLineSymbol, 
		Graphic, Circle,
		webMercatorUtils,
		Popup, Legend,
		domConstruct) {
		/**
		 * cache object for esri class library
		 */
		var esri = {
				Map: Map,
				MapView: MapView,
				SceneView: SceneView,
				Color: Color,
				Basemap: Basemap,
				watchUtils: watchUtils,
				MapImageLayer: MapImageLayer,
				PopupTemplate: PopupTemplate,
				Point: Point,
				GraphicsLayer: GraphicsLayer,
				FeatureLayer: FeatureLayer,
				ClassBreaksRenderer: ClassBreaksRenderer,
				UniqueValueRenderer: UniqueValueRenderer,
				SimpleMarkerSymbol: SimpleMarkerSymbol,
				SimpleFillSymbol: SimpleFillSymbol,
				SimpleLineSymbol: SimpleLineSymbol,
				Graphic: Graphic,
				Circle: Circle,
				webMercatorUtils: webMercatorUtils,
				Popup: Popup,
				Legend: Legend,
				domConstruct: domConstruct
			},
			i;
		
		me.esri = esri;

		/**
		 * create arcgis map
		 * stores instance information in map_inst pointer
		 */
		if (ig$.arcgis_basemap != "-" && map_inst && cop.settings.m_arc_basemap && me._basemap != cop.settings.m_arc_basemap)
		{
			map_inst.destroy();
			map_inst = me.map_inst = null;
			me._glayers = [];
		}
		
		me._basemap = cop.settings.m_arc_basemap || "streets";
		
		if (!map_inst)
		{
			me.map_initialize(owner, owner.container);
		}
		
		map_inst = me.map_inst;
		
		/**
		 * cop : chart option from chart wizard
		 */
		cop.settings = cop.settings || {};
		
		/**
		 * before drawing, clear layers already added on previous instance
		 */
		if (me._glayers)
		{
			for (i=0; i < me._glayers.length; i++)
			{
				me.map_inst.remove(me._glayers[i]);
			}
			
			me._glayers = [];
		}

		me._glayers = me._glayers || [];
		
		/** 
		 * create api layer from chart option with user selected layers
		 */
		me.load_api_layers(owner, results);
	
		/**
		 * data visualization routine with report result set
		 */
		me.setData(owner, results);
	});
}

/**
 * create api layer from chart option with user selected layers
 */
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
				
				if (sv.length > 2 && sv[0] && sv[1] && sv[2])
				{
					var c = {
						name: sv[0],
						loader: sv[1],
						url: sv[2],
						option: {}
					};
					
					if (sv[3])
					{
						var cc = sv[3].split(";");
						
						$.each(cc, function(m, cv) {
							if (cv && cv.indexOf("=") > 0)
							{
								var n = cv.substring(0, cv.indexOf("=")),
									v = cv.substring(cv.indexOf("=") + 1);
									
								c.option[n] = v;
							}
						});
					}
					ig$.arcgis_rest$.push(c);
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
	
	me._api_layers = {};
		
	$.each(layers, function(i, lobj) {
		var cf,
			l;
			
		if (lobj.loader == "FeatureLayer" && lobj.option.mapid)
		{
			cf = {
				id: lobj.option.mapid,
				outFields: ["*"]
			};
		}
		else
		{
			cf = {
				legendEnabled: lobj.option.legend == "T"
			};
		}
		
		if (lobj.option.renderer)
		{
			if (ig$.report_script$)
			{
				var crender = ig$.report_script$[lobj.option.renderer];
				
				if (crender && crender.renderer)
				{
					cf.renderer = crender.renderer;
				}
			}
		}
			
		l = new esri[lobj.loader](lobj.url, cf);
		me._api_layers[lobj.name] = {
			layer: l,
			config: lobj
		};
		
		map_inst.add(l);
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
		map_view = me.map_view,
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
		c_geofield = -1,
		geodata = results ? results.geodata : null,
		tabledata = results._tabledata,
		rowfix = results.rowfix,
		colors = [],
		n_lat, n_lng, bs = 0,
		c_color_categ = -1,
		geofield_map = {},
		hidden_columns = results.hidden_columns || [],
		m_marker_symbol = copsettings.m_marker_symbol || "STYLE_CIRCLE",
		cdata_m_tmpl = cop.cdata_m_tmpl,
		_esri_version = me._esri_version,
		_v = _esri_version.substring(0, _esri_version.indexOf("."));
		
	if (m_marker_symbol && m_marker_symbol.substring(0, 6) == "STYLE_")
	{
		m_marker_symbol = m_marker_symbol.substring(6).toLowerCase();
	}
		
	cop.m_marker = cop.m_marker || "marker";
	
	me._ignore_update = true;
		
	copsettings.m_min_color && colors.push(copsettings.m_min_color);
	copsettings.m_min_a_color && colors.push(copsettings.m_min_a_color);
	copsettings.m_mid_color && colors.push(copsettings.m_mid_color);
	copsettings.m_mid_a_color && colors.push(copsettings.m_mid_a_color);
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
		
		if (cop.m_marker == "polygon" && copsettings.m_geofield && sop)
		{
			$.each(sop.rows, function(i, s) {
				if (s.uid == copsettings.m_geofield)
				{
					c_geofield = i;
					return false;
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
					map_view.center = mpoint;
				}
			}
		}
	}

	map_view.zoom = defaultLevel;
	map_view.popup.autoOpenEnabled = false;

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
	
	if (hidden_columns.length)
	{
		for (i=0; i < hidden_columns.length; i++)
		{
			if (hidden_columns[i] >= colfix)
			{
				if (dindex + colfix == hidden_columns[i])
				{
					dindex++;
				}
				else
				{
					break;
				}
			}
		}
	}

	oLabel = new esri.SimpleMarkerSymbol();

	if (geodata && geodata.length)
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
			
			if (c_geofield > -1)
			{
				var m = {
					code: d[c_geofield].code,
					row: i
				};
				
				if (m.code)
				{
					geofield_map[m.code] = m;
				}
			}
		}
	}
	else if (c_geofield > -1)
	{
		for (i=rowfix; i < tabledata.length; i++)
		{
			d = tabledata[i];
			
			var m = {
				code: d[c_geofield].code,
				row: i
			};
			
			if (m.code)
			{
				geofield_map[m.code] = m;
			}
			
			dval = Number(d.length > colfix + dindex ? d[colfix + dindex].code : 0);
			if (isNaN(dval) == false)
			{
				nmax = isNaN(nmax) ? dval : Math.max(nmax, dval);
				nmin = isNaN(nmin) ? dval : Math.min(nmin, dval);
			}
		}
	}

	if (!me.infowindow)
	{
		me.infowindow = new esri.Popup();
		// null, esri.domConstruct.create("div", null, null, map.root));
		// me.infowindow.startup();
		// map.setInfoWindow(me.infowindow);
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
	
	var g = new esri.GraphicsLayer();
	map.add(g);
	me._glayers.push(g);
	
	var polygon_layer,
		mapid;
	
	$.each(me._api_layers, function(i, layer) {
		if (layer.config.loader == "FeatureLayer" && layer.config.option.mapid)
		{
			polygon_layer = layer;
			return false;
		}
	});
	
	var info_tmpl = null;
	
	if (cdata_m_tmpl)
	{
		try
		{
			info_tmpl = JSON.parse(cdata_m_tmpl);
		}
		catch (e)
		{
		}
	}
	
	info_tmpl = info_tmpl || {
		title: ""
	};
	
	var _run_click_handler = function(row, pt, mouseover) {
		var infow = {},
			i, j, ct, t,
			series_name = "", point_name = "",
			sep = IG$._separator,
			mvalues = {},
			charts = [],
			mval = "<div class='igc-legend-container'>";
			
		if (me._info_timer)
		{
			clearTimeout(me._info_timer);
		}
		
		for (i=0; i < row.length; i++)
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
			
			t = (row[i].text || row[i].code);
			if (i < colfix)
			{
				point_name += (point_name ? sep : "") + (t || " ");
			} 
			mval += "<span>" + t + "</span>";
			mvalues[ct] = row[i];
		}
		
		mval += "</div>";
		
		infow.title = info_tmpl.title || "";
		
		if (info_tmpl.width && info_tmpl.height)
		{
			infow.width = Number(info_tmpl.width);
			infow.height = Number(info_tmpl.height);
		}
		
		if (info_tmpl.content)
		{
			mval = [];
			
			for (i=0; i < info_tmpl.content.length; i++)
			{
				var s = info_tmpl.content[i],
					n1, n2, n,
					v,
					l = s.length;
				
				n1 = s.indexOf("{");
				
				while (n1 > -1)
				{
					n2 = s.indexOf("}", n1+1);
					
					if (n2 > -1)
					{
						n = s.substring(n1 + 1, n2);
						
						var cmd = "";
						
						if (n.indexOf(":") > -1)
						{
							cmd = n.substring(0, n.indexOf(":"));
						}
						
						if (cmd && cmd == "chart")
						{
							var tl = n.substring(n.indexOf(":") + 1),
								copt = {},
								tm = tl.split(";");
								
							$.each(tm, function(l, opt) {
								if (opt.indexOf("=") > 0)
								{
									var n = opt.substring(0, opt.indexOf("=")),
										v = opt.substring(opt.indexOf("=") + 1);
									
									if (n == "values")
									{
										var mv = [];
										
										$.each(row, function(i, r) {
											if (i < colfix)
											{
												return;
											}
											
											var j,
												ct,
												tm = tl;
											
											for (j=0; j < rowfix; j++)
											{
												t = tabledata[j][i].text || tabledata[j][i].code;
												ct = (j == 0) ? t : ct + "|" + t;
											}
																			
											// replace value
											t = Number(r.code);
											
											if (!isNaN(t))
											{
												if (v == "measure")
												{
													mv.push(t);
												}
												else if (v.indexOf(ct) > -1)
												{
													mv.push(t);
												}
											}
										});
											
										v = mv;
									}
									copt[n] = v;
								}
							});
							
							charts.push(copt);
							
							copt.div = "mchart_" + charts.length;
							v = "<div id='mchart_" + charts.length + "' class='igc-legend-chart'></div>";
						}
						else if (cmd && (cmd == "measure" || cmd == "row"))
						{
							v = [];
							var tl = n.substring(n.indexOf(":") + 1);
							$.each(row, function(i, r) {
								if (cmd == "measure" && i < colfix)
								{
									return;
								}
								
								if (cmd == "row" && i >= colfix)
									return;
									
								var j,
									ct,
									tm = tl;
								
								for (j=0; j < rowfix; j++)
								{
									t = tabledata[j][i].text || tabledata[j][i].code;
									ct = (j == 0) ? t : ct + "|" + t;
								}
																
								if (tm.indexOf("NAME") > -1)
								{
									tm = tm.substring(0, tm.indexOf("NAME")) + ct + tm.substring(tm.indexOf("NAME") + "NAME".length);
								}
								
								// replace value
								t = (r.text || r.code);
								if (tm.indexOf("VALUE") > -1)
								{
									tm = tm.substring(0, tm.indexOf("VALUE")) + t + tm.substring(tm.indexOf("VALUE") + "VALUE".length);
								}
								v.push(tm);
							});
							v = v.join("");
						}
						else
						{
							v = (mvalues[n] ? mvalues[n].text || mvalues[n].code : "");
						}
						s = s.substring(0, n1) + v + s.substring(n2 + 1);
						n1 = s.indexOf("{", n1 + 1);
					}
					else
					{
						break;
					}
				}
				
				mval.push(s);
			}
			
			mval = mval.join("");
		}
		
		var info_root = document.createElement("DIV"),
			info_dom = $(mval).appendTo(info_root);
		
		infow.content = info_dom[0];
		
		infow.location = pt;
		
		map_view.popup.open(infow);
		
		if (info_dom && info_dom.length > 0)
		{
			setTimeout(function() {
				$.each(charts, function(i, chart) {
					chart.type = chart.type || "pie";
					var chartdom = $("#" + chart.div, info_dom);
					chartdom.sparkline(chart.values || [], chart);
				});
			}, 500)
		}
		
		if (!mouseover)
		{
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
		}
		
		me._info_timer = setTimeout(function() {
			map_view.popup.close();
		}, 5000); 
	}
	
	if (polygon_layer && cop.m_marker == "polygon")
	{
		mapid = polygon_layer.config.option.mapid;
		
		polygon_layer.layer.on("click", function(event) {
			var attr = event.graphic ? event.graphic.attributes : null,
				mapvalue;
			
			if (attr && attr[mapid])
			{
				mapvalue = geofield_map[attr[mapid]];
				
				/*
				if (!mapvalue)
				{
					mapvalue = geofield_map["01"];
				}
				*/
				
				if (mapvalue)
				{
					_run_click_handler(tabledata[mapvalue.row], event.mapPoint);
				}
			}
		});
		
		var steps = 1;
		
		if (isNaN(nmin) == false && isNaN(nmax) == false && nmin < nmax && colors.length)
		{
			steps = (nmax - nmin) / colors.length;
		}
		
		var renderer = new esri.ClassBreaksRenderer();
		
		var geofield_map_dt = [];
		
		$.each(geofield_map, function(k, r) {
			var row = tabledata[r.row][colfix + dindex];
			
			if (isNaN(row.code) == false)
			{
				geofield_map_dt.push("\"" + k + "\", " + row.code);
			}
		});
		
		// geofield_map_dt.push("\"Decker Canyon Camp\"," + (nmax -2) );
		
		geofield_map_dt = geofield_map_dt.join(",");
		
		renderer.valueExpression = [
			'var m = $feature.' + mapid + ';',
			'var nmax = ' + nmax + ';',
			'var nmin = ' + nmin + ';',
			// 'Console("" + m);',
			'var geofield_map = Dictionary(' + geofield_map_dt + ');',
			
			'if (HasKey(geofield_map, m)) {',
			'    var f = geofield_map[m];',
			'    Console("mapping", m, f);',
			'    return f;',
			'}',
			
			// 'Console((nmax - nmin) * Random() + nmin);',
			'return (nmax - nmin) * Random() + nmin;'
			// 'return 0;'
		].join("\n");
		
		renderer.isMaxInclusive = true;
		
		for (i=0; i < colors.length; i++)
		{
			var color1 = new esri.Color(colors[i]);
			var minvalue = nmin + steps * i,
				maxvalue = nmin + steps * (i + 1);
				
			renderer.addClassBreakInfo({
          		minValue: minvalue,
          		maxValue: maxvalue,
          		label: IG$.FormatNumber(minvalue) + " ~ " + IG$.FormatNumber(maxvalue),
          		symbol: new esri.SimpleFillSymbol({
					color: color1,
					style: "solid",
					outline: new esri.SimpleLineSymbol({
						width: 1,
						color: color1,
						style: "solid"
					}) 
				})
        	});
		}
        
		polygon_layer.layer.renderer = renderer;
		
		if (cop.showlegend)
		{
			map_view.ui.add(
				new esri.Legend({
					view: map_view
          		}),
          		"bottom-left"
        	);
		}
	}
	else
	{
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
				dval = Number(p.data[colfix + dindex].code);
	
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
	
				gp = new esri.Graphic({
					geometry: marker, 
					symbol: symbol
				});
				
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
				
				symbol.color = new esri.Color(c);
				
				marker.m_gdata = [p];
				gp.p = p;
				gp.pt = pt;
				g.add(gp);
			}
			else if (polygon_layer && cop.m_marker == "polygon")
			{
				
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
				marker.size = m_marker_size;
				
				marker.style = m_marker_symbol;
				
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
				
				marker.color = new esri.Color(c);
				marker.m_gdata = [p];
				// marker.setPosition(pt);
				// marker.setMap(map);
	
				gp = new esri.Graphic(pt, marker);
				gp.p = p;
				gp.pt = pt;
				g.add(gp);
			}
		});
		
		var highlight;
		
		if (copsettings.m_map_popup_hover)
		{
			map_view.whenLayerView(g).then(function(layerView){
				map_view.on("pointer-move", function(event) {
					map_view.hitTest(event).then(function(response) {
						if (response.results.length) {
			                var graphics = response.results.filter(function (result) {
			                  return result.graphic.layer === g;
			                });
	
							var graphic = graphics && graphics.length ? graphics[0].graphic : null;
		
							if (graphic)
							{
								if (highlight)
								{
									if (highlight.target == graphic)
										return;
									
									if (highlight.type == "simple-marker")
									{
										highlight.target.symbol = highlight.osymbol;
									}
								}
									
								highlight = null;
								
								// highlight = layerView.highlight(graphic);
								
								if (graphic.symbol && graphic.symbol.type == "simple-marker")
								{
									highlight = {
										type: graphic.symbol.type,
										target: graphic,
										size: graphic.symbol.size
									};
									
									var ns = graphic.symbol.clone();
									ns.size = graphic.symbol.size * 2;
									highlight.osymbol = graphic.symbol;
									graphic.symbol = ns;
								}
								
								var gp = graphic,
									p,
									pt;
						
								if (!gp)
									return;
									
								p = gp.p;
								
								if (!p)
									return;
									
								pt = gp.pt;
									
								_run_click_handler(p.data, pt, true);
							}
						}
					});
				});
			});
		}
		
		map_view.on("click", function(event) {
			map_view.hitTest(event).then(function(response) {
				if (response.results.length) {
					var graphics = response.results.filter(function(result) {
	      				return result.graphic.layer === g;
	    			});

					var graphic = graphics && graphics.length ? graphics[0].graphic : null;
	
					if (graphic)
					{
						var gp = graphic,
							p,
							pt;
				
						if (!gp)
							return;
							
						p = gp.p;
						
						if (!p)
							return;
							
						pt = gp.pt;
							
						_run_click_handler(p.data, pt);
					}
				}
			});
		});
	}
	
	if (copsettings.m_map_post_exec && ig$.report_script$)
	{
		var cfunc = ig$.report_script$[copsettings.m_map_post_exec];
		
		if (cfunc && cfunc.handler)
		{
			cfunc.handler.call(me, me, results);
		}
	}
	
	me._ignore_update = false;
};

/**
 * event handler for report viewer resize
 */
IG$.__chartoption.chartext.esri.prototype.updatedisplay = function(owner, w, h) {
	var me = this,
		map = me.map_inst,
		map_view = me.map_view;
		
	if (map && map_view)
	{
		// map_view.resize();
	}
}

/**
 * event handler to kill this instance
 */
IG$.__chartoption.chartext.esri.prototype.destroy = function() {
	// called when need to dispose the component
	var me = this,
		map = me.map_inst;
		
	if (map)
	{
		map.destroy();
	}
}