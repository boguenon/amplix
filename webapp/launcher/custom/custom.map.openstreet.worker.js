IG$.cVis.openstreetmap.prototype.map_initialize = function(container) {
	var me = this,
		mapOptions = {
		zoom: 8,
		center: [-34.397, 150.644]
	};

	if (ig$.geo_map_center && ig$.geo_map_center.indexOf(",") > -1)
	{
		var geocenter = ig$.geo_map_center.split(",");
		mapOptions.center = [Number(geocenter[1]), Number(geocenter[0])];
	}

	map = L.map(container).setView(mapOptions.center, mapOptions.zoom);

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);

    map.on("click", function(e) {
        L.popup()
            .setLatLng(e.latlng)
            .setContent(e.latlng.toString())
            .openOn(map);
    });

	return map;
};

IG$.cVis.openstreetmap.prototype.validateData = function() {
	var me = this;

	clearTimeout(me._ptimer);

	me._ptimer = setTimeout(function() {
		me.req_cnt = 0;
		me.updateData();
	}, 1000);
},

IG$.cVis.openstreetmap.prototype.updateData = function() {
	var me = this,
		map = me.map_inst,
		bnd = map.getBounds(),
		ne = bnd ? bnd.getNorthEast() : null,
		sw = bnd ? bnd.getSouthWest() : null,
		cnt = bnd ? map.getCenter() : null,
		zoom = map.getZoom(),
		chartview = me.chartview,
		bopt;
	
	if (bnd && ne)
	{
		bopt = {
			ismap: true,
			bound: zoom > 5 ? {
				x1: Math.min(ne.lng, sw.lng),
				y1: Math.min(ne.lat, sw.lat),
				x2: Math.max(ne.lng, sw.lng),
				y2: Math.max(ne.lat, sw.lat)
			} : null,
			center: zoom > 5 ? {
				x: cnt.lng,
				y: cnt.lat
			} : null,
			zoom: zoom
		};

		me.req_cnt = 0;
		chartview._reqData.call(chartview, bopt);
	}
	else
	{
		if (me.req_cnt < 5)
		{
			setTimeout(function() {
				me.updateData();
			}, 300);
		}
		me.req_cnt++;
	}
}

IG$.cVis.openstreetmap.prototype.draw = function(results) {
// insert logic with report result
	var me = this,
		chartview = me.chartview,
		map_inst = me.map_inst,
		i;
		
	me.markers = me.markers || [];
	me.clusters = me.clusters || [];

	if (!map_inst)
	{
		me.map_inst = map_inst = me.map_initialize(chartview.container);
	}
	else
	{
		for (i=0; i < me.markers.length; i++)
		{
			me.markers[i].remove();
		}
		
		me.markers = [];
		
		for (i=0; i < me.clusters.length; i++)
		{
			me.clusters[i].remove();
		}
		
		me.clusters = [];
	}

	me.setData(chartview, results);
}

