IG$.__chartoption.charttype = IG$.__chartoption.charttype || [];

IG$.__chartoption.charttype.push(
    {
        label: "VWorld Map",
        charttype: "vworldmap",
        subtype: "vworldmap",
        img: "map",
        grp: "scientific"
    }
);

IG$.__chartoption.chartext.vworldmap = function(owner) {
};

IG$.__chartoption.chartext.vworldmap.prototype = {
    drawChart: function(owner, results) {
        var me = this,
            js = [
                "./custom/custom.map.vworld.worker.js"
            ];
        
        if (IG$.__chartoption.chartext.vworldmap_main)
        {
            if (me.dmain)
            {
                me.dmain.dispose();
                me.dmain = null;
            }
            
            me.dmain = new IG$.__chartoption.chartext.vworldmap_main(owner);
            me.dmain.drawChart.call(me.dmain, owner, results);
        }
        else
        {
            if (!IG$.__chartoption.chartext.vworldmap._loaded)
            {
                IG$.getScriptCache(
                    js, 
                    new IG$.callBackObj(this, function() {
                        IG$.__chartoption.chartext.vworldmap._loaded = 1;
                        var dmain = new IG$.__chartoption.chartext.vworldmap_main(owner);
                        me.dmain = dmain;
                        dmain.drawChart.call(dmain, owner, results);
                    })
                );
            }
        }
    },
    
    updatedisplay: function(owner, w, h) {
        var me = this;
        
        if (me.dmain)
        {
            me.dmain.updatedisplay.call(me.dmain, owner, w, h);
        }
    }
};