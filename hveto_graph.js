function build_srclink(d, chan) {
	var src = "https://ldas-jobs.ligo-la.caltech.edu/~pankow/wdq/L1";
	src += "_" + d.time + "/" + d.time;
	src += "_" + chan + "_1.00_spectrogram_whitened.png";
	return src;
}

function inner_box(d, win_chan, ref_chan) {
	var htmlstr = "GPS Time: " + d.time + "<br/>Freq.: " + d.frequency + "<br/>SNR: " + d.snr; 
	ref_src = build_srclink(d, ref_chan);
	targ_src = build_srclink(d, win_chan);
	htmlstr += "<br/><b>" + ref_chan + ":</b> <br/> <a href='" + ref_src + "' target='_blank'><img src='" + ref_src + "' width='200px' height='120px' /></a> <br/>";
	htmlstr += "<br/><b>" + win_chan + ":</b> <br/> <a href='" + targ_src + "' target='_blank'><img src='" + targ_src + "' width='200px' height='120px' /></a> <br/>";
	return htmlstr;
}

function scatter_plot(data, main, x, y, left_marg, type) {

	var g = main.append("svg:g")
			.attr("class", "scatter-dots-" + type);

	dots = g.selectAll("scatter-dots-" + type)
		.data(data["data"])
		.enter().append("svg:circle")
		.attr("cx", function (d) { return x(d.time); } )
		.attr("cy", function (d) { return y(d.frequency); } )
		.attr("r", 2)
	if (type == "winner") {
			dots.attr("fill", "red")
			dots.attr("zorder", 1)
			.on("mouseup", function(d) {
				left_marg.transition()
					.duration(200)
					.style("opacity", 1.0);
				left_marg.html(inner_box(d, data["channel"], data["ref_channel"]));
					//.style("left", (d3.event.pageX) + "px")
					//.style("top", (d3.event.pageY - 28) + "px");
			});
			//.on("mouseout", function(d) {
				//left_marg.transition()
					//.duration(500)
					//.style("opacity", 0);
			//});
		} else { // reference triggers
			dots.attr("fill", "black")
				.attr("zorder", -1)
				.attr("opacity", 0.1)
		}

}

function construct_cis_link(channel) {
	//return "https://cis.ligo.org/channel/"
	return channel;
}

function construct_subheader(round, shead_obj) {
	shead_obj.append("div")
		.attr("class", "round_name")
		.style("font-size", "36pt")
		.html("Round " + round["round"]);
	shead_obj.append("div")
		.attr("class", "round_info")
		//.html("Winner: <a href='" + construct_cis_link(round['winner']) + "'>" + round["winner"] + "</a><br/>significance ")
		.html("Winner: " + construct_cis_link(round['winner']) + "<br/>significance " + round['sig']);
}

function load_data(round, min_t, max_t) {
			
	// Scatter and left sidebar container
	var container = d3.select("body").append("div")
		.attr("class", "container");

	var sub_header = container.append("div")
		.attr("class", "sub_header")
		.style("width", "100%")
		.style("text-align", "right")
		.style("border-top-width", "2px")
		.style("border-top-style", "solid");
	// Add an anchor point
	sub_header.html("<a name='round_" + round['round'] + "'></a>")
	construct_subheader(round, sub_header);

	var left_marg = container.append("div")
		.attr("class", "tooltip")
		.style("opacity", 0)
		.style("position", "absolute")
		.style("left", 0)
		.style("width", "300px")
		.style("padding", "10px");
	 
	var margin = {top: 20, right: 15, bottom: 60, left: 60}
		, width = 960 - margin.left - margin.right
		, height = 500 - margin.top - margin.bottom;

	var left_margin_size = 300;
	var chart = container.append('div')
			.attr("class", "scatterplot")
			.style("padding-left", left_margin_size + "px")
		.append('svg:svg')
			.attr('width', width + margin.right + margin.left)
			.attr('height', height + margin.top + margin.bottom)
			.attr('class', 'chart');

	var main = chart.append('g')
		.attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
		.attr('width', width)
		.attr('height', height)
		.attr('class', 'main');

	var x = d3.scale.linear()
		.domain([ min_t, max_t ])
		.range([ 0, width ]);

	var y = d3.scale.log()
		//.domain([0, d3.max(data, function(d) { return d.frequency; })])
		.domain([ 10, 2048 ])
		.range([ height, 0 ]);

	// draw the x axis
	var xAxis = d3.svg.axis()
		.scale(x)
		.orient('bottom');

	main.append('g')
		.attr('transform', 'translate(0,' + height + ')')
		.attr('class', 'main axis date')
		.call(xAxis);

	// draw the y axis
	var yAxis = d3.svg.axis()
		.scale(y)
		.orient('left');

	main.append('g')
		.attr('transform', 'translate(0,0)')
		.attr('class', 'main axis date')
		.call(yAxis);

	d3.tsv("L1-HVETO_VETOED_TRIGS_ROUND_" + round["round"] + "-1109116816-28800.tsv", function(error, data) {
		// Draw some dots!
		data = {"data": data, "channel": round["winner"], "ref_channel": round["ref_channel"]};
		scatter_plot(data, main, x, y, left_marg, "reference");

		// If we hover over the plot, make the reference triggers dim
		container.on("mouseover", function() {
				main.selectAll("g.scatter-dots-reference").selectAll("circle")
					.transition()
					.duration(200)
					.style("opacity", .1);
		});
		// If we move out of the plot, make the reference triggers pop out again
		container.on("mouseout", function() {
				main.selectAll("g.scatter-dots-reference").selectAll("circle")
					.transition()
					.duration(200)
					.style("opacity", .9);
		});
	});

	d3.tsv("L1-HVETO_WINNERS_TRIGS_LOUDEST_ROUND_1-1109116816-28800.tsv", function(error, data) {
		data = {"data": data, "channel": round["winner"], "ref_channel": round["ref_channel"]};
		scatter_plot(data, main, x, y, left_marg, "winner");
	});

}

header = d3.select("body").append("div")
	.attr("class", "round_header")
	.style("width", "100%")

d3.json("hveto.json", function(data) {
	header.selectAll("p")
		.data(data["rounds"])
		.enter().append("p")
			.html(function(d) {
				return "<a href='#round_" + d.round + "'>Round " + d.round + "</a>, winner: " + d.winner + " significance " + d.sig;
			});

	for (var i = 0; i < data["rounds"].length; i++) {
		round = data["rounds"][i];
		load_data(round, data["gps_start"], data["gps_end"]);
	}

});
