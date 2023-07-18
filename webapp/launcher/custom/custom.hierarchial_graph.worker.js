IG$.__chartoption.charttype = IG$.__chartoption.charttype || [];

IG$.cVis.hierarchialgraph.prototype.initChart = function(data) {
    var me = this,
    	myChart = this.customchart,
    	chartview = me.chartview,
    	cop = chartview.cop,
		copsettings = cop.settings || {},
		symbol = [Number(copsettings.m_h_min || "3"), Number(copsettings.m_h_max || "15")],
		symbol_ratio = Number(copsettings.m_h_ratio || "50") / 100,
		endsymbol = copsettings.m_h_end_symbol || "arrow";
    
	data.nodes.forEach(function(node) {
		node.label = {
			show: node.symbolSize > (symbol[1] - symbol[0]) * symbol_ratio + symbol[0]
		};
	});
	
	var option = {
		title: {show: false},
        tooltip: {
        	formatter: function(item) {
        		if (item.dataType == "edge")
        		{
        			return item.data.desc || ("edge " + item.name);
        		}
        	}
        },
        legend: [
        	{
				type: "scroll",
				show: false,
        		data: data.categories.map(function(a) {
        			return a.name;
        		})
        	}
        ],
        
        // animationDuration: 1500,
		// animationEasingUpdate: 'quinticInOut',
        series: [
            {
                type: 'graph',
				layout: "force",
				data: data.nodes,
				links: data.links,
				edges: data.links,
				categories: data.categories,
				roam: true,
				animation: false,
				draggable: true,
				zoom: 10,
				force: {
					edgeLength: Number(copsettings.m_h_edgelength || "5"),
					repulsion: Number(copsettings.m_h_repulsion || "20"),
					gravity: Number(copsettings.m_h_gravity || "0.2")
				},
                top: '1%',
                left: '1%',
                bottom: '1%',
                right: '1%',
				// fontSize:15,

                // symbolSize: 1,

                label: {
                    position: 'right',
                    verticalAlign: 'middle',
                    align: 'center',
                    // fontSize: 15,
                    // fontFamily: 'NanumSquareRound',
                    formatter: "{b}"
                },
				/*
				lineStyle: {
					color: "source",
					curveness: 0.1
				},
				*/
                emphasis: {
                    focus: 'adjacency',
                    lineStyle: {
                    	width: 10
                    }
                }
            }
        ]
    },
    legendposition,
    clegend,
    ctitle;
    
    
    if (cop.showlegend == true)
    {
		clegend = option.legend[0];
		ctitle = option.title;
		clegend.show = true;
		legendposition = cop.legendposition = cop.legendposition || "BOTTOM_CENTER";
		
		if (legendposition.indexOf("BOTTOM_") > -1)
		{
			clegend.orient = "horizontal";
			if (ctitle.show && ctitle.bottom > 0)
			{
				clegend.bottom = ctitle.bottom + 30;
			}
			else
			{
				clegend.bottom = 10;
			}
		}
		else if (legendposition.indexOf("TOP_") > -1)
		{
			clegend.orient = "horizontal";
			clegend.top = 10; // coption.grid.top + 10;
		}
		else
		{
			clegend.orient = "vertical";
			
			if (legendposition.indexOf("_TOP") > -1)
			{
				clegend.top = 10;
			}
			else if (legendposition.indexOf("_BOTTOM") > -1)
			{
				clegend.bottom = 10;
			}
			else if (legendposition.indexOf("_CENTER") > -1)
			{
				clegend.top = h / 2;
			}
		}
		
		if (clegend.orient == "horizontal")
		{
			if (legendposition.indexOf("_RIGHT") > -1)
			{
				clegend.right = 20;
			}
			else if (legendposition.indexOf("_LEFT") > -1)
			{
				clegend.left = 20; // - w / 2 + 200;
			}
		}
		else
		{
			if (legendposition.indexOf("RIGHT_") > -1)
			{
				clegend.right = 20;
			}
			else if (legendposition.indexOf("LEFT_") > -1)
			{
				clegend.left = 20; // - w / 2 + 200;
			}
		}
	}
    
    if (endsymbol)
    {
    	option.series[0].edgeSymbol = ["none", endsymbol];
    }
    
    myChart.setOption(option);
}

