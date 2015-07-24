## Fast line plot plugin for Flot ##
This plugin makes a very basic line plot. It is intended to efficiently render large and fast-updating data sets. I created this plugin when I needed to display lines of some thousands of points updating several times a second. While the original Flot implementation worked fine with Webkit (Safari and Chrome), the result on Firefox was catastrophic. This plugin gives the same performance on all three browsers.

## Basic usage ##
When creating a Flot chart, simply add the *fastline* tag to the series definition, like this:
```
var my_plot = $.plot($("#plot_container"), [data], series:{fastline:{ active:true, show:true, colors: my_colors }});
```

## Data format ##
The pcolor plugin expects that the data is composed of 2 arrays, one for the horizontal coordinates and one for the vertical coordinates:
```
data = [x coordinates <1D array>, y coordinates <1D array>]
```
It is sorted differently than normal Flot lines to allow this sort of operations: ```Math.min.apply(null,vector)```.

## Data range ##
The displayed range can be adjusted in this way:
```
my_plot.getAxes().xaxis.options.min = new_x_min;
my_plot.getAxes().xaxis.options.max = new_x_max;
my_plot.getAxes().yaxis.options.min = new_y_min;
my_plot.getAxes().yaxis.options.max = new_y_max;
```

## Colors ##
The *colors* option is a list of color codes. It should be at least as long as the number of data sets.

## Example ##
See included file example.fastline.html
