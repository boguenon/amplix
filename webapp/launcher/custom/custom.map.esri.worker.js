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
		"esri/map", 
        "esri/symbols/MarkerSymbol",
        "esri/symbols/SimpleMarkerSymbol",
        "esri/geometry/Point",
        "esri/dijit/InfoWindowLite",
        "esri/InfoTemplate",
        "esri/layers/FeatureLayer",
        "esri/graphic",
        "esri/layers/GraphicsLayer",
        "esri/geometry/Circle",
        "esri/symbols/SimpleFillSymbol",
        "esri/Color",
        "dojo/dom-construct",
        "dojo/domReady!"
	], function(Map, MarkerSymbol, SimpleMarkerSymbol, Point, InfoWindowLite, InfoTemplate, FeatureLayer, Graphic, GraphicsLayer, 
        Circle, SimpleFillSymbol, Color,
        domConstruct) {
        var esri = {
                Map: Map,
                MarkerSymbol: MarkerSymbol,
                SimpleMarkerSymbol: SimpleMarkerSymbol,
                Point: Point,
                InfoWindowLite: InfoWindowLite,
                InfoTemplate: InfoTemplate,
                FeatureLayer: FeatureLayer,
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
            me.map_initialize(owner.container);
        }

		map_inst = me.map_inst;
		
		cop.settings = cop.settings || {};

		if (cop.settings.m_arc_basemap)
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
    
        me.setData(owner, results);
    });
}

IG$.__chartoption.chartext.esri.prototype.setData = function(owner, results) {
    var me = this,
        esri = me.esri,
        cop = owner.cop, // chart option information
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
        
    if (results.source != 1)
    {
        defaultLevel = parseInt(cop.m_zoom_level) || 11;
        
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
            map.centerAt(mpoint);
        }
    }

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

IG$.__chartoption.chartext.esri.prototype.dispose = function() {
	// called when need to dispose the component
}