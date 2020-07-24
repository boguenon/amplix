IG$.__chartoption.charttype = IG$.__chartoption.charttype || [];

IG$.__chartoption.charttype.push(
    {
        label:"Image Viewer",
        charttype: "imgviewer",
        subtype: "imgviewer",
        img: "imgviewer",
        grp: "scientific"
    }
);

IG$.__chartoption.chartext.imgviewer = function(owner) {
    this.owner = owner;
}

IG$.__chartoption.chartext.imgviewer.prototype = {
    drawChart: function(owner, results) {
        if (!IG$.__chartoption.chartext.imgviewer._loaded)
        {
            var me = this,
                js = [
                    "./custom/custom.imageviewer.worker.js"
                ],
                ltest = 0;
            
            IG$.getScriptCache(
                js, 
                new IG$.callBackObj(this, function() {
                    IG$.__chartoption.chartext.imgviewer._loaded = true;
                    me.drawChart.call(me, owner, results);
                })
            );
        }
    },
    
    updatedisplay: function(owner, w, h) {
    }
};