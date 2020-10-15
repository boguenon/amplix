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

IG$.__chartoption.chartext.daummap = function(owner) {
	this.owner = owner;
};

IG$.__chartoption.chartext.daummap.prototype = {
	drawChart: function(owner, results) {
		var me = this,
			container = owner.container,
			jcontainer = $(container),
			map,
			i, j;
		
		jcontainer.empty();
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
				minLng = (i == 0) ? Number(results.geodata[i].lng) : Math.min(minLng, Number(results.geodata[i].lng));
				maxLng = (i == 0) ? Number(results.geodata[i].lng) : Math.max(maxLng, Number(results.geodata[i].lng));
				minLat = (i == 0) ? Number(results.geodata[i].lat) : Math.min(minLat, Number(results.geodata[i].lat));
				maxLat = (i == 0) ? Number(results.geodata[i].lat) : Math.max(maxLat, Number(results.geodata[i].lat));
			}
			
			mlon = (maxLng - minLng) / 2;
			mlat = (maxLat - minLat) / 2;
		}
	},

	updatedisplay: function(owner, w, h) {
	}
}