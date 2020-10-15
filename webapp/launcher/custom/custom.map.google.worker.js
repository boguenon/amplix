IG$.__chartoption.chartext.googlemap.prototype.google_initialize = function(container) {
	var me = this,
		mapOptions = {
		zoom: 8,
		center: new google.maps.LatLng(-34.397, 150.644),
		mapTypeId: google.maps.MapTypeId.ROADMAP
	};

	if (ig$.geo_map_center && ig$.geo_map_center.indexOf(",") > -1)
	{
		var geocenter = ig$.geo_map_center.split(",");
		mapOptions.center = [Number(geocenter[0]), Number(geocenter[1])];
	}

	map = new google.maps.Map(container, mapOptions);

	google.maps.event.addListener(map, 'center_changed', function() {
		me.validateData.call(me);
	});

	google.maps.event.addListener(map, 'bounds_changed', function() {
		me.validateData.call(me);
	});

	google.maps.event.addListener(map, 'zoom_changed', function() {
		me.validateData.call(me);
	});

	return map;
};

IG$.__chartoption.chartext.googlemap.prototype.validateData = function() {
	var me = this;

	clearTimeout(me._ptimer);

	me._ptimer = setTimeout(function() {
		me.req_cnt = 0;
		me.updateData.call(me);
	}, 1000);
},

IG$.__chartoption.chartext.googlemap.prototype.updateData = function() {
	var me = this,
		map = me.map_inst,
		bnd = map.getBounds(),
		ne = bnd ? bnd.getNorthEast() : null,
		sw = bnd ? bnd.getSouthWest() : null,
		cnt = bnd ? map.getCenter() : null,
		zoom = map.getZoom(),
		owner = me.owner,
		bopt;
	
	if (bnd && ne)
	{
		bopt = {
			ismap: true,
			bound: zoom > 5 ? {
				x1: ne.lng(),
				y1: ne.lat(),
				x2: sw.lng(),
				y2: sw.lat()
			} : null,
			center: zoom > 5 ? {
				x: cnt.lng(),
				y: cnt.lat()
			} : null,
			zoom: zoom
		};

		me.req_cnt = 0;
		owner._reqData.call(owner, bopt);
	}
	else
	{
		if (me.req_cnt < 5)
		{
			setTimeout(function() {
				me.updateData.call(me);
			}, 300);
		}
		me.req_cnt++;
	}
}

IG$.__chartoption.chartext.googlemap.prototype.drawChart = function(owner, results) {
// insert logic with report result
	var me = this,
		map_inst = me.map_inst,
		i;
		
	me.markers = me.markers || [];
	me.clusters = me.clusters || [];

	if (!map_inst)
	{
		me.map_inst = map_inst = me.google_initialize(owner.container);
	}
	else
	{
		for (i=0; i < me.markers.length; i++)
		{
			me.markers[i].setMap(null);
		}
		
		me.markers = [];
		
		for (i=0; i < me.clusters.length; i++)
		{
			me.clusters[i].setMap(null);
		}
		
		me.clusters = [];
	}

	me.setData(owner, results);
}

IG$.__chartoption.chartext.googlemap.prototype.setData = function(owner, results) {
	var me = this,
		sop = owner.sheetoption ? owner.sheetoption.model : null,
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
				minLng = (i == 0) ? Number(results.geodata[i].lng) : Math.min(minLng, Number(results.geodata[i].lng));
				maxLng = (i == 0) ? Number(results.geodata[i].lng) : Math.max(maxLng, Number(results.geodata[i].lng));
				minLat = (i == 0) ? Number(results.geodata[i].lat) : Math.min(minLat, Number(results.geodata[i].lat));
				maxLat = (i == 0) ? Number(results.geodata[i].lat) : Math.max(maxLat, Number(results.geodata[i].lat));
			}

			mlng = (maxLng + minLng) / 2;
			mlat = (maxLat + minLat) / 2;
		}

		var mpoint = new google.maps.LatLng(mlat, mlng);
		
		map.setCenter(mpoint);
		
		me.validateData.call(me);
		
		return;
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
		contentString;

	if (colfix > -1 && colfix < results.colcnt)
	{
		for (i=0; i < rowfix; i++)
		{
			seriesname = (i==0) ? results.data[i][colfix].code : seriesname + " " + results.data[i][colfix].code;
		}
	}

	oLabel = new google.maps.Marker();

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
	
	if (!me.infowindow)
	{
		me.infowindow = new google.maps.InfoWindow({
			content: '<div id="content">'+
				'<div id="bodyContent">'+
				'</div>'+
				'</div>'
		});
	}

	$.each(results.geodata, function(i, p) {
		var mkey = p.lat + "_" + p.lng,
			pt = new google.maps.LatLng(p.lat, p.lng),
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

			marker = new google.maps.Circle({
				center: pt,
				fillColor: "#ff0000",
				fillOpacity: 0.3,
				strokeWeight: 0,
				radius: r
			});

			marker.m_gdata = [p];
			marker.setMap(map);
			me.markers.push(marker);
		}
		else
		{
			if (p.c && p.cc)
			{
				cluster = new ClusterMarker_(pt, p.cc, styles_, 60);
				cluster.setMap(map);
				me.clusters.push(cluster);
			}
			else
			{
				marker = new google.maps.Marker(); // (oIcon, { title : '��Ŀ : ' + pt.toString() });

				marker.m_gdata = [p];
				marker.setPosition(pt);
				marker.setMap(map);
				me.markers.push(marker);
				
				google.maps.event.addListener(marker, 'click', function() {
					var html = '<div id="content">'+
						'<div id="bodyContent"><table>',
						i;
					
					if (d)
					{
						for (i=0; i < d.length; i++)
						{
							html += "<tr><td><b>" + (h[i].text || h[i].code) + "</b></td><td>" + (d[i].text || d[i].code) + "</td></tr>";
						}
					}
					html += '</table></div>'+
						'</div>';
					me.infowindow.setContent(html);
					me.infowindow.open(me.map, this);
				});
			}
		}
	});
},

IG$.__chartoption.chartext.googlemap.prototype.updatedisplay = function(owner, w, h) {
	var me = this,
		map = me.map;
		
	if (map)
	{
		google.maps.event.trigger(map, "resize");
	}
}

