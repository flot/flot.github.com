$(function() {

	var container = $("#placeholder");

	var plot = $.plot(container, [1], {
		grid: {
			borderWidth: 1,
			minBorderMargin: 20,
			labelMargin: 10,
			backgroundColor: {
				colors: ["#fff", "#e4f4f4"]
			},
			hoverable: true,
			mouseActiveRadius: 50,
			margin: {
				top: 8,
				bottom: 20,
				left: 20
			},
			markings: function(axes) {
				var markings = [];
				var xaxis = axes.xaxis;
				for (var x = Math.floor(xaxis.min); x < xaxis.max; x += xaxis.tickSize * 2) {
					markings.push({ xaxis: { from: x, to: x + xaxis.tickSize }, color: "rgba(232, 232, 255, 0.2)" });
				}
				return markings;
			}
		},
		legend: {
			show: true
		},
	});

	// Create the demo X and Y axis labels

	var xaxisLabel = $("<div class='axisLabel xaxisLabel'></div>")
		.text("Test X Label")
		.appendTo(container);

	var yaxisLabel = $("<div class='axisLabel yaxisLabel'></div>")
		.text("Test Y Label")
		.appendTo(container);

	// Since CSS transforms use the top-left corner of the label as the transform origin,
	// we need to center the y-axis label by shifting it down by half its width.
	// Subtract 20 to factor the chart's bottom margin into the centering.

	yaxisLabel.css("margin-top", yaxisLabel.width() / 2 - 20);

});
