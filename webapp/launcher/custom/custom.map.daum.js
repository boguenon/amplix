IG$.__chartoption.charttype = IG$.__chartoption.charttype || [];

IG$.__chartoption.charttype.push(
	{
		label: "Daum Map",
		charttype: "daummap",
		subtype: "daummap",
		img: "map_daum",
		grp: "map"
	}
);

IG$.cVis.daummap = $s.extend(IG$.cVis.base, {
	draw: function(results) {
		var me = this,
			chartview = me.chartview,
			container = chartview.container,
			jcontainer = $(container),
			map,
			i, j,
			p;
		
		jcontainer.empty();

		if (!window.daum) 
		{
			IG$.ShowError(IRm$.r1("E_CHART_DRAWING") + " Map Library not loaded properly!");
			return;
		}

		map = new daum.maps.Map(jcontainer[0], {
			center: new daum.maps.LatLng(37.537123, 127.005523),
			level: 3
		});
		me.map = map;
		
		jcontainer.bind("mousedown", function(e) {
		});
		
		var mlon = 127.005523,
			mlat = 37.537123,
			minLng, maxLng, minLat, maxLat;
			
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
			
			mlon = (maxLng - minLng) / 2;
			mlat = (maxLat - minLat) / 2;
		}
	}
});
