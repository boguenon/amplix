IG$.__chartoption.charttype.push(
    {
        label: "Stock Chart",
        charttype: "hstock",
        subtype: "hstock",
        img: "hstock",
        grp: "h-stock"
    }
);

IG$.__chartoption.chartext.hstock = function(owner) {
    this.owner = owner;
}

IG$.__chartoption.chartext.hstock.prototype = {    
    drawChart: function(owner, results) {
        if (!IG$.__chartoption.chartext.hstock._loaded)
        {
            var me = this,
                js = [
                    "./custom/custom.hstock.worker.js"
                ],
                ltest = 0;
            
            IG$.getScriptCache(
                js, 
                new IG$.callBackObj(this, function() {
                    IG$.__chartoption.chartext.hstock._loaded = 1;
                    me.drawChart.call(me, owner, results);
                })
            );
        }
    },
    updatedisplay: function(owner, w, h) {
    },
    destroy: function() {
        var me = this;

        if (me.hchart && me.hchart.dispose)
        {
            me.hchart.dispose();
            me.hchart = null;
        }
    }
};