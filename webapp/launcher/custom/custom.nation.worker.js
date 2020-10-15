IG$.__chartoption.chartext.nation.prototype.drawNationChart = function() {
	var me = this,
		owner = me.owner,
		results = me.results,
		container = $(owner.container),
		sop = owner.sheetoption,
		cop = owner.cop,
		i, j,
		rdata = results._tabledata,
		jcontainer,
		fdata = [],
		colfix = results.colfix,
		rowfix = results.rowfix,
		cols = results.cols,
		rec, d, t,
		width,
		tplay,
		height, vmin, vmax, fmin = 10, fmax = 90, fratio;
	
	container.empty();
	tplay = $("<div class='igc-tg-play'></div>").appendTo(container);
	jcontainer = $("<div class='igc-tg-gr' style='width:100%;height:100%;'></div>").appendTo(container);
	
	width = container.width();
	height = container.height() - 30;
	jcontainer.width(width);
	jcontainer.height(height);
	
	function _templateObject(mx, val) {
	  var data = _taggedTemplateLiteral([
		"<form style=\"font: 12px var(--sans-serif); font-variant-numeric: tabular-nums; display: flex; height: 33px; align-items: center;\">\n  <button name=b type=button style=\"margin-right: 0.4em; width: 5em;\"></button>\n  <label style=\"display: flex; align-items: center;\">\n	<input name=i type=range min=0 max=",
		mx, 
		" value=", 
		val,
		" step=1 style=\"width: 180px;\">\n	<output name=o style=\"margin-left: 0.4em;\"></output>\n  </label>\n</form>"]);
	
	  _templateObject = function _templateObject() {
		return data;
	  };
	
	  return data.join("");
	}
	
	function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }
	
	function Scrubber(values) {
	  var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
		  _ref$format = _ref.format,
		  format = _ref$format === void 0 ? function (value) {
		return value;
	  } : _ref$format,
		  _ref$initial = _ref.initial,
		  initial = _ref$initial === void 0 ? 0 : _ref$initial,
		  _ref$delay = _ref.delay,
		  delay = _ref$delay === void 0 ? null : _ref$delay,
		  _ref$autoplay = _ref.autoplay,
		  autoplay = _ref$autoplay === void 0 ? true : _ref$autoplay,
		  _ref$loop = _ref.loop,
		  loop = _ref$loop === void 0 ? true : _ref$loop,
		  _ref$loopDelay = _ref.loopDelay,
		  loopDelay = _ref$loopDelay === void 0 ? null : _ref$loopDelay,
		  _ref$alternate = _ref.alternate,
		  alternate = _ref$alternate === void 0 ? false : _ref$alternate;
	
	  values = Array.from(values);
	  var form =
		d3.select(tplay[0])
			.append("div");
			
	  form.html(_templateObject(values.length - 1, initial));

	  form = form._groups[0][0].childNodes[0];

	  var frame = null;
	  var timer = null;
	  var interval = null;
	  var direction = 1;
	
	  function start() {
		form.b.textContent = "Pause";
		if (delay === null) frame = requestAnimationFrame(tick);else interval = setInterval(tick, delay);
	  }
	
	  function stop() {
		form.b.textContent = "Play";
		if (frame !== null) cancelAnimationFrame(frame), frame = null;
		if (timer !== null) clearTimeout(timer), timer = null;
		if (interval !== null) clearInterval(interval), interval = null;
	  }
	
	  function running() {
		return frame !== null || timer !== null || interval !== null;
	  }
	
	  function tick() {
		if (form.i.valueAsNumber === (direction > 0 ? values.length - 1 : direction < 0 ? 0 : NaN)) {
		  if (!loop) return stop();
		  if (alternate) direction = -direction;
	
		  if (loopDelay !== null) {
			if (frame !== null) cancelAnimationFrame(frame), frame = null;
			if (interval !== null) clearInterval(interval), interval = null;
			timer = setTimeout(function () {
			  return step(), start();
			}, loopDelay);
			return;
		  }
		}
	
		if (delay === null) frame = requestAnimationFrame(tick);
		step();
	  }
	
	  function step() {
		form.i.valueAsNumber = (form.i.valueAsNumber + direction + values.length) % values.length;
		form.i.dispatchEvent(new CustomEvent("input", {
		  bubbles: true
		}));
	  }
	
	  form.i.oninput = function (event) {
		if (event && event.isTrusted && running()) stop();
		form.value = values[form.i.valueAsNumber];
		form.o.value = format(form.value, form.i.valueAsNumber, values);
	  };
	
	  form.b.onclick = function () {
		if (running()) return stop();
		direction = alternate && form.i.valueAsNumber === values.length - 1 ? -1 : 1;
		form.i.valueAsNumber = (form.i.valueAsNumber + direction) % values.length;
		form.i.dispatchEvent(new CustomEvent("input", {
		  bubbles: true
		}));
		start();
	  };
	
	  form.i.oninput();
	  if (autoplay) start();else stop();
	  //  disposal(form).then(stop);
	  return form;
	}
	
	var findCols = function(colname, fc) {
		var i,
			sheetoption = sop,
			spcol = -1;
			
		for (i=0; i < sheetoption.model.rows.length; i++)
		{
			if (sheetoption.model.rows[i].name == colname)
			{
				spcol = i;
				break;
			}
		}
		
		if (spcol == -1 && sheetoption.model.measures.length > 0)
		{
			for (i=0; i < sheetoption.model.measures.length; i++)
			{
				if (sheetoption.model.measures[i].name == colname)
				{
					spcol = i + fc;
					break;
				}
			}
		}
		
		return spcol;
	}
	
	var margin = {top: 20, right: 20, bottom: 35, left: 40},
		data = results._tabledata,
		fc = results.colfix,
		fr = results.rowfix,
		tc = (data.length > 0) ? data[0].length : 0,
		dt = [], dtmap = {}, key,
		dobj,
		i, j, 
		ctag = fc - 1,
		ccol = (ctag-1 > -1) ? ctag - 1 : ctag,
		cseg = (ccol-1 > -1) ? ccol - 1 : ccol,
		f1 = fc,
		f2 = (tc > fc+1) ? fc+1 : f1,
		f3 = (tc > f1+1) ? f1+1 : f1,
		dnation,
		segnames = {}, segindex, segname, segcnt=0, stemp,
		seglists = [], fs=[{m:0, M:0},{m:0, M:0},{m:0, M:0}],
		btitle1,
		btitle2,
		ktag,
		kcol,
		tvalue;
		
	stemp = findCols(cop.nat_timefield, fc);
	cseg = (stemp > -1) ? stemp : cseg;
	
	stemp = findCols(cop.nat_datafield, fc);
	ctag = (stemp > -1) ? stemp : ctag;
	
	stemp = findCols(cop.nat_groupfield, fc);
	ccol = (stemp > -1) ? stemp : ccol;
	
	stemp = findCols(cop.nat_xdata, fc);
	f1 = (stemp > -1) ? stemp : f1;
	
	stemp = findCols(cop.nat_ydata, fc);
	f2 = (stemp > -1) ? stemp : f2;
	
	stemp = findCols(cop.nat_vdata, fc);
	f3 = (stemp > -1) ? stemp : f3;
	
	if (fc > 0)
	{
		for (i=fr; i < data.length; i++)
		{
			segname = data[i][cseg].text || data[i][cseg].code || "";
			if (!segnames[segname])
			{
				seglists.push(segname);
				segnames[segname] = 1;
			}
		}
		
		segcnt = seglists.length;
		seglists = seglists.sort();
		segnames = {};
		for (i=0; i < seglists.length; i++)
		{
			segnames[seglists[i]] = i;
		}

		for (i=0; i < fr; i++)
		{
			btitle1 = data[i][f1].text || data[i][f1].code;
			btitle2 = data[i][f2].text || data[i][f2].code;
		}
		
		for (i=fr; i < data.length; i++)
		{
			ktag = data[i][ctag].text || data[i][ctag].code;
			kcol = data[i][ccol].text || data[i][ccol].code;
			
			key = kcol + "_" + ktag;
			
			if (dtmap[key])
			{
				dnation = dtmap[key];
			}
			else
			{
				dnation = {
					name: data[i][ctag].text || data[i][ctag].code,
					region: data[i][ccol].text || data[i][ccol].code,
					bbdata1: [],
					bbdata2: [],
					bbdata3: []
				}
				for (j=0; j < seglists.length; j++)
				{
					dnation.bbdata1.push([j, 0]);
					dnation.bbdata2.push([j, 0]);
					dnation.bbdata3.push([j, 0]);
				}
				dtmap[key] = dnation;
				dt.push(dnation);
			}
			
			segname = data[i][cseg].text || data[i][cseg].code || "";
			segindex = -1;
			if (typeof (segnames[segname]) != "undefined")
			{
				segindex = segnames[segname];
			}
			
			tvalue = Number(data[i][f1].code) || 0;
			tvalue = isNaN(tvalue) ? 0 : tvalue;
			dnation.bbdata1[segindex][1] = tvalue;
			
			fs[0].m = Math.min(tvalue, fs[0].m);
			fs[0].M = Math.max(tvalue, fs[0].M);
			
			tvalue = Number(data[i][f2].code) || 0;
			tvalue = isNaN(tvalue) ? 0 : tvalue;
			dnation.bbdata2[segindex][1] = tvalue;
			
			fs[1].m = Math.min(tvalue, fs[1].m);
			fs[1].M = Math.max(tvalue, fs[1].M);
			
			tvalue = Number(data[i][f3].code) || 0;
			tvalue = isNaN(tvalue) ? 0 : tvalue;
			dnation.bbdata3[segindex][1] = tvalue;
			
			fs[2].m = Math.min(tvalue, fs[2].m);
			fs[2].M = Math.max(tvalue, fs[2].M);
		}
	}
	
	if (fs)
	{
		for (i=0; i < fs.length; i++)
		{
			if (fs[i].m == fs[i].M)
			{
				fs[i].M = fs[i].m + 10;
			}
		}
	}
	me.segnames = segnames;
	me.seglists = seglists;
	me.segmax = segcnt;
	me.fs = fs;
	me.dt = dt;

	var year_scrubber = Scrubber(seglists, {
		// initial: 0,
		autoplay: false,
  		// format: Math.floor,
		delay: 1000,
		format: function(d) {
			return d;	
		},
  		loop: false
	});
	
	var x = d3.scaleLinear([fs[0].m, fs[0].M], [margin.left, width - margin.right]),
		y = d3.scaleLinear([fs[1].m, fs[1].M], [height - margin.bottom, margin.top]),
		radius = d3.scaleSqrt([fs[2].m, fs[2].M], [0, width / 24]),
		color = d3.scaleOrdinal(dt.map(function (d) {
  				return d.region;
			}), d3.schemeCategory10)
			.unknown("black"),
		xAxis,
		yAxis,
		grid;
		
	xAxis = function xAxis(g) {
  		return g.attr("transform", "translate(0,".concat(height - margin.bottom, ")"))
			.call(d3.axisBottom(x)
				.ticks(width / 80)
				// .ticks(width / 80, ",")
			)
			.call(function (g) {
				return g.select(".domain").remove();
  			})
			.call(function (g) {
				return g.append("text")
					.attr("x", width)
					.attr("y", margin.bottom - 4)
					.attr("fill", "currentColor")
					.attr("text-anchor", "end")
					.text(btitle1 + " →");
  			});
	};
	
	yAxis = function yAxis(g) {
		return g.attr("transform", "translate(".concat(margin.left, ",0)"))
			.call(d3.axisLeft(y))
			.call(function (g) {
				return g.select(".domain").remove();
  			})
			.call(function (g) {
				return g.append("text")
					.attr("x", -margin.left)
					.attr("y", 10)
					.attr("fill", "currentColor")
					.attr("text-anchor", "start")
					.text(btitle2 + "↑ ");
  			});
	};
	
	grid = function grid(g) {
  		return g.attr("stroke", "currentColor")
			.attr("stroke-opacity", 0.1)
			.call(function (g) {
				return g.append("g")
					.selectAll("line")
					.data(x.ticks())
					.join("line")
					.attr("x1", function (d) {
	  					return 0.5 + x(d);
					})
					.attr("x2", function (d) {
	  					return 0.5 + x(d);
					})
					.attr("y1", margin.top)
					.attr("y2", height - margin.bottom);
  			})
			.call(function (g) {
				return g.append("g")
					.selectAll("line")
					.data(y.ticks())
					.join("line")
					.attr("y1", function (d) {
	  					return 0.5 + y(d);
					})
					.attr("y2", function (d) {
	  					return 0.5 + y(d);
					})
					.attr("x1", margin.left)
					.attr("x2", width - margin.right);
  		});
	};
	
	function valueAt(values, year) {
		var i = bisectYear(values, year, 0, values.length - 1);
		var a = values[i];

		if (i > 0) {
			var b = values[i - 1];
			var t = (year - a[0]) / (b[0] - a[0]);
			return a[1] * (1 - t) + b[1] * t;
		}

		return a[1];
	}
	
	function dataAt(year) {
		return dt.map(function (d) {
			return {
	  			name: d.name,
	  			region: d.region,
	  			income: d.bbdata1[year][1] || 0,
	  			population: d.bbdata2[year][1] || 0,
	  			lifeExpectancy: d.bbdata3[year][1] || 1
			};
  		});
	}
	
	
	
	function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

	function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

	function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

	function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

	function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

	function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

	var bisectYear = d3.bisector(function (_ref) {
  		var _ref2 = _slicedToArray(_ref, 1),
	  		year = _ref2[0];

  		return year;
	}).left;
	
	var svg = d3.select(jcontainer[0]).append("svg:svg") 
		.attr("viewBox", [0, 0, width, height]);
		
	svg.append("g")
		.call(xAxis);

	svg.append("g")
		.call(yAxis);

	svg.append("g")
		.call(grid);
		
	var mg = svg.append("g");
	
	var circle = mg
		.attr("stroke", "black")
		.selectAll("circle")
		.data(dataAt(0), function (d) {
  			return d.name;
		})
		.join("circle")
		.sort(function (a, b) {
  			return d3.descending(a.population, b.population);
		})
		.attr("cx", function (d) {
  			return x(d.income);
		})
		.attr("cy", function (d) {
  			return y(d.lifeExpectancy);
		})
		.attr("r", function (d) {
  			return radius(d.population) || 1;
		})
		.attr("fill", function (d) {
  			return color(d.region);
		})
		.call(function (circle) {
  			return circle.append("title").text(function (d) {
				return [d.name, d.region].join("\n");
  			});
		});
		
	var ctext = svg.append("g")
		.append("text")
		.selectAll("tspan")
		.data(dataAt(0), function (d) {
  			return d.name;
		})
		.join("tspan")
		.attr("x", function(d) {
			return x(d.income);
		})
		.attr("y", function(d) {
			return y(d.lifeExpectancy);
		})
		.attr("text-anchor", "middle")
		.text(function(d) {
			var r = d.population ? radius(d.population) : 0;
			return r > 5 ? d.name : "";
		})
			
	var update = function(data) {
		circle.data(data, function (d) {
  			return d.name;
		})
		.sort(function (a, b) {
  			return d3.descending(a.population, b.population);
		})
		.attr("cx", function (d) {
  			return x(d.income);
		})
		.attr("cy", function (d) {
  			return y(d.lifeExpectancy);
		})
		.attr("r", function (d) {
  			return radius(d.population);
		});
		
		ctext.data(data, function(d) {
			return d.name;
		})
		.attr("x", function(d) {
			return x(d.income);
		})
		.attr("y", function(d) {
			return y(d.lifeExpectancy);
		})
		.text(function(d) {
			var r = d.population ? radius(d.population) : 0;
			return r > 5 ? d.name : "";
		})
	}
	
	d3.select(year_scrubber).on("input", function() {
		if (year_scrubber.value)
		{
			var n = segnames[year_scrubber.value];
			if (n > -1)
			{
				var currentData = dataAt(n);
				update(currentData);
			}
		}
	});
}

IG$.__chartoption.chartext.nation.prototype.drawChart = function(owner, results) {
	var me = this;

	me.owner = owner;
	me.results = results;
	
	me.drawNationChart();
};
	
IG$.__chartoption.chartext.nation.prototype.updatedisplay = function(owner, w, h) {
	var me = this;
	
	if (me.owner && me.results)
	{
		me.drawNationChart();
	}
};

IG$.__chartoption.chartext.nation.prototype.destroy = function(owner, w, h) {
	var me = this,
		owner = me.owner;
		
	if (owner && owner.container)
	{
		$(owner.container).empty();
	}
};
