IG$.__chartoption.chartext.bubblecloud.prototype.drawBubbleCloud = function() {
	var me = this,
		owner = me.owner,
		results = me.results,
		container = $(owner.container),
		sop = owner._ILb,
		cop = owner.cop,
		i, j,
		rdata = results._tabledata,
		jcontainer,
		fdata = [],
		colfix = results.colfix,
		cols = results.cols,
		rec, d, t,
		width,
		height;
	
	container.empty();
	jcontainer = $("<div class='igc-tg-gr'></div>").appendTo(container);
	
	width = container.width();
	height = container.height();
	jcontainer.width(width);
	jcontainer.height(height);
	
	for (i=0; i < rdata.length; i++)
	{
		rec = rdata[i];
		d = {groupdata: []};
		for (j=0; j < colfix; j++)
		{
			t = rec[j].text || rec[j].code;
			if (j == colfix - 1)
			{
				d.name = t;
			}
			else
			{
				d.groupdata.push(t);
			}
		}
		d.title = d.groupdata.join("/") + d.name;
		d.group = d.groupdata.join("/");
		if (rec[colfix])
		{
			d.value = Number(rec[colfix].code);
		}
		fdata.push(d);
	}
	
	var pack = function(data) {
  		return d3.pack()
			.size([width - 2, height - 2])
			.padding(3)(d3.hierarchy({
				children: data
			})
			.sum(function (d) {
				return d.value;
  			}));
	};
	
	var root = pack(fdata);
	
	var format = d3.format(",d");
	var color = d3.scaleOrdinal(fdata.map(function (d) {
  		return d.group;
	}), d3.schemeCategory10);
	
	var svg = d3.select(jcontainer[0]).append("svg:svg") 
		.attr("viewBox", [0, 0, width, height])
		.attr("font-size", 10)
		.attr("font-family", "sans-serif")
		.attr("text-anchor", "middle");
		
	var leaf = svg
		.selectAll("g")
		.data(root.leaves())
		.join("g")
		.attr("transform", function (d) {
  			return "translate(".concat(d.x + 1, ",").concat(d.y + 1, ")");
		});
	leaf.append("circle")
		/*
		.attr("id", function (d) {
  			return (d.leafUid = DOM.uid("leaf")).id;
		})
		*/
		.attr("r", function (d) {
			return d.r;
		})
		.attr("fill-opacity", 0.7)
		.attr("fill", function (d) {
  			return color(d.data.group);
		});
	
	leaf.append("clipPath")
		/*
		.attr("id", function (d) {
  			return (d.clipUid = DOM.uid("clip")).id;
		})
		.append("use").attr("xlink:href", function (d) {
  			return d.leafUid.href;
		});
		*/
	
	leaf.append("text")
		.attr("clip-path", function (d) {
  			return d.clipUid;
		})
		.selectAll("tspan")
		.data(function (d) {
			return d.data.name.split(/(?=[A-Z][a-z])|\s+/g);
		})
		.join("tspan")
		.attr("x", 0)
		.attr("y", function (d, i, nodes) {
			return "".concat(i - nodes.length / 2 + 0.8, "em");
		})
		.text(function (d) {
			return d;
		});
	leaf.append("title")
		.text(function (d) {
  			return "".concat(d.data.title === undefined ? "" : "".concat(d.data.title, "\n")).concat(format(d.value));
		});
}

IG$.__chartoption.chartext.bubblecloud.prototype.drawChart = function(owner, results) {
	var me = this;
	me.owner = owner;
	me.results = results;
	
	me.drawBubbleCloud();
};
	
IG$.__chartoption.chartext.bubblecloud.prototype.updatedisplay = function(owner, w, h) {
	var me = this;
	
	if (me.owner && me.results)
	{
		me.drawBubbleCloud();
	}
};

IG$.__chartoption.chartext.bubblecloud.prototype.destroy = function(owner, w, h) {
	var me = this,
		owner = me.owner;
		
	if (owner && owner.container)
	{
		$(owner.container).empty();
	}
};