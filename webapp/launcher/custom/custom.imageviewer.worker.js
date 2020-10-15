IG$.__chartoption.charttype = IG$.__chartoption.charttype || [];


IG$.__chartoption.chartext.imgviewer.prototype.drawChart = function(owner, results) {
	var me = this,
		container = $(owner.container),
		cop = owner.cop;
	
	me.owner = owner;
	me.container = container;
	
	me.container.empty();
	
	me.img_div = $("<div style='position:relative;width:100%;height:100%;overflow:hidden;'></div>").appendTo(me.container);
	
	if (results)
	{
		var colfix,
			rowfix,
			rows,
			cols,
			i, j, k, kname,
			chart,
			chartdiv,
			tw = container.width(),
			th = container.height(),
			px = 0, py = 0, pw,
			gtype,
			sname,
			sdata = [],
			nchart = 0,
			f_ind_svalue_n = -1,
			ncnt,
			img_path,
			tabledata = results._tabledata;
		
		cols = results.cols;
		rows = tabledata.length;
		colfix = results.colfix;
		rowfix = results.rowfix;
		
		img_path = tabledata[1][1].code;
		
		// img_path = "../main/images/intro-1200.jpg?tag=" + img_path;
		
		me.img_tag = $("<img src='" + img_path + "'></img>").appendTo(me.img_div);
		
		setTimeout(function() {
			me.updatedisplay.call(me, owner, tw, th);
		}, 10);
	}
};

IG$.__chartoption.chartext.imgviewer.prototype.updatedisplay = function(owner, w, h) {
	// this.map.m1.call(this.map);
	var me = this,
		i,
		px = 0, py = 0, pw, ph = h,
		img_w, img_h;
		
	if (me.img_div)
	{
		me.img_div.width(w).height(h);
		
		// fit width
		// me.img_tag.width(w);
		// me.img_tag.height(h);
		// end of fit width
		
		// center align
		img_w = me.img_tag.width();
		img_h = me.img_tag.height();
		
		me.img_tag.css({
			marginTop: (h - img_h) / 2,
			marginLeft: (w - img_w) / 2
		});
		// end of center align
	}
}

IG$.__chartoption.chartext.imgviewer.prototype.destroy = function() {
	var me = this,
		owner = me.owner;
		
	if (owner && owner.container)
	{
		$(owner.container).empty();
	}
}