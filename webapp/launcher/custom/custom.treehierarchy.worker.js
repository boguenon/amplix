IG$.__chartoption.charttype = IG$.__chartoption.charttype || [];

IG$.__chartoption.chartext.treehierarchy.prototype.initChart = function(data) {
    var myChart = this.customchart;
    
    data.children.forEach(function (datum, index) {
        index % 2 === 0 && (datum.collapsed = true);
    });

	var option = {
        tooltip: {
            trigger: 'item',
            triggerOn: 'mousemove'
        },
        series: [
            {
                type: 'tree',

                data: [data],

                top: '1%',
                left: '7%',
                bottom: '1%',
                right: '20%',

                symbolSize: 7,

                label: {
                    position: 'left',
                    verticalAlign: 'middle',
                    align: 'right',
                    fontSize: 9
                },

                leaves: {
                    label: {
                        position: 'right',
                        verticalAlign: 'middle',
                        align: 'left'
                    }
                },

                emphasis: {
                    focus: 'descendant'
                },

                expandAndCollapse: true,
                animationDuration: 550,
                animationDurationUpdate: 750
            }
        ]
    }
    
    myChart.setOption(option);
}

IG$.__chartoption.chartext.treehierarchy.prototype.drawChart = function(owner, results) {
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
			d, dl, n = 0, pd,
			dval,
			parentNode;
		
		cols = results.colcnt;
		rows = data.length;
		colfix = results.colfix;
		rowfix = results.rowfix;
		
		if (colfix == 0)
		{
			return;
		}
		
		base = {
			name: "root",
			children: []
		};
		
		seriesData = base;
		
		keymap = new Array(colfix);
		
		for (i=rowfix; i < rows; i++)
		{
			d = "root";
			dval = (Number(data[i][colfix].code) || 0);
			
			for (j=0; j < colfix; j++)
			{
				tval = data[i][j].text;
				pd = d;
				d += "." + tval;
				
				if (keymap[j] && keymap[j].dname == d)
				{
					continue;
				}
				else if (j > 0 && keymap[j-1] && keymap[j-1].dname == pd)
				{
					parentNode = keymap[j-1];
				}
				else
				{
					parentNode = base;
				}
				
				dl = {
					dname: d,
					name: tval,
					children: []
				};
				
				if (j == colfix -1)
				{
					dl.value = dval;
				}
				
				parentNode.children.push(dl);
				keymap[j] = dl;
			}
		}
		
		if (!me.customchart)
		{
			me.customchart = echarts.init(me.container[0], cop.echart_theme || ig$.echarts_theme || 'amplix', {
				renderer: "canvas"
			});
		}
			
		me.initChart(seriesData);
	}
};

IG$.__chartoption.chartext.treehierarchy.prototype.updatedisplay = function(owner, w, h) {
	var me = this,
		customchart = me.customchart;
	
	if (customchart)
	{
		customchart.resize({width: w, height: h});
	}
}

IG$.__chartoption.chartext.treehierarchy.prototype.dispose = function() {
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