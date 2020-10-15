IG$.__chartoption.charttype = IG$.__chartoption.charttype || [];

IG$.__chartoption.charttype.push(
	{
		label:"Google map",
		charttype: "googlemap",
		subtype: "googlemap",
		img: "map_google",
		grp: "map"
	}
);

IG$.__chartoption.chartext.googlemap = function(owner) {
	this.owner = owner;
};

// https://maps.googleapis.com/maps/api/js?&sensor=false

IG$.__chartoption.chartext.googlemap.prototype = {
	drawChart: function(owner, results) {
		var me = this;
		
		if (!ig$.google_map_api_key)
		{
			IG$.alertmsg(ig$.appname, "API key is missing!", null, null, 0, "error");
			return;	
		}
		
		if (IG$.__chartoption.chartext.googlemap._loading)
		{
			setTimeout(function() {
				me.drawChart.call(me, owner, results);
			}, 500);
			
			return;
		}
		
		if (!IG$.__chartoption.chartext.googlemap._loaded)
		{
			IG$.__chartoption.chartext.googlemap._loading = 1;
			
			IG$.getScriptCache([
				{
					src: "https://maps.googleapis.com/maps/api/js?key=" + ig$.google_map_api_key, // + "&callback=initMap",
					defer: true,
					async: true
				}
			], new IG$.callBackObj(this, function() {
				var js = [
						"./custom/custom.map.google.worker.js",
						"./custom/custom.map.google.clustermarker.js"
					];
				
				IG$.getScriptCache(
					js, 
					new IG$.callBackObj(this, function() {
						IG$.__chartoption.chartext.googlemap._loaded = 1;
						me.drawChart.call(me, owner, results);
					})
				);
			}));
		}
	},

	updatedisplay: function(owner, w, h) {
		var me = this,
			map = me.map;
			
		if (map)
		{
			google.maps.event.trigger(map, "resize");
		}
	}
};
