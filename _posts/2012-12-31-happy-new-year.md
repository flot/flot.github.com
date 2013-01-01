---
layout: blog
title: Happy New Year!
author: dnschnur
---

Here's a little Flot update as we head into the final hours of 2012.

We had hoped to release 0.8-beta before the end of the year, but we're still
working on a couple of last items, postponing the release until early to mid
January.  [Mark](https://github.com/markrcote) spent the holidays cleaning up
several time-axis issues, and we're feeling good about that implementation.

I've been busy with the last major project for 0.8, cleaning up canvas-text
support.  As you may know, Flot has always used HTML divs for its axis labels.
Unfortuately this makes it dramatically more difficult to save the plot as an
image, and so, earlier in 0.8's dev cycle, [YCharts](http://ycharts.com)
generously sponsored a migration to canvas text labels.

Having observed them in real-world use for some time, we realized that while
canvas labels are a crucial feature, HTML labels make a better default.  Among
other things, they can be styled and support advanced formatting that would be
difficult or impossible to replicate in canvas.

This doesn't mean that canvas text is going away; we're simply moving it to a
plugin.  Once you include the plugin, you need only set a flag on the plot's
options to enable canvas label rendering.

12 of the [18 remaining issues](https://github.com/flot/flot/issues?milestone=1)
for 0.8 relate to the canvas-text project.  Once they're complete we can enter
beta while finishing up the remaining issues, which deal with the website and
documentation.

We're really looking forward to this release, so we can move on to the cool
projects that we have planned for 2013.  Happy new year!