IG$.cVis.hierarchialgraph.prototype.draw = function(results) {
	var me = this,
		chartview = me.chartview,
		container = $(chartview.container),
		cop = chartview.cop,
		sop = chartview.sheetoption ? chartview.sheetoption.model : null,
		copsettings = cop.settings || {};
	
	me.container = container;
		
	if (results)
	{
		var colfix,
			rowfix,
			rows,
			cols,
			i, j,
			data = results._tabledata,
			cop = chartview.cop,
			seriesData = [],
			keymap,
			base,
			d, dl, n = 0, pd, dn,
			dval,
			tval, has_tval,
			cnode, pn,
			categmap = {},
			cname,
			parentNode,
			nodemap,
			linkmap = {},
			nid = 0,
			symbol = [Number(copsettings.m_h_min || "3"), Number(copsettings.m_h_max || "15")],
			col_categ = -1,
			col_src = -1,
			col_tgt = -1,
			col_mcmt = -1,
			col_msrc = -1,
			col_mtgt = -1,
			src_val,
			tgt_val,
			fieldmap = {},
			fields;
		
		cols = results.colcnt;
		rows = data.length;
		colfix = results.colfix;
		rowfix = results.rowfix;
		
		if (sop)
		{
			fields = sop.rows.concat(sop.measures);
			for (i=0; i < fields.length; i++)
			{
				fieldmap[fields[i].uid] = i;
			}
		}
		
		if (colfix < 2)
		{
			IG$.ShowError(IRm$.r1("E_CHART_DRAWING") + ": need at least 2 column (source - target)"); // "Error on chart drawing : " + e.message);
			return;
		}
		
		if (colfix > 2)
		{
			if (copsettings.m_h_axis_src && copsettings.m_h_axis_tgt)
			{
				if (copsettings.m_h_axis_categ)
				{
					col_categ = fieldmap[copsettings.m_h_axis_categ] || 0;
				}
			}
			else
			{
				col_categ = fieldmap[copsettings.m_h_axis_categ] || 0;
			}
			col_src = fieldmap[copsettings.m_h_axis_src] || 1;
			col_tgt = fieldmap[copsettings.m_h_axis_tgt] || 2;
		}
		else
		{
			col_src = fieldmap[copsettings.m_h_axis_src] || 0;
			col_tgt = fieldmap[copsettings.m_h_axis_tgt] || 1;
		}
		
		if (copsettings.m_h_axis_srcdt && copsettings.m_h_axis_srcdt in fieldmap)
		{
			col_msrc = fieldmap[copsettings.m_h_axis_srcdt];
		}
		
		if (copsettings.m_h_axis_tgtdt && copsettings.m_h_axis_tgtdt in fieldmap)
		{
			col_mtgt = fieldmap[copsettings.m_h_axis_tgtdt];
		}
		
		if (copsettings.m_h_axis_cmt && copsettings.m_h_axis_cmt in fieldmap)
		{
			col_mcmt = fieldmap[copsettings.m_h_axis_cmt];
		}
		
		if (cols - colfix > 0)
		{
			if (col_msrc < 0 && !copsettings.m_h_axis_srcdt)
			{
				col_msrc = colfix;
			}
			
			if (cols - colfix > 1)
			{
				if (col_mtgt < 0 && !copsettings.m_h_axis_tgtdt)
				{
					col_mtgt = colfix + 1;
				}
				
				if (cols - colfix > 2 && col_mcmt < 0 && !copsettings.m_h_axis_cmt)
				{
					col_mcmt = colfix + 2;
				}
			}
		}
		
		base = {
			nodes: [],
			links: [],
			categories: []
		};
		
		seriesData = base;
		
		nodemap = {};
		
		keymap = {};
		
		has_tval = (cols > colfix + 1);
				
		for (i=rowfix; i < rows; i++)
		{
			d = "root";
			dval = (Number(data[i][colfix].code) || 0);
			
			var categval = undefined;
			
			if (col_categ > -1)
			{
				cname = data[i][col_categ].text;
				
				if (typeof(categmap[cname]) == "undefined")
				{
					var cobj = {
						name: cname,
						label: cname
					};
					
					categval = categmap[cname] = base.categories.length;
					base.categories.push(cobj);
				}
				else
				{
					categval = categmap[cname];
				}
			}
			
			src_val = data[i][col_src].text;
			tgt_val = data[i][col_tgt].text;
			dval = Number(data[i][colfix].code || "0");
			
			if (has_tval)
			{
				tval = Number(data[i][colfix+1].code || "0");
			}
			
			var snode, tnode,
				lnk, mlnk;
				
			if (nodemap[src_val])
			{
				snode = nodemap[src_val];
				
				if (!has_tval)
				{
					snode.value += dval;
				}
			}
			else
			{
				snode = {
					id: (nid++),
					name: src_val,
					value: dval
				};
				
				base.nodes.push(snode);
				nodemap[src_val] = snode;
			}
			
			if (nodemap[tgt_val])
			{
				tnode = nodemap[tgt_val];
			}
			else
			{
				tnode = {
					id: (nid++),
					name: tgt_val,
					value: has_tval ? tval : dval
				};
				
				base.nodes.push(tnode);
				nodemap[tgt_val] = tnode;
				
				if (typeof(categval) != "undefined")
				{
					tnode.category = categval;
				}
			}
			
			if (typeof(categval) != "undefined")
			{
				snode.category = categval;
			}
			
			if (!linkmap[src_val + "=>" + tgt_val])
			{
				lnk = {
					source: snode.id,
					target: tnode.id,
					
					desc: src_val + " => " + tgt_val
				};
				
				base.links.push(lnk);
				
				if (col_mcmt > -1)
				{
					lnk.label = {show: true, formatter: data[i][col_mcmt].text};
				}
				
				mlnk = linkmap[tgt_val + "=>" + src_val];
				
				if (mlnk)
				{
					lnk.lineStyle = {
						curveness: 0.2
					};
					
					mlnk.lineStyle = {
						curveness: 0.2
					};
				}
				
				linkmap[src_val + "=>" + tgt_val] = lnk;
			}
		}
		
		var valuemax = 0,
			sdiff = symbol[1] - symbol[0];
		
		$.each(base.nodes, function(i, node) {
			valuemax = Math.max(node.value, valuemax);
		});
		
		$.each(base.nodes, function(i, node) {
			node.symbolSize = node.value / valuemax * sdiff + symbol[0];
		});
		
		if (!me.customchart)
		{
			me.customchart = echarts.init(me.container[0], cop.echart_theme || ig$.echarts_theme || 'amplix', {
				renderer: "canvas"
			});
		}
			
		me.initChart(seriesData);
	}
};

IG$.cVis.hierarchialgraph.prototype.updatedisplay = function(w, h) {
	var me = this,
		customchart = me.customchart;
	
	if (customchart)
	{
		customchart.resize({width: w, height: h});
	}
}

IG$.cVis.hierarchialgraph.prototype.dispose = function() {
	var me = this,
		customchart = me.customchart;
		
	if (!customchart)
		return;
		
	try
	{
		customchart.destroy && customchart.destroy();
		customchart.dispose && customchart.dispose();
	}
	catch (e)
	{
	}
	
	me.customchart = null;
}