IG$.cVis.openstreetmap.prototype.setData = function(chartview, results) {
	var me = this,
		sop = chartview.sheetoption ? chartview.sheetoption.model : null,
		cop = chartview.cop, // chart option information
		copsettings = cop.settings,
		map = me.map_inst,
		seriesname,
		i, j, p,
		styles_ = [],
		sizes = [53, 56, 66, 78, 90],
		defaultLevel,
		mlng = 150.644,
		mlat = -34.397,
		m_lat, m_lng, trow,
		c_lat =  -1, c_lng = -1,
		tabledata = results._tabledata,
		rowfix = results.rowfix,
		geodata,
		minLng, maxLng, minLat, maxLat;
	
	for (i = 1; i <= 5; ++i) {
		styles_.push({
			'url': "./images/m" + i + ".png",
			'height': sizes[i - 1],
			'width': sizes[i - 1]
		});
	}
	
	me.markers = me.markers || [];
	me.clusters = me.clusters || [];

	m_lat = copsettings.m_lat;
	m_lng = copsettings.m_lng;
	
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
	
	if (results.source != 1)
	{
		defaultLevel = parseInt(cop.m_zoom_level) || 11;
		
		if (results && results.geodata.length > 0)
		{
			for (i=0; i < results.geodata.length; i++)
			{
				p = results.geodata[i];
				minLng = (i == 0) ? Number(p.lng) : Math.min(minLng, Number(p.lng));
				maxLng = (i == 0) ? Number(p.lng) : Math.max(maxLng, Number(p.lng));
				minLat = (i == 0) ? Number(p.lat) : Math.min(minLat, Number(p.lat));
				maxLat = (i == 0) ? Number(p.lat) : Math.max(maxLat, Number(p.lat));
			}

			mlng = (maxLng + minLng) / 2;
			mlat = (maxLat + minLat) / 2;
		}

		var mpoint = [mlat, mlng];
		
		map.setView(mpoint);
		
		me.validateData();
		
		return;
	}

	var colfix = results.colfix,
		rowfix = results.rowfix,
		p,
		d,
		dval,
		dindex = 0,
		nmax, nmin, pt,
		n_min = parseInt(cop.m_min) || 1000, 
		n_max = parseInt(cop.m_max) || 10000, 
		r,
		marker,
		cluster,
		contentString;

	if (colfix > -1 && colfix < results.colcnt)
	{
		for (i=0; i < rowfix; i++)
		{
			seriesname = (i==0) ? results._tabledata[i][colfix].code : seriesname + " " + results._tabledata[i][colfix].code;
		}
    }

	for (i=0; i < results.geodata.length; i++)
	{
		p = results.geodata[i];
		p.lat = Number(p.lat);
		p.lng = Number(p.lng);
		d = results._tabledata[p.row];
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
	
	$.each(results.geodata, function(i, p) {
		var mkey = p.lat + "_" + p.lng,
			pt = [p.lat, p.lng],
			dval,
			h = results._tabledata[0],
			r, marker;

		if (cop.m_marker == "circle")
		{
			dval = p.data[colfix] ? Number(p.data[colfix].code) : 1;

			if (nmax - nmin > 0)
			{
				r = n_min + (n_max - n_min) * (dval - nmin) / (nmax - nmin);
			}
			else
			{
				r = n_min;
			}

			marker = new L.Circle(pt, {
				fillColor: "#ff0000",
				fillOpacity: 0.3,
				strokeWeight: 0,
				radius: r
			});
            marker.addTo(map);
			marker.m_gdata = [p];
			me.markers.push(marker);
		}
		else
		{
			if (p.c && p.cc)
			{
				cluster = new ClusterMarker_(pt, p.cc, styles_, 60);
				me.clusters.push(cluster);
			}
			else
			{
				marker = L.marker(pt).addTo(map); // (oIcon, { title : '��Ŀ : ' + pt.toString() });
				marker.m_gdata = [p];
				me.markers.push(marker);
				var i,
                    cnt = '<div id="content">'+
                        '<div id="bodyContent"><table>';
                
                if (d)
                {
                    for (i=0; i < d.length; i++)
                    {
                        cnt += "<tr><td><b>" + (h[i].text || h[i].code) + "</b></td><td>" + (d[i].text || d[i].code) + "</td></tr>";
                    }
                }
                cnt += '</table></div>'+'</div>';
				marker.bindPopup(
					cnt
				).openPopup();
			}
		}
	});
},

IG$.cVis.openstreetmap.prototype.updatedisplay = function(w, h) {
	var me = this,
		map = me.map;
		
	if (map)
	{
		google.maps.event.trigger(map, "resize");
	}
}

IG$.cVis.openstreetmap.prototype.dispose = function() {
    var me = this,
        map = me.map_inst;

    if (map)
    {
        map.remove();
        $(me.chartview.container).empty();
        me.map_inst = null;
    }
}
