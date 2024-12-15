IG$.cVis.circlepacking.prototype.drawCirclePacking = function() {
	var me = this,
		chartview = me.chartview,
		results = me.results,
		tabledata = results._tabledata,
		container = $(chartview.container),
		sop = chartview._ILb,
		cop = chartview.cop,
		i, j,
		jcontainer,
		data = [],
		colfix = results.colfix,
		rowfix = results.rowfix,
		cols = results.cols,
		rec, d, t,
		width,
		height,
		data = {
			name: "root",
			$map : {},
			children: []
		},
		maxDepth = 0,
		myChart,
		option;
	
	container.empty();
	jcontainer = $("<div class='igc-tg-gr'></div>").appendTo(container);
	
	width = container.width();
	height = container.height();
	jcontainer.width(width);
	jcontainer.height(height);
	
	var tparent = {},
		tval;

	var displayRoot = stratify();
	
	for (i=rowfix; i < tabledata.length; i++)
	{
		rec = tabledata[i];
		
		for (j=0; j < colfix; j++)
		{
			t = rec[j].text || rec[j].code;
			
			if (j == 0)
			{
				tval = data.$map[t];
				
				if (!tval)
				{
					tval = {
						name: t,
						$map: {},
						children: []
					};
					
					data.children.push(tval);
					data.$map[t] = tval;
				}
			}
			else
			{
				tval = tparent[j-1].$map[t];
				if (!tval)
				{
					tval = {
						name: t,
						$map: {}
					};
					
					if (j < colfix - 1)
						tval.children = [];
					
					tparent[j-1].children.push(tval);
					tparent[j-1].$map[t] = tval;
				}
			}
			
			tparent[j] = tval;
		}
		
		t = Number(rec[colfix].code);
		tparent[colfix-1].value = isNaN(t) ? 0 : t;
	}

	var seriesData = data;
	maxDepth = colfix;

	function stratify() {
		return d3
		  .stratify()
		  .parentId(function (d) {
			return d.id.substring(0, d.id.lastIndexOf('.'));
		  })(seriesData)
		  .sum(function (d) {
			return d.value || 0;
		  })
		  .sort(function (a, b) {
			return b.value - a.value;
		  });
	  }
	  function overallLayout(params, api) {
		var context = params.context;
		d3
		  .pack()
		  .size([api.getWidth() - 2, api.getHeight() - 2])
		  .padding(3)(displayRoot);
		context.nodes = {};
		displayRoot.descendants().forEach(function (node, index) {
		  context.nodes[node.id] = node;
		});
	}

	function renderItem(params, api) {
		var context = params.context;
		// Only do that layout once in each time `setOption` called.
		if (!context.layout) {
			context.layout = true;
			overallLayout(params, api);
		}
		var nodePath = api.value('id');
		var node = context.nodes[nodePath];
		if (!node) {
			// Reder nothing.
			return;
		}
		var isLeaf = !node.children || !node.children.length;
		var focus = new Uint32Array(
			node.descendants().map(function (node) {
				return node.data.index;
			})
		);
		var nodeName = isLeaf
		  ? nodePath
			  .slice(nodePath.lastIndexOf('.') + 1)
			  .split(/(?=[A-Z][^A-Z])/g)
			  .join('\n')
		  : '';
		var z2 = api.value('depth') * 2;
		return {
		  type: 'circle',
		  focus: focus,
		  shape: {
			cx: node.x,
			cy: node.y,
			r: node.r
		  },
		  transition: ['shape'],
		  z2: z2,
		  textContent: {
			type: 'text',
			style: {
			  // transition: isLeaf ? 'fontSize' : null,
			  text: nodeName,
			  fontFamily: 'Arial',
			  width: node.r * 1.3,
			  overflow: 'truncate',
			  fontSize: node.r / 3
			},
			emphasis: {
			  style: {
				overflow: null,
				fontSize: Math.max(node.r / 3, 12)
			  }
			}
		  },
		  textConfig: {
			position: 'inside'
		  },
		  style: {
			fill: api.visual('color')
		  },
		  emphasis: {
			style: {
			  fontFamily: 'Arial',
			  fontSize: 12,
			  shadowBlur: 20,
			  shadowOffsetX: 3,
			  shadowOffsetY: 5,
			  shadowColor: 'rgba(0,0,0,0.3)'
			}
		  }
		};
	};
	
	option = option = {
		dataset: {
		  source: seriesData
		},
		tooltip: {},
		visualMap: [
		  {
			show: false,
			min: 0,
			max: maxDepth,
			dimension: 'depth',
			inRange: {
			  color: ['#006edd', '#e0ffff']
			}
		  }
		],
		hoverLayerThreshold: Infinity,
		series: {
		  type: 'custom',
		  renderItem: renderItem,
		  progressive: 0,
		  coordinateSystem: 'none',
		  encode: {
			tooltip: 'value',
			itemName: 'id'
		  }
		}
	};
	
	if (window.echarts)
	{
		myChart = me.customchart = echarts.init(jcontainer[0], cop.echart_theme || ig$.echarts_theme || 'amplix', {
			renderer: "svg"
		});

		me.customchart.setOption(hoption);
	}

	myChart.on('click', { seriesIndex: 0 }, function (params) {
		drillDown(params.data.id);
	  });
	  function drillDown(targetNodeId) {
		displayRoot = stratify();
		if (targetNodeId != null) {
		  displayRoot = displayRoot.descendants().find(function (node) {
			return node.data.id === targetNodeId;
		  });
		}
		// A trick to prevent d3-hierarchy from visiting parents in this algorithm.
		displayRoot.parent = null;
		myChart.setOption({
		  dataset: {
			source: seriesData
		  }
		});
	  }
	  // Reset: click on the blank area.
	  myChart.getZr().on('click', function (event) {
		if (!event.target) {
		  drillDown();
		}
	  });
}

IG$.cVis.circlepacking.prototype.draw = function(results) {
	var me = this;

	me.results = results;
	
	me.drawCirclePacking();
};
	  
IG$.cVis.circlepacking.prototype.updatedisplay = function(w, h) {
	var me = this;
	
	if (me.customchart && me.results)
	{
		me.drawCirclePacking();
	}
};

IG$.cVis.circlepacking.prototype.dispose = function() {
	var me = this,
		customchart = me.customchart;
		
	if (customchart)
	{
		customchart.dispose && customchart.dispose();
		customchart.destroy && customchart.destroy();

		me.customchart = null;
	}
};