---
layout: blog
title: The long road to canvas text
author: dnschnur
---

After several delays, canvas text support in 0.8 is finally nearing completion!

For those of you who haven't been following along, Flot has historically used
HTML divs to render axis labels and other text.  One of the major projects for
the 0.8 release, sponsored by [YCharts](http://ycharts.com), was a switch to
rendering text directly onto the canvas.  This offered better performance and
made it possible to save an entire plot (minus the legend) to an image.

But it turned out that many users had come to rely on HTML text, and it has
advantages of its own, including the ability to embed mark-up, better styling,
straightforward interactivity via jQuery events, and more reliable metrics and
render quality.

So we needed a way to make both sides happy.  Our solution was to revert to
HTML text as the default, while making it very simple to re-render the plot
with canvas text at any time.  The implementation took a while to evolve - see
pull request [#935](https://github.com/flot/flot/pull/935) - but has stabilized
enough that we'll be able to merge it into master very soon.

To enable drawing to canvas, one need only include the jquery.flot.canvas.js
plugin, then enable it like this:

```js
$.plot("#placeholder", series, {
	canvas: true
})
```

This works even if you're using CSS to style your text; the plugin will create
a dummy element and extract its text styles.  Our goal is for the transition to
be seamless; you should be able to create an interactive plot using HTML text,
then toggle canvas rendering to save it as an image, and not see a difference.
This is demonstrated in the image below:

<div class="blog-image">
	<img src="/images/blog/2013-02-24-canvas-text-preview.png" alt="Comparison of canvas and HTML text" width="850" height="450"></img>
	<div class="blog-image-caption">The multiple-axes example, with the left half using HTML text and the right half using canvas text.</div>
</div>

The only difference is that canvas text is shifted down by a pixel, and even
that should be resolved in time for the 0.8 release.

This is all backed by our new text API, which will make it easy for us to add
features like axis labels to the core in subsequent releases.  It's currently
for internal use only, but we plan to open it to plugins as soon as possible.

Looking further ahead, the canvas plugin isn't restricted to axis labels;
adding the ability to render the legend to canvas is the next logical step.
