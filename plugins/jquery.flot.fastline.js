(function ($) {
    "use strict";
    var pluginName = "fastline", pluginVersion = "0.1";
    var options = {
        series: { 
            fastline: {
                active: false,
                show: false,
            }
        }
    };
    var defaultOptions = {
    };
    function init(plot) {
        plot.hooks.processOptions.push(processOptions);
        function processOptions(plot,options){
            if(options.series.fastline.active){
                plot.hooks.drawSeries.push(drawSeries);
            }
        }
        function drawSeries(plot, ctx, serie){
            if (serie.fastline.show) {
                var offset = plot.getPlotOffset();
				if (serie.xaxis.min!=undefined) {var x_min = serie.xaxis.min;}
				else {var x_min = Math.min.apply(null, serie.data[0]);}
				
				if (serie.xaxis.max!=undefined) {var x_max = serie.xaxis.max;}
				else {var x_max = Math.max.apply(null, serie.data[0]);}
				
				if (serie.yaxis.min!=undefined) {var y_min = serie.yaxis.min;}
				else {var y_min = Math.min.apply(null, serie.data[1]);}
				
				if (serie.yaxis.max!=undefined) {var y_max = serie.yaxis.max;}
				else {var y_max = Math.max.apply(null, serie.data[1]);}
				
				var dx = x_max - x_min;
				var dy = y_max - y_min;
				var np = serie.data[0].length;
				var w = plot.width();
				var h = plot.height();
				
				// builds line
				ctx.save();
				ctx.beginPath();
				ctx.lineWidth=1;
				ctx.strokeStyle=serie.color;
				var ox = offset.left;
				var oh = h+offset.top;
				var oy = offset.top;
				var ow = w+offset.left;
				var px = ox, py=oy;
				var xscale = w/dx;
				var yscale = h/dy;
				var first = true;
				var pnx = ox, pny = oh;
                for (var i = 0; i < np; i++) {
					px = ox + parseInt((serie.data[0][i]-x_min)*xscale);
					py = oh - parseInt((serie.data[1][i]-y_min)*yscale);
					if (pnx!=px || pny!=py) {
						if (px>=ox && py>=oy && px<=ow && py<=oh) {
							if (first) {
								ctx.moveTo(px,py);
								first = false;
							} else {
								ctx.lineTo(px,py);
							}
							pnx = px;
							pny = py;
						}
					}
				}
				ctx.stroke();
				ctx.restore();
            }
        }
    }
    $.plot.plugins.push({
        init: init,
        options: options,
        name: pluginName,
        version: pluginVersion
    });
})(jQuery);