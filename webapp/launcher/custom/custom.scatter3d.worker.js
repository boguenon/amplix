IG$.__chartoption.charttype = IG$.__chartoption.charttype || [];


IG$.cVis.scatter3d.prototype.draw = function(results) {
	var me = this,
		chartview = me.chartview,
		container = $(chartview.container),
		cop = chartview.cop;
	
	me.container = container;
	
	me.container.empty();
		
	if (results)
	{
		var colfix,
			rowfix,
			rows,
			cols,
			i, j,
			hoption,
			xaxis = [],
			yaxis = [],
			chartdata = [],
            dimensions = [],
			data = results._tabledata,
			tval,
			mval,
			cop = chartview.cop;
		
		cols = results.colcnt;
		rows = data.length;
		colfix = results.colfix;
		rowfix = results.rowfix;
		
		
		
		var c_cset = cop.colorset,
			colorlist;

		if (IG$.__chartoption && IG$.__chartoption.chartcolors && IG$.__chartoption.chartcolors[c_cset])
		{
			colorlist =  IG$.__chartoption.chartcolors[c_cset];
		}

		hoption = {
            grid3D: {},
			chart: {
				type: 'scatter3d',
				marginTop: 40,
				marginBottom: 80,
				plotBorderWidth: 1,
				renderTo: me.container[0]
			},
			
			xAxis3D: {
				type: "category"
			},
			
			yAxis3D: {
                type: "value"
            },
            zAxis3D: {
                type: "value"
            },

            dataset: {
                dimensions: dimensions,
                source: chartdata
            },
			
			// colorAxis: {
			// 	min: 0,
			// 	minColor: '#FFFFFF',
			// 	maxColor: colorlist && colorlist.length ? colorlist[0] : null // Highcharts.getOptions().colors[0]
			// },
			
			// legend: {
			// 	align: 'right',
			// 	layout: 'vertical',
			// 	margin: 0,
			// 	verticalAlign: 'top',
			// 	y: 25,
			// 	symbolHeight: 280
			// },
			
			// tooltip: {
			// 	formatter: function () {
			// 		return '<b>' + this.series.xAxis.categories[this.point.x] + '</b>  <br><b>' +
			// 			this.point.value + '</b> items on <br><b>' + this.series.yAxis.categories[this.point.y] + '</b>';
			// 	}
			// },
			
			series: [
				{
                    type: "scatter3D",
                    symbolSize: 2.5,
					encode: {
                        x: null,
                        y: null,
                        z: null,
                        tooltip: [0, 1, 2]
                    }
				}
			]
		};

        for (i=0; i < colfix; i++)
        {
            tval = "";
            for (j=0; j < rowfix; j++)
		    {
				tval = (j == 0) ? data[j][i].text : tval + " " + data[j][i].text;
			}

            xaxis.push(tval);
		}
		
		for (i=colfix; i < cols; i++)
		{
            tval = "";

			for (j=0; j < rowfix; j++)
			{
				tval = (j == 0) ? data[j][i].text : tval + " " + data[j][i].text;
			}
			
			yaxis.push(tval);
		}

        var header = [];
        header.push(xaxis.join(" "));
        hoption.series[0].encode.x = xaxis.join(" ");
        dimensions.push(xaxis.join(" "));

        for (i=0; i < yaxis.length; i++)
        {
            header.push(yaxis[i]);

            if (i == 0)
            {
                hoption.series[0].encode.y = yaxis[i];
            }
            else if (i == 1)
            {
                hoption.series[0].encode.z = yaxis[i];
            }

            dimensions.push(yaxis[i]);
        }

        chartdata.push(header)
		
		for (i=rowfix; i < rows; i++)
		{
            mval = [];

            var mxvalue = "";

			for (j=0; j < colfix; j++)
			{
                mxvalue = (j == 0) ? data[i][j].text : mxvalue + " " + data[i][j].text;
			}

            mval.push(mxvalue);

            for (j=colfix; j < cols; j++)
            {
                mxvalue = Number(data[i][j].code);
                if (isNaN(mxvalue))
                    mxvalue = 0;
                mval.push(mxvalue);
            }

            chartdata.push(mval);
		}
		
		if (cop.showtitle)
		{
			hoption.title = {
				text: cop.title || ""
			};
		}
		else
		{
			hoption.title = {
				text: ""
			};
		}
		
		if (window.echarts)
		{
			hoption.series[0].type = "scatter3D";
			me.customchart = echarts.init(hoption.chart.renderTo, cop.echart_theme || ig$.echarts_theme || 'amplix', {
				renderer: "svg"
			});

			me.customchart.setOption(hoption);
		}
		// else
		// {
		// 	me.customchart = new Highcharts.Chart(hoption);
		// }
	}
};

IG$.cVis.scatter3d.prototype.updatedisplay = function(w, h) {
	// this.map.m1.call(this.map);
	var me = this,
		i,
		px = 0, py = 0, pw, ph = h;
}
