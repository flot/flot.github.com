---
layout: blog
title: Announcing Flot 0.8 beta
author: dnschnur
---

We're excited to announce that Flot 0.8 has entered beta! It has been almost
two full years since the release of version 0.7, and we're very happy to see
all the new stuff that we've been working on finally move towards a major
release!

To the Flot community: thank you so very much for your support and the enormous
number of bug reports, feature suggestions, and pull requests that you've
contributed towards this release.  Now let's get to testing it!

### What's New? ###

**Time series improvements:** Support for time series has been moved into a
plugin, jquery.flot.time.js, and a new axis option "timezone" can be used to
control the time zone in which the dates are displayed.

**Canvas text**: A new plugin, jquery.flot.canvas.js, allows axis tick labels
to be rendered directly to the canvas, rather than using HTML elements, making
it much easier to save entire plots as images.

**Plotting categories**: The new categories plugin makes it easy to plot data
that is grouped into text categories rather than numeric axis values.

**Plotting error bars**: The new error bars plugin can be used to show standard
deviation and other useful statistical properties.

*Support for high-resolution displays*: Flot now looks even crisper on the
high-density displays found in many new phones, tablets, and laptops.

**Tons of bug fixes**: We've fixed over a hundred bugs, resolving long-standing
issues with the pie plugin and cross-browser compatibility, among many others.

**Lots of enhancements**: We've added and merged a huge number of enhancements,
covering everything from improved control over the grid's appearance to legend
sorting to thresholding improvements.

See the [NEWS file](https://github.com/flot/flot/blob/0.8.0-beta/NEWS.md) for a
complete listing of changes made and bugs fixed.

### What to Test ###

The long development cycle for this release means that many of its changes are
already quite stable, but we still need your help to ensure that the 0.8 final
release is as solid as possible.

We'd especially appreciate testing of canvas-text across a wide-range of
browsers, platforms, and font options. Another great testing target is the new
time-series plugin, including timezones and date/time formatting options.
