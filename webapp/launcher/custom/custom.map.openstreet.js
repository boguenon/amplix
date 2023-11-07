IG$.__chartoption.charttype = IG$.__chartoption.charttype || [];

IG$.__chartoption.charttype.push(
	{
		label:"OpenStreet map",
		charttype: "openstreetmap",
		subtype: "openstreetmap",
		img: "map_openstreets",
		grp: "map"
	}
);

IG$.cVis.openstreetmap = $s.extend(IG$.cVis.base, {
	draw: function(results) {
		var me = this;
		
		if (IG$.cVis.openstreetmap._loading)
		{
			setTimeout(function() {
				me.draw(results);
			}, 500);
			
			return;
		}
		
		if (!IG$.cVis.openstreetmap._loaded)
		{
			IG$.cVis.openstreetmap._loading = 1;
			
			IG$.getScriptCache([
                "./css/leaflet.css",
                "./js/leaflet.js"
			], new IG$.callBackObj(this, function() {
				var js = [
						"./custom/custom.map.openstreet.worker.js"
					];
				
				IG$.getScriptCache(
					js, 
					new IG$.callBackObj(this, function() {
						IG$.cVis.openstreetmap._loaded = 1;
						me.draw(results);
					})
				);
			}));
		}
	},

	updatedisplay: function(w, h) {
		var me = this,
			map = me.map;
			
		if (map)
		{
			// openstreet.maps.event.trigger(map, "resize");
		}
	}
});

