IG$.__chartoption.charttype.push(
    {
        label: "Bar Chart Race",
        charttype: "barrace",
        subtype: "barrace",
        img: "barrace",
        grp: "scientific"
    }
);

IG$.__chartoption.chartext.barrace = function(owner) {
    this.owner = owner;
}

IG$.__chartoption.chartext.barrace.prototype = {
	drawChart: function(owner, results) {
		var me = this;
		
		if (IG$.__chartoption.chartext.barrace._loading)
		{
			setTimeout(function() {
				me.drawChart.call(me, owner, results);
			}, 500);
			
			return;
		}
		
        if (!IG$.__chartoption.chartext.barrace._loaded)
        {
            var js = [
					"./custom/d3-array.v2.min.js",
                    "./custom/custom.barrace.worker.js"
                ];
            
			IG$.__chartoption.chartext.barrace._loading = 1;
			
            IG$.getScriptCache(
                js, 
                new IG$.callBackObj(this, function() {
                    IG$.__chartoption.chartext.barrace._loaded = 1;
                    me.drawChart.call(me, owner, results);
                })
            );
        }
    },
    updatedisplay: function(owner, w, h) {
    }
}
