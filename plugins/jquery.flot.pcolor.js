(function ($) {
    "use strict";
    var pluginName = "pcolor", pluginVersion = "0.2.0";
    var options = {
        series: { 
            pcolor: {
                active: false,
                show: false,
				scalebar:
				{
					location: "top right", // can be a combination of top, right, left, bottom
					orientation: "vertical", // horizontal or vertical
					width:15, // pixel width
					height:100, // pixel height
					fontsize:"10px", // font size
					fontfamily:"times", // font family
					labels:3, // number of labels (>1 or not displayed)
					labelformat:"1f", // label format: number = truncation accuracy
									  // letter = "f":toFixed, "p":toPrecision, "e":toExponential, "c":custom
					labelformatter: function(value,precision){return ""},
					textalign:"right" // alignment of labels: left (default), center, right or spread
				}
            }
        }
    };
    function init(plot) {
        var offset = null,opt = null,series = null;
        plot.hooks.processOptions.push(processOptions);
        function processOptions(plot,options){
			// parses options for pcolor plot
            if(options.series.pcolor.active){
				// hook for pcolor rendering
                plot.hooks.drawSeries.push(drawSeries);
				
				if (options.series.pcolor.scalebar) {
					// parses position string
					var tags = options.series.pcolor.scalebar.location.split(" ");
					var left = (tags.indexOf("left")>-1);
					var right = (tags.indexOf("right")>-1);
					var top = (tags.indexOf("top")>-1);
					var bottom = (tags.indexOf("bottom")>-1);
					plot.scalebar_position = [top && left,
						 					  top && right,
						 					  bottom && right,
											  bottom && left].indexOf(true);
					// determines if the scale bar is rendered
					plot.scalebar = (tags.length>0) && (tags.indexOf("none")==-1);
					// orientation: horizontal=true, vertical=false (default)
					plot.scalebar_orientation = (options.series.pcolor.scalebar.orientation.indexOf("horizontal")>-1);
					// alignment of labels
					var align_left = (options.series.pcolor.scalebar.textalign=="left");
					var align_center = (options.series.pcolor.scalebar.textalign=="center");
					var align_right = (options.series.pcolor.scalebar.textalign=="right");
					var align_spread = (options.series.pcolor.scalebar.textalign=="spread");
					plot.sbar_textalign = [align_left,align_center,align_right,align_spread].indexOf(true);
					plot.sbar_textalign = (plot.sbar_textalign>-1)*plot.sbar_textalign;
					// spread not allowed for vertical configuration
					if (!plot.scalebar_orientation && plot.sbar_textalign==3) {
						plot.sbar_textalign = 0;
					}
					// creates canvas with scale bar gradient
					plot._sbar_gcnv = document.createElement("canvas");
					var sctx = plot._sbar_gcnv.getContext("2d");
					plot._sbar_gcnv.width = options.series.pcolor.scalebar.width;
					plot._sbar_gcnv.height = options.series.pcolor.scalebar.height;
					if (plot.scalebar_orientation) {
						var cgrd = sctx.createLinearGradient(0,0,plot._sbar_gcnv.width,0);
					} else {
						var cgrd = sctx.createLinearGradient(0,plot._sbar_gcnv.height,0,0);
					}
				} else {
					plot.scalebar = false;
				}
				// creates color map
				// most convenient way found so far: draw a gradient on an off-screen canvas
				// and store it as a bitmap
				var ocnv = document.createElement("canvas");
				ocnv.width = 16385;
				ocnv.height = 1;
				var octx = ocnv.getContext("2d");
				var grd = octx.createLinearGradient(0,0,16385,0);
				if (options.series.pcolor.colormap==undefined) {
					var colormap = [[0,"#0000ff"],[0.5,"#ffffff"],[1,"#ff0000"]];
				} else {
					var colormap = options.series.pcolor.colormap;
				}
				for (var n=0; n<colormap.length; n++) {
					grd.addColorStop(colormap[n][0],colormap[n][1]);
					if (plot.scalebar) {
						cgrd.addColorStop(colormap[n][0],colormap[n][1]);
					}
				}
				octx.fillStyle = grd;
				octx.fillRect(0,0,16385,1);
				plot.colormap = octx.getImageData(0,0,16385,1);
				
				// creates off-screen canvas and context for plot rendering
				plot.ocnv = document.createElement("canvas");
				plot.octx = plot.ocnv.getContext("2d");
				// fills scale bar
				if (plot.scalebar) {
					sctx.fillStyle = cgrd;
					sctx.fillRect(0,0,plot._sbar_gcnv.width,plot._sbar_gcnv.height);
					sctx.rect(0,0,plot._sbar_gcnv.width, plot._sbar_gcnv.height);
					sctx.stroke();
					// parses label format
					plot.labelformat = options.series.pcolor.scalebar.labelformat.charAt(options.series.pcolor.scalebar.labelformat.length-1);
					plot.labelprecision = parseInt(options.series.pcolor.scalebar.labelformat);
				}
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
					for (var i=0; i<h; i++) {
						new_map_x[i] = new Array(w);
						for (var j=0; j<w; j++) {
							new_map_x[i][j] = serie.data[0][j];
						}
					}
					serie.data[0] = new_map_x;
				} else {
					var x_min = 1e32;
					var x_max = -1e32; 
					for (var i=0; i<h; i++) {
						x_min = Math.min(x_min, Math.min.apply(null, serie.data[0][i]));
						x_max = Math.max(x_max, Math.max.apply(null, serie.data[0][i]));
					}
				}
				if (typeof serie.data[1][0] == "number") { // 1D map for y coordinates
					var new_map_y = new Array(h);
					var y_min = Math.min.apply(null, serie.data[1]);
					var y_max = Math.max.apply(null, serie.data[1]);
					for (var i=0; i<h; i++) {
						new_map_y[i] = new Array(w);
						for (var j=0; j<w; j++) {
							new_map_y[i][j] = serie.data[1][i];
						}
					}
					serie.data[1] = new_map_y;
				} else {
					var y_min = 1e32;
					var y_max = -1e32; 
					for (var i=0; i<h; i++) {
						y_min = Math.min(y_min, Math.min.apply(null, serie.data[1][i]));
						y_max = Math.max(y_max, Math.max.apply(null, serie.data[1][i]));
					}
				}
				
				var dx = x_max - x_min;
				var dy = y_max - y_min;

				// finds data range
				var c_min = 1e32;
				var c_max = -1e32;
                for (var i = 0; i < h; i++) {
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
                for (var i = 0; i < h; i++) {
	                for (var j = 0; j < w; j++) {
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
				// adds scalebar if necessary
				if (plot.scalebar) {
					ctx.save();
					// prepares labels
					if (serie.pcolor.scalebar.labels>1) {
						ctx.font = serie.pcolor.scalebar.fontsize + " " + serie.pcolor.scalebar.fontfamily;
						// formats labels and computes their width
						var labels = new Array(serie.pcolor.scalebar.labels);
						var lwidths = new Array(serie.pcolor.scalebar.labels);
						var dt = dc/(serie.pcolor.scalebar.labels-1);
						// couldn't find a standard way to obtain the font height
						// using the full block character trick instead.
						var tmh = ctx.measureText('\u2588').width;
						for (var t=0; t<serie.pcolor.scalebar.labels; t++) {
							var tv = t*dt + c_min;
							switch(plot.labelformat) {
							case "e":
								labels[t] = tv.toExponential(plot.labelprecision);
								break;
							case "f":
								labels[t] = tv.toFixed(plot.labelprecision);
								break;
							case "p":
								labels[t] = tv.toPrecision(plot.labelprecision);
								break;
							case "c":
								labels[t] = plot.labelformatter(tv,plot.labelprecision);
							default:
								labels[t] = "";
							}
							lwidths[t] = ctx.measureText(labels[t]).width;
						}
						var tmw = Math.max.apply(null,lwidths);
					}
					
					// draws scale bar according to position parameter
					switch (plot.scalebar_position) {
					case 0: // inside top left
						if (plot.scalebar_orientation) {
							var cpx = offset.left+plot._sbar_gcnv.height;
							var cpy = offset.top+plot._sbar_gcnv.height;
							var ocpx = 0;
							var ocpy = tmh+4;
							var otx = 0;
							var oty = tmh+2;
						} else {
							var cpx = offset.left+plot._sbar_gcnv.width;
							var cpy = offset.top+plot._sbar_gcnv.width;
							var ocpx = plot._sbar_gcnv.width;
							var ocpy = 0;
							var otx = 2;
							var oty = tmh;
						}
						break;
					case 1: // inside top right
						if (plot.scalebar_orientation) {
							var cpx = pw-offset.right-plot._sbar_gcnv.width-plot._sbar_gcnv.height;
							var cpy = offset.top+plot._sbar_gcnv.height;
							var ocpx = 0;
							var ocpy = tmh+4;
							var otx = 0;
							var oty = tmh+2;
						} else {
							var cpx = pw-offset.right-2*plot._sbar_gcnv.width;
							var cpy = offset.top+plot._sbar_gcnv.width;
							var ocpx = -tmw-4;
							var ocpy = 0;
							var otx = 2;
							var oty = tmh;
						}
						break;
					case 2: // inside bottom right
						if (plot.scalebar_orientation) {
							var cpx = pw-offset.right-plot._sbar_gcnv.width-plot._sbar_gcnv.height;
							var cpy = ph-offset.bottom-2*plot._sbar_gcnv.height;
							var ocpx = 0;
							var ocpy = -tmh-4;
							var otx = 0;
							var oty = tmh;
						} else {
							var cpx = pw-offset.right-2*plot._sbar_gcnv.width;
							var cpy = ph-offset.bottom-plot._sbar_gcnv.height-plot._sbar_gcnv.width;
							var ocpx = -tmw-4;
							var ocpy = 0;
							var otx = 2;
							var oty = tmh;
						}
						break;
					case 3: // inside bottom left
						if (plot.scalebar_orientation) {
							var cpx = offset.left+plot._sbar_gcnv.height;
							var cpy = ph-offset.bottom-2*plot._sbar_gcnv.height;
							var ocpx = 0;
							var ocpy = -tmh-4;
							var otx = 0;
							var oty = tmh;
						} else {
							var cpx = offset.left+plot._sbar_gcnv.width;
							var cpy = ph-offset.bottom-plot._sbar_gcnv.height-plot._sbar_gcnv.width;
							var ocpx = plot._sbar_gcnv.width;
							var ocpy = 0;
							var otx = 2;
							var oty = tmh;
						}
						break;
					}
					
					// if flot's drawGrid function is exposed, gives the possibility to draw axes below the scale bar
					if (serie.pcolor.grid && plot.drawGrid) { plot.drawGrid(); }
					
					// adds labels - only activated if number_of_labels>1, as otherwise it makes no sense
					if (serie.pcolor.scalebar.labels>1) {
						// positions the background for the labels and the labels inside
						ctx.fillStyle="rgba(255,255,255,0.66)";
						if (plot.scalebar_orientation) {
							// for horizontal orientation
							ctx.fillRect(cpx+ocpx, cpy+ocpy, plot._sbar_gcnv.width, tmh+4);
							ctx.fillStyle="#000000";
							var cdw = (plot._sbar_gcnv.width-tmw-4)/(serie.pcolor.scalebar.labels-1);
							var labx = cpx+ocpx+otx+2; // horizontal offset
							var laby = cpy+ocpy+oty; // vertical position
							for (t=0; t<serie.pcolor.scalebar.labels; t++) {
								var corrw = (tmw-lwidths[t])/2;
								if (plot.sbar_textalign==3) { // spread labels
									if (t==0) {
										ctx.fillText(labels[t],labx+cdw*t,laby);
									} else if (t==serie.pcolor.scalebar.labels-1) {
										ctx.fillText(labels[t],labx+cdw*t+corrw*2, laby);
									} else {
										ctx.fillText(labels[t],labx+cdw*t+corrw, laby);
									}
								} else {
									ctx.fillText(labels[t],labx+cdw*t+corrw*plot.sbar_textalign, laby);
								}
							}
						} else {
							// for vertical orientation
							ctx.fillRect(cpx+ocpx, cpy+ocpy, tmw+4, plot._sbar_gcnv.height);
							ctx.fillStyle="#000000";
							var cdh = (plot._sbar_gcnv.height-oty-2)/(serie.pcolor.scalebar.labels-1);
							for (t=0; t<serie.pcolor.scalebar.labels; t++) {
								var corrw = (tmw-lwidths[t])/2;
								ctx.fillText(labels[t],cpx+ocpx+otx+corrw*plot.sbar_textalign, cpy+ocpy+plot._sbar_gcnv.height-2-cdh*t);
							}
						}
					}
					ctx.drawImage(plot._sbar_gcnv,cpx,cpy);
					ctx.restore();
				}
				// sets transform back to the original
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