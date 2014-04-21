---
layout: blog
title: Flot 0.8.3 released
author: dnschnur
---

We've released Flot 0.8.3, with fixes for jQuery compatibility, the resize
plugin, axis labels, regressions from earlier 0.8.x releases, and more.  You
can [download 0.8.3 here](http://www.flotcharts.org/downloads/flot-0.8.3.zip).

### Important Bug Fixes in 0.8.3 ###

**Compatibility**: Fixed compatibility issues with both older (pre-1.4.x) and
newer (1.9.x and later) jQuery versions.

**Resize plugin**: Applied fixes to the the inline jQuery Resize plugin to
address a regression that resulted in unexpectedly high CPU usage, as well as
an error when using older versions of Internet Explorer.

**Axes**: Fixed regressions related to axis options and ticks, including bugs
in the way space was reserved for the first and last tick labels.

See the [NEWS file](https://github.com/flot/flot/blob/0.8.3/NEWS.md) for a
complete listing of changes made and bugs fixed.

### Acknowledgments ###

We'd like to give special thanks to andig, btccointicker, dmfalke, EGLadona,
Elite Gamer, jorese, Josh Pigford, Neil Katin, ngavard, Paolo Valleri,
Phil Tsarik, soenter, tleish, and tommie for reporting issues or contributing
fixes for this release.
