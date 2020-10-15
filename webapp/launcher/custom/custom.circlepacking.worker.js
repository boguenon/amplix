IG$.__chartoption.chartext.circlepacking.prototype.drawCirclePacking = function() {
	var me = this,
		owner = me.owner,
		results = me.results,
		tabledata = results._tabledata,
		container = $(owner.container),
		sop = owner._ILb,
		cop = owner.cop,
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
	
	var color = d3.scaleLinear()
		.domain([0, 5])
		.range(["hsl(152,80%,80%)", "hsl(228,30%,40%)"])
		.interpolate(d3.interpolateHcl);
		
	var format = d3.format(",d");
	
	function pack(data) {
		return d3.pack().
			size([width, height])
			.padding(3)(d3.hierarchy(data).sum(function (d) {
				return d.value;
			}).sort(function (a, b) {
				return b.value - a.value;
			}));
	};
	
	function zoom(d) {
		var focus0 = focus;
		focus = d;
		var transition = svg.transition().duration(d3.event.altKey ? 7500 : 750).tween("zoom", function (d) {
			var i = d3.interpolateZoom(view, [focus.x, focus.y, focus.r * 2]);
			return function (t) {
				return zoomTo(i(t));
			};
		});
		label.filter(function (d) {
			return d.parent === focus || this.style.display === "inline";
		}).transition(transition).style("fill-opacity", function (d) {
			return d.parent === focus ? 1 : 0;
		}).on("start", function (d) {
			if (d.parent === focus) this.style.display = "inline";
		}).on("end", function (d) {
			if (d.parent !== focus) this.style.display = "none";
		});
	}
	
	function zoomTo(v) {
		var k = width / v[2];
		view = v;
		label.attr("transform", function (d) {
			return "translate(".concat((d.x - v[0]) * k, ",").concat((d.y - v[1]) * k, ")");
		});
		node.attr("transform", function (d) {
			return "translate(".concat((d.x - v[0]) * k, ",").concat((d.y - v[1]) * k, ")");
		});
		node.attr("r", function (d) {
			return d.r * k;
		});
	}

	var root = pack(data);
	var focus = root;
	var view;
	var svg = d3.select(jcontainer[0]).append("svg:svg")
		.attr("viewBox", "-".concat(width / 2, " -").concat(height / 2, " ").concat(width, " ").concat(height))
		.style("display", "block")
		.style("margin", "0 -14px")
		.style("background", color(0))
		.style("cursor", "pointer")
		.on("click", function () {
			return zoom(root);
		});
		
	var node = svg.append("g")
		.selectAll("circle")
		.data(root.descendants().slice(1))
		.join("circle")
		.attr("fill", function (d) {
			return d.children ? color(d.depth) : "white";
		})
		.attr("pointer-events", function (d) {
			return !d.children ? "none" : null;
		})
		.on("mouseover", function () {
			d3.select(this).attr("stroke", "#000");
		})
		.on("mouseout", function () {
			d3.select(this).attr("stroke", null);
		})
		.on("click", function (d) {
			return focus !== d && (zoom(d), d3.event.stopPropagation());
		});
		
	var label = svg.append("g")
		.style("font", "10px sans-serif")
		.attr("pointer-events", "none")
		.attr("text-anchor", "middle")
		.selectAll("text")
		.data(root.descendants())
		.join("text")
		.style("fill-opacity", function (d) {
			return d.parent === root ? 1 : 0;
		})
		.style("display", function (d) {
			return d.parent === root ? "inline" : "none";
		}).text(function (d) {
			return d.data.name;
		});
	
	zoomTo([root.x, root.y, root.r * 2]);
}

IG$.__chartoption.chartext.circlepacking.prototype.drawChart = function(owner, results) {
	var me = this;
	me.owner = owner;
	me.results = results;
	
	me.drawCirclePacking();
};
	  
IG$.__chartoption.chartext.circlepacking.prototype.updatedisplay = function(owner, w, h) {
	var me = this;
	
	if (me.owner && me.results)
	{
		me.drawCirclePacking();
	}
};

IG$.__chartoption.chartext.circlepacking.prototype.destroy = function(owner, w, h) {
	var me = this,
		owner = me.owner;
		
	if (owner && owner.container)
	{
		$(owner.container).empty();
	}
};