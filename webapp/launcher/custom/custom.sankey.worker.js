IG$.__chartoption.chartext.sankey.prototype.buildNode = function(results, snode) {
	var colfix = results.colfix,
		rowfix = results.rowfix,
		data = results._tabledata,
		i, j,
		smap,
		c,
		n = 0,
		bc,
		lmap = {},
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
				sm.value += Number(c);
			}
			else
			{
				sm = {
					source: s,
					target: t,
					value: Number(c)
				};
			
				snode.links.push(sm);
				lmap[k] = sm;
			}
		}
	}
}

IG$.__chartoption.chartext.sankey.prototype.drawChart = function(owner, results) {
	var me = this;
	
	if (me._draw_timer)
	{
		clearTimeout(me._draw_timer);
		me._draw_timer = -1;
	}
	
	me._draw_timer = setTimeout(function() {
		me.drawChartTimer(owner, results);
	}, 10);
}

IG$.__chartoption.chartext.sankey.prototype.drawChartTimer = function(owner, results) {
			
	var dragmove = function(d) {
		d3.select(this).attr("transform", "translate(" + d.x + "," + (d.y = Math.max(0, Math.min(height - d.dy, d3.event.y))) + ")");
		sankey.relayout();
		link.attr("d", path);
	}
	
	var me = this,
		container = owner.container,
		jcontainer = $(container);
		
	jcontainer.empty();
	jcontainer.addClass("igc-sankey");
	
	var width = jcontainer.width(),
		height = jcontainer.height();
	
	var formatNumber = d3.format(",.0f"),
		format = function(d) { return formatNumber(d); },
		// color = d3.scale.category20();
		color = d3.scaleOrdinal(d3.schemeCategory10);
	
	var svg = me.pdev = d3.select(jcontainer[0]).append("svg")
		.attr("width", width)
		.attr("height", height)
		.append("g");
//			.attr("transform", "translate(" + margin.left + "," + margin.top + ")");
	
	var sankey = d3.sankey()
		.nodeWidth(15)
		.nodePadding(10)
		.size([width, height]);
		
	var path = sankey.link(),
		snode = {
			nodes: [],
			links: []
		};
	
	me._results = results;
	me._owner = owner;
	
	if (results.colfix < 2)
		return;
		
	me.buildNode(results, snode);
	
	sankey
		.nodes(snode.nodes)
		.links(snode.links)
		.layout(32);
	
	var link = svg.append("g").selectAll(".link")
		.data(snode.links)
		.enter().append("path")
		.attr("class", "link")
		.attr("d", path)
		.style("stroke-width", function(d) { return Math.max(1, d.dy); })
		.sort(function(a, b) { return b.dy - a.dy; });
	
	link.append("title")
		.text(function(d) { return d.source.name + " �� " + d.target.name + "\n" + format(d.value); });
	
	var node = svg.append("g").selectAll(".node")
		.data(snode.nodes)
		.enter().append("g")
		.attr("class", "node")
		.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; })
		// .call(d3.behavior.drag()
		.call(d3.drag()
		// .origin(function(d) { return d; })
		// .on("dragstart", function() { this.parentNode.appendChild(this); })
		// .on("drag", dragmove));
		.on("start", function() { this.parentNode.appendChild(this); })
		.on("drag", dragmove));
	
	node.append("rect")
		.attr("height", function(d) { return d.dy; })
		.attr("width", sankey.nodeWidth())
		.style("fill", function(d) { return d.color = color(d.name.replace(/ .*/, "")); })
		.style("stroke", function(d) { return d3.rgb(d.color).darker(2); })
		.append("title")
		.text(function(d) { return d.name + "\n" + format(d.value); });
	
	node.append("text")
		.attr("x", -6)
		.attr("y", function(d) { return d.dy / 2; })
		.attr("dy", ".35em")
		.attr("text-anchor", "end")
		.attr("transform", null)
		.text(function(d) { return d.name; })
		.filter(function(d) { return d.x < width / 2; })
		.attr("x", 6 + sankey.nodeWidth())
		.attr("text-anchor", "start");
}

IG$.__chartoption.chartext.sankey.prototype.destroy = function() {
	var me = this,
		owner = me.owner;
		
	if (owner && owner.container)
	{
		$(me.owner.container).empty();
	}
	me.vis = null;
}