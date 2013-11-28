---
layout: blog
title: Flot 0.8.2 released
author: dnschnur
---

We've released Flot 0.8.2, with patches for many new and long-standing bugs,
including the remaining regressions introduced in 0.8.  You can
[download 0.8.2 here](http://www.flotcharts.org/downloads/flot-0.8.2.zip).

### Important Bug Fixes in 0.8.2 ###

**Tick Labels**: Fixed several issues related to axis ticks, including bugs
in the way widths were assigned to narrowly-spaced labels, and a change that
broke the [flot-tickrotor](http://github.com/markrcote/flot-tickrotor) plugin.

**Resize plugin**: Updated the inline jQuery Resize plugin to the latest
version, fixing several errors and a possible memory leak.

**Rendering Glitches**: Fixed a variety of rendering bugs, including white
circles drawn over pie plots, bars not being filled-in on some browsers, and
incorrectly-placed highlights when using right-aligned bars.

See the [NEWS file](https://github.com/flot/flot/blob/0.8.2/NEWS.md) for a
complete listing of changes made and bugs fixed.

### Acknowledgments ###

We'd like to give special thanks to Anthony Ryan, Benjamin Gram, BeWiBu,
Brend Wanders, Brian Peiris, btccointicker, cleroux, Craig Oldford, Daniel
Hoffmann Bernardes, Eric Byers, execjosh, irbian, Jack Klink, Luis Silva,
Mark Cote, Matthew Sabol, melanker, Mihai Stanciu, Mike Połtyn, Munsifali
Rashid, Patrik Ragnarsson, Pierre Dubois, ryleyb, sknob001, sloker, Teq1 and
Thodoris Greasidis for reporting issues or contributing fixes for this
release.
