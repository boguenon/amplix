IG$.__chartoption.chartext.barrace.prototype.drawBarChartRace = function() {
	var me = this,
		owner = me.owner,
		results = me.results,
		container = $(owner.container),
		sop = owner._ILb,
		cop = owner.cop,
		i, j,
		rdata = results._tabledata,
		jcontainer,
		data = [],
		colfix = results.colfix,
		rowfix = results.rowfix,
		cols = results.cols,
		rec, d, t,
		width,
		height, vmin, vmax, fmin = 10, fmax = 90, fratio;
	
	container.empty();
	jcontainer = $("<div class='igc-tg-gr'></div>").appendTo(container);
	
	width = container.width();
	height = container.height();
	jcontainer.width(width);
	jcontainer.height(height);
	
	for (i=rowfix; i < rdata.length; i++)
	{
		rec = rdata[i];
		d = {};
		d.name = rec[colfix-1].text || rec[colfix-1].code; 
		d.date = rec[0].text || rec[0].code;
		
		if (colfix > 2)
		{
			d.category = rec[1].text || rec[1].code;
		}
		else
		{
			d.category = "";
		}
		
		if (rec[colfix])
		{
			t = rec[colfix].code;
			if (!t)
				continue;
			d.value = Number(t);
			
			if (isNaN(d.value))
				continue;
		}
		data.push(d);
	}
	
	var duration = 250,
		barSize = 48,
		margin = ({top: 16, right: 6, bottom: 6, left: 0}),
		n = 12,
		k = 10;
	
	var names = new Set(data.map(function (d) {
	  		return d.name;
		}));
	
	function rank(value) {
		var data = Array.from(names, function (name) {
			return {
				name: name,
				value: value(name)
			};
		});
		data.sort(function (a, b) {
			return d3.descending(a.value, b.value);
		});
	
		for (var i = 0; i < data.length; ++i) {
			data[i].rank = Math.min(n, i);
		}
	
		return data;
	}
	
	function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

	function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
	
	function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }
	
	function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }
	
	function _createForOfIteratorHelper(o, allowArrayLike) { var it; if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e2) { throw _e2; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e3) { didErr = true; err = _e3; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }
	
	function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
	
	function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }
	
	function calc_keyframes(datevalues) {
		var keyframes = [];
		var ka, a, kb, b;
	
		var _iterator = _createForOfIteratorHelper(d3.pairs(datevalues)),
				_step;
	
		try {
			for (_iterator.s(); !(_step = _iterator.n()).done;) {
				var _step$value = _slicedToArray(_step.value, 2);
	
				var _step$value$ = _slicedToArray(_step$value[0], 2);
	
				ka = _step$value$[0];
				a = _step$value$[1];
	
				var _step$value$2 = _slicedToArray(_step$value[1], 2);
	
				kb = _step$value$2[0];
				b = _step$value$2[1];
	
				var _loop = function _loop(i) {
					var t = i / k;
					// keyframes.push([new Date(ka * (1 - t) + kb * t), rank(function (name) {
					keyframes.push([kb, rank(function (name) {
						return (a.get(name) || 0) * (1 - t) + (b.get(name) || 0) * t;
					})]);
				};
	
				for (var i = 0; i < k; ++i) {
					_loop(i);
				}
			}
		} catch (err) {
			_iterator.e(err);
		} finally {
			_iterator.f();
		}
	
		keyframes.push([kb, rank(function (name) {
			return b.get(name) || 0;
		})]);
		
		return keyframes;
	};
	
	var datevalues = Array.from(d3.rollup(data, function (_ref) {
		 	var _ref2 = _slicedToArray(_ref, 1),
					d = _ref2[0];
		
			return d.value;
		}, function (d) {
			return d.date;
		}, function (d) {
			return d.name;
		})).map(function (_ref3) {
			var _ref4 = _slicedToArray(_ref3, 2),
					date = _ref4[0],
					data = _ref4[1];
		
			return [date, data];
		}).sort(function (_ref5, _ref6) {
			var _ref7 = _slicedToArray(_ref5, 1),
					a = _ref7[0];
		
			var _ref8 = _slicedToArray(_ref6, 1),
					b = _ref8[0];
		
			return d3.ascending(a, b);
		});
	
	var keyframes = calc_keyframes(datevalues);
	
	var nameframes = d3.groups(keyframes.flatMap(function (_ref) {
			var _ref2 = _slicedToArray(_ref, 2),
					data = _ref2[1];
		
			return data;
		}), function (d) {
			return d.name;
		});
	
	var prev = new Map(nameframes.flatMap(function (_ref) {
		var _ref2 = _slicedToArray(_ref, 2),
				data = _ref2[1];
	
		return d3.pairs(data, function (a, b) {
			return [b, a];
		});
	}));
	
	var next = new Map(nameframes.flatMap(function (_ref) {
			var _ref2 = _slicedToArray(_ref, 2),
					data = _ref2[1];
		
			return d3.pairs(data);
		}));
	
	function bars(svg) {
		var bar = svg.append("g")
			.attr("fill-opacity", 0.6)
			.selectAll("rect");
			
		return function (_ref, transition) {
			var _ref2 = _slicedToArray(_ref, 2),
					date = _ref2[0],
					data = _ref2[1];
	
			return bar = bar
				.data(data.slice(0, n), function (d) {
					return d.name;
				}).join(function (enter) {
					return enter
						.append("rect")
						.attr("fill", color)
						.attr("height", y.bandwidth())
						.attr("x", x(0))
						.attr("y", function (d) {
							return y((prev.get(d) || d).rank);
						})
						.attr("width", function (d) {
							return x((prev.get(d) || d).value) - x(0);
						});
					}, function (update) {
						return update;
					}, function (exit) {
						return exit.transition(transition)
							.remove()
							.attr("y", function (d) {
								return y((next.get(d) || d).rank);
							})
							.attr("width", function (d) {
								return x((next.get(d) || d).value) - x(0);
							});
						})
						.call(function (bar) {
							return bar.transition(transition)
								.attr("y", function (d) {
									return y(d.rank);
								})
								.attr("width", function (d) {
									return x(d.value) - x(0);
								});
				});
		};
	}
	
	function labels(svg) {
		var label = svg.append("g")
			.style("font", "bold 12px var(--sans-serif)")
			.style("font-variant-numeric", "tabular-nums")
			.attr("text-anchor", "end")
			.selectAll("text");
			
		return function (_ref, transition) {
			var _ref2 = _slicedToArray(_ref, 2),
					date = _ref2[0],
					data = _ref2[1];
	
			return label = label.data(data.slice(0, n), function (d) {
					return d.name;
				})
				.join(function (enter) {
					return enter.append("text")
						.attr("transform", function (d) {
							return "translate(".concat(x((prev.get(d) || d).value), ",").concat(y((prev.get(d) || d).rank), ")");
						})
						.attr("y", y.bandwidth() / 2)
						.attr("x", -6)
						.attr("dy", "-0.25em")
						.text(function (d) {
							return d.name;
						})
						.call(function (text) {
							return text.append("tspan").attr("fill-opacity", 0.7).attr("font-weight", "normal").attr("x", -6).attr("dy", "1.15em");
						});
					}, function (update) {
						return update;
					}, function (exit) {
						return exit.transition(transition)
							.remove()
							.attr("transform", function (d) {
								return "translate(".concat(x((next.get(d) || d).value), ",").concat(y((next.get(d) || d).rank), ")");
							}).call(function (g) {
								return g.select("tspan").tween("text", function (d) {
									return textTween(d.value, (next.get(d) || d).value);
							});
						});
					}).call(function (bar) {
						return bar.transition(transition)
							.attr("transform", function (d) {
								return "translate(".concat(x(d.value), ",").concat(y(d.rank), ")");
							})
							.call(function (g) {
								return g.select("tspan")
									.tween("text", function (d) {
										return textTween((prev.get(d) || d).value, d.value);
									});
								});
					});
		};
	}
	
	function textTween(a, b) {
		var i = d3.interpolateNumber(a, b);
		return function (t) {
			this.textContent = formatNumber(i(t));
		};
	}
	
	formatNumber = d3.format(",d");
	
	function axis(svg) {
		var g = svg.append("g").attr("transform", "translate(0,".concat(margin.top, ")"));
		var axis = d3.axisTop(x).ticks(width / 160).tickSizeOuter(0).tickSizeInner(-barSize * (n + y.padding()));
		return function (_, transition) {
			g.transition(transition).call(axis);
			g.select(".tick:first-of-type text").remove();
			g.selectAll(".tick:not(:first-of-type) line").attr("stroke", "white");
			g.select(".domain").remove();
		};
	}
	
	function ticker(svg) {
		var now = svg.append("text")
		.style("font", "bold ".concat(barSize, "px var(--sans-serif)"))
		.style("font-variant-numeric", "tabular-nums")
		.attr("text-anchor", "end")
		.attr("x", width - 6)
		.attr("y", margin.top + barSize * (n - 0.45))
		.attr("dy", "0.32em")
		.text(keyframes[0][0]);
		
		return function (_ref, transition) {
			var _ref2 = _slicedToArray(_ref, 1),
					date = _ref2[0];
	
			transition.end().then(function () {
				return now.text(date);
			});
		};
	}
	
	var scale = d3.scaleOrdinal(d3.schemeTableau10);

	var color;
	
	if (data.some(function (d) {
		color =  d.category !== undefined;
	})) {
		var categoryByName = new Map(data.map(function (d) {
			return [d.name, d.category];
		}));
		scale.domain(Array.from(categoryByName.values()));
		color = function (d) {
			return scale(categoryByName.get(d.name));
		};
	}
	color =  function(d) {
		return scale(d.name);
	};
	
	x = d3.scaleLinear([0, 1], [margin.left, width - margin.right]);
	y = d3.scaleBand().domain(d3.range(n + 1)).rangeRound([margin.top, margin.top + barSize * (n + 1 + 0.1)]).padding(0.1);

	// replay;
	
	var svg = d3.select(jcontainer[0]).append("svg:svg")
		.attr("viewBox", [0, 0, width, height]);
		
	var updateBars = bars(svg);
	var updateAxis = axis(svg);
	var updateLabels = labels(svg);
	var updateTicker = ticker(svg);
	
	var _iterator = _createForOfIteratorHelper(keyframes),
			_step;
	
	try {
		_iterator.s();
		
		var c_step_name;
		
		function _do_update(_step) {
			var keyframe = _step.value;
			var transition = svg.transition()
				.duration(duration)
				.ease(d3.easeLinear); // Extract the top bar’s value.
	
			x.domain([0, keyframe[1][0].value]);
			updateAxis(keyframe, transition);
			updateBars(keyframe, transition);
			updateLabels(keyframe, transition);
			updateTicker(keyframe, transition);
			
			transition.on("end", function() {
				if (!(_step = _iterator.n()).done)
				{
					if (!c_step_name || (c_step_name && c_step_name == _step.value[0]))
					{
						c_step_name = _step.value[0];
						_do_update(_step);
					}
					else
					{
						c_step_name = _step.value[0];
						
						setTimeout(function() {
							_do_update(_step);
						}, 1000);
					}
				}
			});
		}
		
		if (!(_step = _iterator.n()).done)
		{
			_do_update(_step);
		}

	} catch (err) {
		_iterator.e(err);
	} finally {
		_iterator.f();
	}
	
}

IG$.__chartoption.chartext.barrace.prototype.drawChart = function(owner, results) {
	var me = this;
	me.owner = owner;
	me.results = results;
	
	me.drawBarChartRace();
};
	  
IG$.__chartoption.chartext.barrace.prototype.updatedisplay = function(owner, w, h) {
	var me = this;
	
	if (me.owner && me.results)
	{
		me.drawBarChartRace();
	}
};

IG$.__chartoption.chartext.barrace.prototype.destroy = function(owner, w, h) {
    var me = this,
		owner = me.owner;
		
	if (owner && owner.container)
	{
		$(owner.container).empty();
	}
};