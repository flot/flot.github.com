(function ($) {
    "use strict";
    var pluginName = "pcolor", pluginVersion = "0.1.2";
    var options = {
        series: { 
            pcolor: {
                active: false,
                show: false,
            }
        }
    };
    var defaultOptions = {
    };
    function init(plot) {
        var offset = null,opt = null,series = null;
        plot.hooks.processOptions.push(processOptions);
        function processOptions(plot,options){
            if(options.series.pcolor.active){
                opt = options;
                plot.hooks.drawSeries.push(drawSeries);
				// creates colormap
				var ocnv = document.createElement("canvas");
				ocnv.width = 16384;
				ocnv.height = 1;
				var octx = ocnv.getContext("2d");
				var grd = octx.createLinearGradient(0,0,16385,0);
				if (opt.series.pcolor.colormap==undefined) {
					var colormap = [[0,"#0000ff"],[0.5,"#ffffff"],[1,"#ff0000"]];
				} else {
					var colormap = opt.series.pcolor.colormap;
				}
				for (var n=0; n<colormap.length; n++) {
					grd.addColorStop(colormap[n][0],colormap[n][1]);
				}
				octx.fillStyle = grd;
				octx.fillRect(0,0,16385,1);
				plot.colormap = octx.getImageData(0,0,16385,1);
				// creates off-screen canvas and context for plot rendering
				plot.ocnv = document.createElement("canvas");
				plot.octx = plot.ocnv.getContext("2d");
            }
        }
        function drawSeries(plot, ctx, serie){
            if (serie.pcolor.show && serie.data.length>0) {
                offset = plot.getPlotOffset();
				var w = serie.data[2][0].length, h = serie.data[2].length;
				var pw = plot.width()+offset.left+offset.right, ph = plot.height()+offset.top+offset.bottom;
				var cw = ctx.canvas.width, ch = ctx.canvas.height;
				var ocnv = plot.ocnv;
				var octx = plot.octx;
				ocnv.width = w;
				ocnv.height = h;
				var img = octx.createImageData(w, h);
				
				if (typeof serie.data[0][0] == "number") { // 1D map for x coordinates => makes 2D map
					var new_map_x = new Array(h);
					var x_min = Math.min.apply(null, serie.data[0]);
					var x_max = Math.max.apply(null, serie.data[0]);
					for (var i = 0; i !== h; i++) {
						new_map_x[i] = new Array(w);
						for (var j = 0; j !== w; j++) {
							new_map_x[i][j] = serie.data[0][j];
						}
					}
					serie.data[0] = new_map_x;
				} else {
					var x_min = 1e32;
					var x_max = -1e32; 
					for (var i = 0; i !== h; i++) {
						x_min = Math.min(x_min, Math.min.apply(null, serie.data[0][i]));
						x_max = Math.max(x_max, Math.max.apply(null, serie.data[0][i]));
					}
				}
				if (typeof serie.data[1][0] == "number") { // 1D map for y coordinates
					var new_map_y = new Array(h);
					var y_min = Math.min.apply(null, serie.data[1]);
					var y_max = Math.max.apply(null, serie.data[1]);
					for (var i = 0; i !== h; i++) {
						new_map_y[i] = new Array(w);
						for (var j = 0; j !== w; j++) {
							new_map_y[i][j] = serie.data[1][i];
						}
					}
					serie.data[1] = new_map_y;
				} else {
					var y_min = 1e32;
					var y_max = -1e32; 
					for (var i = 0; i !== h; i++) {
						y_min = Math.min(y_min, Math.min.apply(null, serie.data[1][i]));
						y_max = Math.max(y_max, Math.max.apply(null, serie.data[1][i]));
					}
				}
				
				var dx = x_max - x_min;
				var dy = y_max - y_min;

				// finds data range
				var c_min = 1e32;
				var c_max = -1e32;
                for (var i = 0; i !== h; i++) {
					c_min = Math.min(c_min, Math.min.apply(null, serie.data[2][i]));
					c_max = Math.max(c_max, Math.max.apply(null, serie.data[2][i]));
				}
				var dc = c_max - c_min;
				
				serie.xaxis.datamin = x_min;
				serie.xaxis.datamax = x_max;
				serie.yaxis.datamin = y_min;
				serie.yaxis.datamax = y_max;
				
				if ((typeof serie.xaxis.min == "number") && (typeof serie.xaxis.max == "number")) {
					x_min = serie.xaxis.min;
					x_max = serie.xaxis.max;
					var wscale = dx/(x_max-x_min);
				} else {
					var wscale = 1;
				}
				if ((typeof serie.yaxis.min == "number") && (typeof serie.yaxis.max == "number")) {
					y_min = serie.yaxis.min;
					y_max = serie.yaxis.max;
					var hscale = dy/(y_max-y_min);
				} else {
					var hscale = 1;
				}
				var sw = cw/pw*(pw-offset.left-offset.right)/w*wscale;
				var sh = ch/ph*(ph-offset.top-offset.bottom)/h*hscale;
				
				// builds array of pixels
                for (var i = 0; i !== h; i++) {
	                for (var j = 0; j !== w; j++) {
						if (serie.data[0][i][j]>=x_min && serie.data[0][i][j]<=x_max &&
							serie.data[1][i][j]>=y_min && serie.data[1][i][j]<=y_max) {
								var px = (w-1)*(serie.data[0][i][j]-x_min)/dx;
								var py = (h-1)*(serie.data[1][i][j]-y_min)/dy;
								var pxm = Math.floor(px);
								var pym = Math.floor(py);
								var pxp = Math.ceil(px);
								var pyp = Math.ceil(py);
								var idxmm = (pym*w+pxm)*4;
								var idxpm = (pyp*w+pxm)*4;
								var idxmp = (pym*w+pxp)*4;
								var idxpp = (pyp*w+pxp)*4;
								var v = 4*parseInt(((serie.data[2][i][j]-c_min)/dc)*16384);
								var r = plot.colormap.data[v];
								var g = plot.colormap.data[v+1];
								var b = plot.colormap.data[v+2];
								img.data[idxmm] = r;
								img.data[idxmm+1] = g;
								img.data[idxmm+2] = b;
								img.data[idxmm+3] = 255;
								if (idxmp!=idxmm) {
									img.data[idxmp] = r;
									img.data[idxmp+1] = g;
									img.data[idxmp+2] = b;
									img.data[idxmp+3] = 255;
								}
								if (idxpm!=idxmm) {
									img.data[idxpm] = r;
									img.data[idxpm+1] = g;
									img.data[idxpm+2] = b;
									img.data[idxpm+3] = 255;
								}
								if (idxpp!=idxmm) {
									img.data[idxpp] = r;
									img.data[idxpp+1] = g;
									img.data[idxpp+2] = b;
									img.data[idxpp+3] = 255;
								}
							}
					}
				}
				octx.putImageData(img,0,0);
				ctx.save();
		        ctx.beginPath();
				ctx.rect(offset.left,offset.top,pw-offset.left-offset.right,ph-offset.top-offset.bottom);
				ctx.clip();
				ctx.setTransform(sw,0,0,sh,0,0);
				ctx.drawImage(ocnv,offset.left/sw*cw/pw,offset.top/sh*ch/ph);
				ctx.restore();
				ctx.setTransform(cw/pw,0,0,ch/ph,0,0);
            }
        }
    };
    $.plot.plugins.push({
        init: init,
        options: options,
        name: pluginName,
        version: pluginVersion
    });
})(jQuery);