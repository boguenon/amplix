IG$.cVis.sankey.prototype.buildNode = function(results, snode) {
	var colfix = results.colfix,
		rowfix = results.rowfix,
		data = results._tabledata,
		i, j,
		smap,
		c,
		n = 0,
		bc,
		lmap = {},
		s, t,
		sm, k;
		
	for (j=0; j < colfix; j++)
	{
		smap = {};
		
		for (i=rowfix; i < data.length; i++)
		{
			c = data[i][j];
			
			if (c.position != 4)
			{
				if (!smap[c.code])
				{
					snode.nodes.push({
						name: c.text
					});
					smap[c.code] = snode.nodes.length;
				}
				c.__sn = smap[c.code];
			}
		}
	}
	
	for (i=rowfix; i < data.length; i++)
	{
		c = data[i][colfix].code || "0";

		c = Number(c);

		if (isNaN(c) || c <= 0)
			continue;
		
		bc = 0;
		
		for (j=0; j < colfix; j++)
		{
			if (data[i][j].position == 4)
			{
				bc = 1;
				break;
			}
		}
		
		if (bc)
			continue;
		
		for (j=1; j < colfix; j++)
		{
			s = data[i][j-1].__sn - 1;
			t = data[i][j].__sn - 1;
			
			k = "" + s + "_" + t;
			sm = lmap[k];
			if (sm)
			{
				sm.value += c;
			}
			else
			{
				sm = {
					source: snode.nodes[s].name,
					target: snode.nodes[t].name,
					value: c
				};
			
				snode.links.push(sm);
				lmap[k] = sm;
			}
		}
	}
}

IG$.cVis.sankey.prototype.draw = function(results) {
	var me = this;
	
	if (me._draw_timer)
	{
		clearTimeout(me._draw_timer);
		me._draw_timer = -1;
	}
	
	me._draw_timer = setTimeout(function() {
		me.drawChartTimer(results);
	}, 10);
}

IG$.cVis.sankey.prototype.drawChartTimer = function(results) {
	var me = this,
		chartview = me.chartview,
		cop = chartview.cop,
		container = chartview.container,
		jcontainer = $(container);

	if (results.colfix < 2)
	{
		IG$.ShowError(IRm$.r1("E_CHART_DRAWING") + " Need 2 Column on pivot definition!");
		return;
	}

	var snode = {
			nodes: [],
			links: []
		};
	
	me._results = results;
	
	me.buildNode(results, snode);
	
	var option = {
		title: {
			text: cop.title
		},
		tooltip: {
			trigger: 'item',
			triggerOn: 'mousemove'
		},
		series: [
			{
				type: 'sankey',
				data: snode.nodes,
				links: snode.links,
				emphasis: {
					focus: 'adjacency'
				},
				levels: [
					{
						depth: 0,
						itemStyle: {
							color: '#fbb4ae'
						},
						lineStyle: {
							color: 'source',
							opacity: 0.6
						}
					},
					{
					depth: 1,
						itemStyle: {
							color: '#b3cde3'
						},
						lineStyle: {
							color: 'source',
							opacity: 0.6
						}
					},
					{
						depth: 2,
						itemStyle: {
							color: '#ccebc5'
						},
						lineStyle: {
							color: 'source',
							opacity: 0.6
						}
					},
					{
						depth: 3,
						itemStyle: {
							color: '#decbe4'
						},
						lineStyle: {
							color: 'source',
							opacity: 0.6
						}
					}
				],
				lineStyle: {
					color: "gradient",
					curveness: 0.5
				}
			}
		]
	};

	if (window.echarts)
	{
		myChart = me.customchart = echarts.init(jcontainer[0], cop.echart_theme || ig$.echarts_theme || 'amplix', {
			renderer: "svg"
		});

		me.customchart.setOption(option);
	}
}

IG$.cVis.sankey.prototype.dispose = function() {
	var me = this,
		customchart = me.customchart;
		
	if (customchart)
	{
		customchart.dispose && customchart.dispose();
		me.customchart = null;
	}
}