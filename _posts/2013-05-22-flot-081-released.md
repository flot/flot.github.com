---
layout: blog
title: Flot 0.8.1 released
author: dnschnur
---

We've released Flot 0.8.1, with patches for regressions introduced in 0.8 and
other fixes that either couldn't make it into 0.8 or were reported later. You
can [download 0.8.1 here](http://www.flotcharts.org/downloads/flot-0.8.1.zip).

### Important Bug Fixes in 0.8.1 ###

**Axis labels**: Fixed several axis labeling issues, including regressions in
0.8 that changed the way dates were aligned, caused duplicate axis labels to
disappear, and prevented label text from wrapping.

**Pie plugin**: Resolved a regression in 0.8 that broke pie charts if their
data was provided in [[x, y]] format.

**jQuery compatibility**: Worked around a regression in 0.8 that broke
compatibility with jQuery versions earlier than 1.7.

**Axis scaling**: Fixed a bug in the implementation of the series 'zero'
option that caused it to be ignored for series with nulls in their data.

See the [NEWS file](https://github.com/flot/flot/blob/0.8.1/NEWS.md) for a
complete listing of changes made and bugs fixed.

### Acknowledgments ###

We'd like to give special thanks to Brian Peiris, Daniel Rothig, Daniel
Shapiro, goorpy, Lee Willis, Marcelo Jorge Vieira, Mark Raymond, Michal
Zglinski, Nicolas Morel, Paolo Valleri, sabregreen, Tom Sheppard, and vird for
contributing fixes or reporting issues fixed in this release.
