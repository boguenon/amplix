IG$.__chartoption.charttype.push(
    {
        label: "Bar Chart Race",
        charttype: "barrace",
        subtype: "barrace",
        img: "barrace",
        grp: "scientific"
    }
);

IG$.cVis.barrace = $s.extend(IG$.cVis.base, {
	draw: function(results) {
		var me = this;
		
		if (IG$.cVis.barrace._loading)
		{
			setTimeout(function() {
				me.draw.call(me, results);
			}, 500);
			
			return;
		}
		
        if (!IG$.cVis.barrace._loaded)
        {
            var js = [
					"./custom/d3-array.v2.min.js",
                    "./custom/custom.barrace.worker.js"
                ];
            
			IG$.cVis.barrace._loading = 1;
			
            IG$.getScriptCache(
                js, 
                new IG$.callBackObj(this, function() {
                    IG$.cVis.barrace._loaded = 1;
                    me.draw.call(me, results);
                })
            );
        }
    },
    updatedisplay: function(w, h) {
    }
});
