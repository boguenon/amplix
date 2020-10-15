IG$.__chartoption.chartext.vworldmap.prototype._tmpl = function(tmpl, dpoint, gmap) {
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
	
IG$.__chartoption.chartext.vworldmap.prototype.drawChart = function(owner, results) {
	var me = this,
		container = owner.container,
		jcontainer = $(container),
		cop = owner.cop, // chart option information
		map,
		seriesname,
		markermap = {},
		i, j,
		defaultLevel,
		m_xypos = cop.m_xypos,
		isgps = m_xypos == "EPSG:4326";
	
	jcontainer.empty();
	defaultLevel = parseInt(cop.m_zoom_level) || 11;
	
	var mlng = isgps ? 126.9773356 : 4520123.305972628,
		mlat = isgps ? 37.5675451 : 14135012.547689248,
		minLng, maxLng, minLat, maxLat;
		
	// ol.proj.transform([127.24,37.4], "EPSG:4326","EPSG:3857")
		
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
	
	var mpoint = isgps ? ol.proj.transform([mlng, mlat], "EPSG:4326","EPSG:3857") : [mlat, mlng];
	
	map = new vw.ol3.Map(jcontainer[0], {
		mapMode: "2d-map",
		basemapType: vw.ol3.BasemapType.graphic, 
		controlDensity: vw.ol3.DensityType.basic, 
		interactionDensity: vw.ol3.DensityType.basic, 
		controlsAutoArrange: true, 
		homePosition: vw.ol3.CameraPosition, 
		initPosition: vw.ol3.CameraPosition
	}); 
	me.map = map;
	
	map.getView().setZoom(defaultLevel);
	map.getView().setCenter(mpoint);
	
	var mapInfoTestWindow = new vw.ol3.Popup();
				
	mapInfoTestWindow.title = "&nbsp;";
	mapInfoTestWindow.setOffset([0,-26]);
	mapInfoTestWindow.close();
	
	map.addOverlay(mapInfoTestWindow); 
		
//		map.on("click", function(e) {
//			var pt = e.point,
//				target = e.target,
//				m_gdata,
//				param,
//				sender,
//				row,
//				disp, n, k,
//				ni,
//				marker;
//			
//			var oPoint = e.point;
//			var oTarget = e.target;
//
//			mapInfoTestWindow.close();
//			
//			if (target) 
//			{
//				if (e.clickCoveredMarker)
//				{
//					return;
//				}
//				
//				m_gdata = target.m_gdata;
//				
//				if (m_gdata && m_gdata.length > 0)
//				{
//					disp = '<DIV style="border-top:1px solid; border-bottom:2px groove black; border-left:1px solid; border-right:2px groove black;margin-bottom:1px;color:black;background-color:white; width:auto; height:auto;">';
//					
//					for (ni=0; ni < m_gdata.length; ni++)
//					{
//						var m_g = m_gdata[ni];
//						row = results.data[m_g.row];
//						sender = {
//							name: seriesname
//						};
//						
//						param = {
//							point: {
//								category: m_g.disp
//							}
//						};
//						
//						if (sender.name.charAt(sender.name.length-1) == ' ')
//						{
//							sender.name = sender.name.substring(0, sender.name.length - 1);
//						}
//						
//						disp += '<span style="color: #000000 !important;display: inline-block;font-size: 12px !important;font-weight: bold !important;letter-spacing: -1px !important;white-space: nowrap !important; padding: 2px 2px 2px 2px !important">';
//						disp += m_g.disp + '</span>';
//						
//						disp += '<span style="font-weight: normal">  ';
//						
//						for (n=colfix; n<row.length; n++)
//						{
//							var t = "";
//							for (k=0; k < rowfix; k++)
//							{
//								t = (k == 0) ? results.data[k][n].text : t + " " + results.data[k][n].text;
//							}
//							
//							disp += "<br />" + t + ": " + row[n].text;
//						}
//						
//						disp += '<span>';
//					}
//					
//					disp += "</DIV>";
//					
//					 mapInfoTestWindow.show(disp, pt);
//					
//					owner.procClickEvent.call(owner, sender, param);
//				}
//			}
//		});
		
	var colfix = results.colfix,
		rowfix = results.rowfix,
		p,
		d,
		dval,
		dindex = 0,
		nmax, nmin, pt,
		gmap = {}, g;
	
	if (colfix > -1 && colfix < results.cols)
	{
		for (i=0; i < rowfix; i++)
		{
			seriesname = (i==0) ? results.data[i][colfix].code : seriesname + " " + results.data[i][colfix].code;
		}
	}
	
	for (i=0; i < results.cols; i++)
	{
		for (j=0; j < rowfix; j++)
		{
			g = (j == 0) ? results.data[j][i].text : g + " " + results.data[j][i].text;
		}
		gmap[g] = i;
	}
	
	for (i=0; i < results.geodata.length; i++)
	{
		p = results.geodata[i];
		p.lat = Number(p.lat);
		p.lng = Number(p.lng);
		d = results.data[p.row];
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
	
	var tm = 30,
		n_min = parseInt(cop.m_min) || 1,
		n_max = parseInt(cop.m_max) || tm,
		r;
		
	n_max = n_max > tm ? tm : n_max;
	n_min = n_max < n_min ? 1 : n_min;
	
	$.each(results.geodata, function(i, p) {
		var mkey,
			pt,
			r,
			csource,
			circle,
			cstyle,
			marker, feature,
			tmpl;
			
		mkey = p.lat + "_" + p.lng;
		pt = isgps ? ol.proj.transform([p.lng, p.lat], "EPSG:4326","EPSG:3857") : [p.lat, p.lng];
		
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
			
			csource = new ol.source.Vector({ 
				wrapX: false  
			});
			
			circle = new ol.style.Circle({
				radius: r,
				fill: new ol.style.Fill({
					color: "#ff0000"
				}),
				fillOpacity: 0.3
			});
			
			cstyle = new ol.style.Style({
				stroke: new ol.style.Stroke({
					color: "#ffcc33",
					width: 2
				}),
				image: circle
			});
			
			marker = new ol.layer.Vector({
				source: csource,
				style: cstyle
			});
			
			feature = new ol.Feature(new ol.geom.Point(pt));
			marker.m_gdata = [p];
			marker.getSource().addFeature(feature);
			map.addLayer(marker);
		}
		else if (cop.m_marker == "info")
		{
			tmpl = cop.cdata_m_tmpl;
			if (tmpl)
			{
				tmpl = me._tmpl(tmpl, p, gmap);
				
				marker = new vw.ol3.Popup();
				
				marker.title = "&nbsp;";
				marker.setOffset([0,-26]);
				marker.show(tmpl, pt);
				
				marker.m_gdata = [p];
				map.addOverlay(marker); 
			}
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
				feature = new ol.Feature(new ol.geom.Point(pt));
				marker = new vw.ol3.layer.Marker();
				marker.getSource().addFeature(feature);
				 markermap[mkey] = marker;
				 marker.m_gdata = [p];
				map.addLayer(marker);
			}
		}
	});
}
	
