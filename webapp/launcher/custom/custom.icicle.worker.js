IG$.__chartoption.chartext.icicle.prototype.drawIcicle = function() {
	var me = this,
		owner = me.owner,
		results = me.results,
		container = $(owner.container),
		sop = owner._ILb,
		cop = owner.cop,
		i, j,
		tabledata = results._tabledata,
		jcontainer,
		colfix = results.colfix,
		rowfix = results.rowfix,
		cols = results.cols,
		rec, d, t,
		width,
		height, vmin, vmax, fmin = 10, fmax = 90, fratio,
		data = {
			name: "root",
			$map : {},
			children: []
		};
	
	container.empty();
	jcontainer = $("<div class='igc-tg-gr'></div>").appendTo(container);
	
	width = container.width();
	height = container.height();
	jcontainer.width(width);
	jcontainer.height(height);
	
	var tparent = {},
		tval;
	
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
		
	var partition = function partition(data) {
  		var root = d3.hierarchy(data).sum(function (d) {
			return d.value;
  		})
		.sort(function (a, b) {
			return b.height - a.height || b.value - a.value;
  		});
  		
		return d3.partition().size([height, (root.height + 1) * width / 3])(root);
	};
	
	var color = d3.scaleOrdinal(d3.quantize(d3.interpolateRainbow, data.children.length + 1));
	
	var format = d3.format(",d");
	
	var root = partition(data);
	var focus = root;
	
	var svg = d3.select(jcontainer[0])
		.append("svg:svg")
		.attr("viewBox", [0, 0, width, height])
		.style("font", "10px sans-serif");
	
	var cell = svg.selectAll("g")
		.data(root.descendants())
		.join("g")
		.attr("transform", function (d) {
  			return "translate(".concat(d.y0, ",").concat(d.x0, ")");
		});
		
	function rectHeight(d) {
		return d.x1 - d.x0 - Math.min(1, (d.x1 - d.x0) / 2);
	}
	
	function labelVisible(d) {
		return d.y1 <= width && d.y0 >= 0 && d.x1 - d.x0 > 16;
	}
		
	function clicked(p) {
		focus = focus === p ? p = p.parent : p;
		root.each(function (d) {
			return d.target = {
				x0: (d.x0 - p.x0) / (p.x1 - p.x0) * height,
		  		x1: (d.x1 - p.x0) / (p.x1 - p.x0) * height,
		  		y0: d.y0 - p.y0,
		  		y1: d.y1 - p.y0
			};
	  	});
	  
		var t = cell.transition()
			.duration(750)
			.attr("transform", function (d) {
				return "translate(".concat(d.target.y0, ",").concat(d.target.x0, ")");
		  	});
		
		rect.transition(t)
			.attr("height", function (d) {
				return rectHeight(d.target);
		  	});
		
		text.transition(t).attr("fill-opacity", function (d) {
			return +labelVisible(d.target);
		});
		
		tspan.transition(t).attr("fill-opacity", function (d) {
			return labelVisible(d.target) * 0.7;
		});
	}
		
	var rect = cell.append("rect")
		.attr("width", function (d) {
	  		return d.y1 - d.y0 - 1;
		}).attr("height", function (d) {
	  		return rectHeight(d);
		}).attr("fill-opacity", 0.6).attr("fill", function (d) {
	  		if (!d.depth) return "#ccc";
	
	  		while (d.depth > 1) {
				d = d.parent;
	  		}
	
	  		return color(d.data.name);
		})
		.style("cursor", "pointer")
		.on("click", clicked);
	
	var text = cell.append("text")
		.style("user-select", "none")
		.attr("pointer-events", "none")
		.attr("x", 4).attr("y", 13)
		.attr("fill-opacity", function (d) {
  			return +labelVisible(d);
		});
	
	text.append("tspan")
		.text(function (d) {
  			return d.data.name;
		});
	
	var tspan = text.append("tspan")
		.attr("fill-opacity", function (d) {
	  		return labelVisible(d) * 0.7;
		}).text(function (d) {
	  		return " ".concat(format(d.value));
		});
		
	cell.append("title")
		.text(function (d) {
  		return "".concat(d.ancestors().map(function (d) {
			return d.data.name;
  		})
		.reverse()
		.join("/"), "\n")
		.concat(format(d.value));
	});
}

IG$.__chartoption.chartext.icicle.prototype.drawChart = function(owner, results) {
	var me = this;
	me.owner = owner;
	me.results = results;
	
	me.drawIcicle();
}

IG$.__chartoption.chartext.icicle.prototype.updatedisplay = function(owner, w, h) {
	var me = this;
	
	if (me.results)
	{
		me.drawIcicle();
	}
}

IG$.__chartoption.chartext.icicle.prototype.destroy = function() {
	var me = this,
		owner = me.owner;
		
	if (owner && owner.container)
	{
		$(me.owner.container).empty();
	}
	me.vis = null;
}