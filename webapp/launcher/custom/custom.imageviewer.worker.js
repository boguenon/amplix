IG$.__chartoption.charttype = IG$.__chartoption.charttype || [];


IG$.cVis.imgviewer.prototype.draw = function(results) {
	var me = this,
		chartview = me.chartview,
		container = $(chartview.container),
		cop = chartview.cop,
		copsettings = cop.settings || {},
		bgurl = copsettings.m_iv_bgimg,
		dataurl = copsettings.m_iv_data,
		rendertype = copsettings.m_iv_type;
	
	me.container = container;
	me.results = results;
	me.rendertype = rendertype;
	
	if (me.html)
	{
		me.html.remove();
		me.html = null;
	}
	
	html = me.html = $("<div></div>").appendTo(container);
	html.width(container.width()).height(container.height());
	
	html.css({
		position: "absolute"
	}).width("100%").height("100%");
	
	me.bg = $("<div></div>").appendTo(html)
		.css({
			position: "absolute",
			backgroundImage: "url('" + bgurl + "')",
			backgroundRepeat: "no-repeat",
			backgroundPosition: "center"
		}).width("100%").height("100%");
	
	me.data = {};
	
	if (dataurl)
	{
		$.ajax({
			type: "GET",
			url: dataurl, 
			dataType: "json",
			timeout: 10000,
			success: function(data) {
				me.data = data;
				me._draw_charts(results, rendertype);
			},
			error: function(e, status, thrown) {
			}
		});
	}
	else
	{
		me._draw_charts(results, rendertype);
	}
};

IG$.cVis.imgviewer.prototype._draw_charts = function(result, rendertype) {
		var me = this,
			chartview = me.chartview,
			tabledata = result ? result._tabledata : null,
			colfix = result ? result.colfix : 0,
			isnodata = result ? result.rowfix == result.rowcnt : true,
			i, j,
			row, t, tc,
			header = [],
			map_position,
			center = [html.width()/2, html.height()/2],
			cop = chartview.cop,
			sep = cop.xaxissep || ig$.chart_separator || IG$._separator;
		
		sep = sep == "nl" ? "\n" : sep;
		
		me.map_position = map_position = {};
		
		if (me.data.data)
		{
			var imgwidth = me.data.width,
				imgheight = me.data.height;
				
			$.each(me.data.data, function(i, d) {
				var k = d.key || d.name;
				
				map_position[k] = d;
				
				if (!d.ehtml)
				{
					d.ehtml = $("<div class='idv-imgview-region' title='" + k + "'></div>").appendTo(me.html)
					d.ehtml.css({
						position: "absolute",
						width: d.w,
						height: d.h,
						left: center[0] + d.x - imgwidth / 2,
						top: center[1] + d.y - imgheight / 2,
						border: "none",
						backgroundColor: "#efefef",
						cursor: "pointer"
					});
					
					d.ehtml.bind("click", function(e) {
						var sender = {
								name: header.length ? header[0] : ""
							},
							param = {
								point: {
									category: k
								}
							};
					
						chartview.procClickEvent.call(chartview, sender, param);
					});
				}
				else
				{
					d.ehtml.css({
						left: center[0] + d.x - imgwidth / 2,
						top: center[1] + d.y - imgheight / 2
					});
				}
				
				if (d.html)
				{
					d.html.css({
						left: center[0] + d.x - imgwidth / 2,
						top: center[1] + d.y - imgheight / 2
					});
				}
			});
		}
			
		if (!isnodata)
		{
			if (rendertype)
			{
				row = tabledata[0];
				for (i=colfix; i < result.colcnt; i++)
				{
					t = "";
					for (j=0; j < result.rowfix; j++)
					{
						tc = row[i].text || row[i].code;
						
						t = (j == 0) ? tc : t + sep + tc;
					}
					header.push(t);
				}
				
				for (i=result.rowfix; i < tabledata.length; i++)
				{
					row = tabledata[i];
					
					me._draw_chart(row, colfix, header, rendertype); 
				}
			}
		}
	}

IG$.cVis.imgviewer.prototype._draw_chart = function(row, colfix, header, rendertype) {
	var me = this,
		cname,
		i, t,
		pos,
		html = me.html,
		center = [html.width()/2, html.height()/2],
		map_position = me.map_position;
	
	for (i=0; i < colfix; i++)
	{
		t = row[i].text || row[i].code;
		cname = (i == 0) ? t : cname + " " + t; 
	}
	
	pos = map_position[cname];
	
	if (pos)
	{
		var imgwidth = me.data.width,
			imgheight = me.data.height;
				
		pos.html = $("<div class='idv-imgview-chart'></div>").appendTo(me.html)
			.css({
				position: "absolute",
				width: pos.w,
				height: pos.h,
				left: center[0] + pos.x - imgwidth / 2,
				top: center[1] + pos.y - imgheight / 2
			});
			
		me._draw_echart(pos, row, colfix, header, rendertype);
	}
};

IG$.cVis.imgviewer.prototype._draw_echart = function(pos, row, colfix, header, rendertype) {
	var me = this,
		ec = echarts.init(pos.html[0], "amplix", {
			renderer: "canvas"
		}),
		d,
		serie = {
			type: rendertype,
			radius: "50%",
			data: [
			]
		},
		i, v, t;
		
	d = {
		series: [
			serie
		]
	};
	
	for (i=colfix; i < row.length; i++)
	{
		t = row[i].code;
		v = {
			name: header[i - colfix],
			value: Number(t) 
		};
		serie.data.push(v);
	}
		
	if (rendertype == "pie")
	{
		
	}
	else
	{
		d.yAxis = {
		    type: 'value'
		};
		
		d.xAxis = {
			type: "category",
			data: []
		};
		
		for (i=0; i < header.length; i++)
		{
			d.xAxis.data.push(header[i]);
		}
	}
	ec.setOption(d);
};

IG$.cVis.imgviewer.prototype.updatedisplay = function(w, h) {
	// this.map.m1.call(this.map);
	var me = this;
	
	me._draw_charts();
}

IG$.cVis.imgviewer.prototype.destroy = function() {
	var me = this,
		chartview = me.chartview;
		
	if (chartview && chartview.container)
	{
		$(chartview.container).empty();
	}
}