IG$.__chartoption.chartext.vworldmap.prototype.test = function() {
	var oSize = new nhn.api.map.Size(28, 37);
	var oOffset = new nhn.api.map.Size(14, 37);
	var oIcon = new nhn.api.map.Icon('http://static.vworld.com/maps2/icons/pin_spot2.png', oSize, oOffset);
	
	
	
	var mapInfoTestWindow = new nhn.api.map.InfoWindow(); // - info window ����
	mapInfoTestWindow.setVisible(false); // - infowindow ǥ�� ���� ����.
	map.addOverlay(mapInfoTestWindow);	 // - ������ �߰�.	 


	var oLabel = new nhn.api.map.MarkerLabel();
	map.addOverlay(oLabel);
	
	map.attach('mouseenter', function(oCustomEvent) {
		var oTarget = oCustomEvent.target;
		// ��Ŀ���� ���콺 �ö󰣰Ÿ�
		if (oTarget instanceof nhn.api.map.Marker) {
			var oMarker = oTarget;
			oLabel.setVisible(true, oMarker); // - Ư�� ��Ŀ�� �����Ͽ� �ش� ��Ŀ�� title�� �����ش�.
		}
	});
	
	map.attach('mouseleave', function(oCustomEvent) {
		var oTarget = oCustomEvent.target;
		// ��Ŀ������ ���콺 �����Ÿ�
		if (oTarget instanceof nhn.api.map.Marker) {
			oLabel.setVisible(false);
		}
	});

	

	var oLabel = new nhn.api.map.MarkerLabel(); // - ��Ŀ �� ����.
	
	

};

IG$.__chartoption.chartext.vworldmap.prototype.updatedisplay = function(owner, w, h) {
	var me = this,
		map = me.map;
		
	if (map)
	{
		map.setSize.call(map, {
			width: w,
			height: h
		});
	}
};
	
IG$.__chartoption.chartext.vworldmap.destroy = function() {
	var me = this;
	
	me.owner && me.owner.container && $(me.owner.container).empty();
};