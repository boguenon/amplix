IG$.__chartoption.chartext.navermap.prototype._tmpl = function(tmpl, dpoint, gmap) {
	var r = tmpl,
		pdata = dpoint.data,
		k, s, m, c;
	
	for (k in gmap)
	{
		m = "{" + k + "}";
		s = r.indexOf(m);
		if (s > -1)
		{
			c = pdata[gmap[k]];
			r = r.substring(0, s) + (c.text || c.code) + r.substring(s + m.length);
		}
	}
	return r;
};
	
IG$.__chartoption.chartext.navermap.prototype.drawChart = function(owner, results) {
	var me = this,
		container = owner.container,
		jcontainer = $(container),
		sop = owner.sheetoption ? owner.sheetoption.model : null,
		cop = owner.cop, // chart option information
		copsettings = cop.settings,
		map,
		seriesname,
		markermap = {},
		m_lat, m_lng, trow,
		c_lat =  -1, c_lng = -1,
		tabledata = results._tabledata,
		rowfix = results.rowfix,
		geodata,
		i, j;
	
	jcontainer.empty();
	var defaultLevel = parseInt(cop.m_zoom_level) || 11;
	
	var mlng = 126.9773356,
		mlat = 37.5675451,
		minLng, maxLng, minLat, maxLat;

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
	
	var mpoint = new naver.maps.LatLng(mlat, mlng);
	
	map = new naver.maps.Map(jcontainer[0], { 
		center: mpoint,
		zoom: defaultLevel
		// enableWheelZoom : true,
		// enableDragPan : true,
		// enableDblClickZoom : false,
		// mapMode : 0,
		// activateTrafficMap : false,
		// activateBicycleMap : false,
		// minMaxLevel : [ 1, 14 ]
	});
	me.map = map;
	
	var colfix = results.colfix,
		rowfix = results.rowfix,
		p,
		d,
		dval,
		dindex = 0,
		nmax, nmin, pt,
		gmap = {}, g;
	
	if (colfix > -1 && colfix < results.colcnt)
	{
		for (i=0; i < rowfix; i++)
		{
			seriesname = (i==0) ? results._tabledata[i][colfix].code : seriesname + " " + results._tabledata[i][colfix].code;
		}
	}
	
	for (i=0; i < results.colcnt; i++)
	{
		for (j=0; j < rowfix; j++)
		{
			g = (j == 0) ? results._tabledata[j][i].text : g + " " + results._tabledata[j][i].text;
		}
		gmap[g] = i;
	}
	
	map.addListener('mouseenter', function(oCustomEvent) {
		var oTarget = oCustomEvent.target;
		// 마커위에 마우스 올라간거면
		if (oTarget instanceof naver.maps.Marker) {
			var oMarker = oTarget;
			oLabel.setVisible(true, oMarker); // - 특정 마커를 지정하여 해당 마커의 title을 보여준다.
		}
	});
	
	map.addListener('mouseleave', function(oCustomEvent) {
		var oTarget = oCustomEvent.target;
		// 마커위에서 마우스 나간거면
		if (oTarget instanceof naver.maps.Marker) {
			oLabel.setVisible(false);
		}
	});

	var mapInfoTestWindow = new naver.maps.InfoWindow({
		content: ""
	});
	
	var markerClickHandler = function(e, marker) {
		var pt = e.point,
			m_gdata,
			param,
			sender,
			row,
			disp, n, k,
			ni;
		
		if (mapInfoTestWindow.getMap())
		{
			mapInfoTestWindow.close();
		}
		
		if (marker) 
		{
			m_gdata = marker.m_gdata;
			
			if (m_gdata && m_gdata.length > 0)
			{
				disp = '<DIV style="border-top:1px solid; border-bottom:2px groove black; border-left:1px solid; border-right:2px groove black;margin-bottom:1px;color:black;background-color:white; width:auto; height:auto;">';
				
				for (ni=0; ni < m_gdata.length; ni++)
				{
					var m_g = m_gdata[ni];
					row = results._tabledata[m_g.row];
					sender = {
						name: seriesname
					};
					
					param = {
						point: {
							category: m_g.disp
						}
					};
					
					if (sender.name.charAt(sender.name.length-1) == ' ')
					{
						sender.name = sender.name.substring(0, sender.name.length - 1);
					}
					
					disp += '<span style="color: #000000 !important;display: inline-block;font-size: 12px !important;font-weight: bold !important;letter-spacing: -1px !important;white-space: nowrap !important; padding: 2px 2px 2px 2px !important">';
					disp += m_g.disp + '</span>';
					
					disp += '<span style="font-weight: normal">  ';
					
					for (n=colfix; n<row.length; n++)
					{
						var t = "";
						for (k=0; k < rowfix; k++)
						{
							t = (k == 0) ? results._tabledata[k][n].text : t + " " + results._tabledata[k][n].text;
						}
						
						disp += "<br />" + t + ": " + row[n].text;
					}
					
					disp += '<span>';
				}
				
				disp += "</DIV>";
				
				mapInfoTestWindow.setContent(disp);

				if (cop.m_marker == "circle")
				{
					mapInfoTestWindow.open(map, marker.getCenter());
				}
				else
				{
					mapInfoTestWindow.open(map, marker);
				}
				owner.procClickEvent.call(owner, sender, param);
			}
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
		
		dval = Number(p.data[colfix + dindex].code);
		if (isNaN(dval) == false)
		{
			nmax = isNaN(nmax) ? dval : Math.max(nmax, dval);
			nmin = isNaN(nmin) ? dval : Math.min(nmin, dval);
		}
		p.dval = dval;
	}
	
	var n_min = parseInt(cop.m_min) || 1000,
		n_max = parseInt(cop.m_max) || 10000,
		r;
	
	var marker,
		tmpl,
		p;
			
	$.each(results.geodata, function(i, p) {
		var pt,
			mkey,
			dval,
			marker,
			r;
			
		mkey = p.lat + "_" + p.lng;
		pt = new naver.maps.LatLng(p.lat, p.lng);
		
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
			
			marker = new naver.maps.Circle({
				map: map,
				center: pt,
				fillColor: "#ff0000",
				fillOpacity: 0.3,
				clickable: true,
				radius: r
			});
			
			marker.m_gdata = [p];

			naver.maps.Event.addListener(marker, "click", function(e) {
				markerClickHandler(e, marker);
			});
		}
		else
		{
			if (markermap[mkey])
			{
				marker = markermap[mkey];
				marker.m_gdata.push(p);
			}
			else
			{
				marker = new naver.maps.Marker({ 
					title : '마커 : ' + pt.toString(),
					position: pt,
					map: map 
				});
				markermap[mkey] = marker;
				marker.m_gdata = [p];

				naver.maps.Event.addListener(marker, "click", function(e) {
					markerClickHandler(e, marker);
				});
			}
		}
	});

};

IG$.__chartoption.chartext.navermap.prototype.updatedisplay = function(owner, w, h) {
	var me = this,
		map = me.map;
		
	if (map)
	{
		map.setSize.call(map, new naver.maps.Size(w, h));
	}
};
	
IG$.__chartoption.chartext.navermap.prototype.destroy = function() {
	var me = this;

	if (me.map)
	{
		me.map.destroy();
	}
	
	me.owner && me.owner.container && $(me.owner.container).empty();
};