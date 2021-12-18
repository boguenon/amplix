IG$.__chartoption.charttype = IG$.__chartoption.charttype || [];

IG$.__chartoption.chartext.hierarchy.prototype.initChart = function(seriesData, maxDepth) {
    var displayRoot = stratify();
    
    var myChart = this.customchart;

    function stratify() {
        return d3.stratify()
            .parentId(function (d) {
                return d.id.substring(0, d.id.lastIndexOf('.'));
            })(
                seriesData
            )
            .sum(function (d) {
                return d.value || 0;
            })
            .sort(function (a, b) {
                return b.value - a.value;
            });
    }

    function overallLayout(params, api) {
        var context = params.context;
        d3.pack()
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

        var focus = new Uint32Array(node.descendants().map(function (node) {
            return node.data.index;
        }));

/*
        var nodeName = isLeaf
            ? nodePath.slice(nodePath.lastIndexOf('.') + 1).split(/(?=[A-Z][^A-Z])/g).join('\n')
            : '';
*/
        var nodeName = isLeaf
            ? nodePath.slice(nodePath.lastIndexOf('.') + 1).split(' ').join('\n')
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
    }

    var option = {
        dataset: {
            source: seriesData
        },
        tooltip: {},
        visualMap: {
            show: false,
            min: 0,
            max: maxDepth,
            dimension: 'depth',
            inRange: {
                color: ['#006edd', '#e0ffff']
            }
        },
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
    
    myChart.setOption(option);

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

IG$.__chartoption.chartext.hierarchy.prototype.drawChart = function(owner, results) {
	var me = this,
		container = $(owner.container),
		cop = owner.cop;
	
	me.owner = owner;
	me.container = container;
		
	if (results)
	{
		var colfix,
			rowfix,
			rows,
			cols,
			i, j,
			data = results._tabledata,
			cop = owner.cop,
			seriesData = [],
			keymap,
			base,
			maxDepth = 0,
			d, dl, n = 0,
			dval;
		
		cols = results.colcnt;
		rows = data.length;
		colfix = results.colfix;
		rowfix = results.rowfix;
		
		maxDepth = colfix;
		
		if (maxDepth == 0)
		{
			
			return;
		}
		
		base = {
			id: "root",
			value: 0,
			depth: 0,
			index: seriesData.length
		};
		
		seriesData.push(base);
		
		keymap = new Array(maxDepth);
		
		for (i=rowfix; i < rows; i++)
		{
			d = "root";
			dval = (Number(data[i][colfix].code) || 0);
			
			for (j=0; j < colfix; j++)
			{
				tval = data[i][j].text;
				
				d += "." + tval;
				
				if (keymap[j] == d)
					continue;
					
				dl = {
					id: d,
					depth: j+1,
					index: seriesData.length,
					value: dval
				};
				
				if (dl.value < 0)
					continue;
				
				seriesData.push(dl);
				keymap[j] = d;
			}
		}
		
		if (!me.customchart)
		{
			me.customchart = echarts.init(me.container[0], cop.echart_theme || ig$.echarts_theme || 'amplix', {
				renderer: "canvas"
			});
		}
			
		me.initChart(seriesData, maxDepth);
	}
};

IG$.__chartoption.chartext.hierarchy.prototype.updatedisplay = function(owner, w, h) {
	var me = this,
		customchart = me.customchart;
	
	if (customchart)
	{
		customchart.resize({width: w, height: h});
	}
}

IG$.__chartoption.chartext.hierarchy.prototype.dispose = function() {
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