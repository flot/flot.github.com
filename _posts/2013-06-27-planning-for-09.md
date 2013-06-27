---
layout: blog
title: Planning for 0.9
author: dnschnur
---

This week we finished selecting the issues and features that we'll work on for
the [0.9 release](https://github.com/flot/flot/issues?milestone=2&state=open).
Below is a summary of the main goals, and you can take a look at the full list
via the link above. Pay special attention to #9; we're very interested in
community feedback on the best way to implement this plugin mechanism.

#### Flot 0.9 Highlights ####

1. Clean up the code to the point where it passes our automated JSHint Travis
   build.

   This is already done; you can check it out in the 0.9-work branch. Note
   that this involved removing inline plugins like jquery.colorhelpers.js, and
   we haven't yet updated the build system to auto-inline these.  We'll handle
   that soon, but for now you'll need to remember to include them yourself.

2. Core support for axis labels and plot titles.

   This is in-progress, and should get pushed to 0.9-work in the next week.

3. Core support for basic rotated axis tick labels.

4. Factor out the built-in point, line, and bar draw types into plugins.

   The plugins will still be inlined in jquery.flot.js, so this change won't
   break any existing code.

5. Generalize and expose all functionality - defining hover/click areas,
   altering plot margins, etc. - that is currently restricted to the built-in
   plot types, making it available to any plugin.

   The main goal of the 0.9 release is to improve and finalize the plugin API.
   Our biggest task is to pull out everything that is hard-coded into the
   built-in draw types and make it available to all plugins.

6. Extend hooks and events to give plugins additional capabilities.

7. Allow legends to be drawn to the canvas.

   This will be optional, similar to how axis tick labels are drawn using HTML
   text by default, but can optionally be drawn to canvas.

8. Simplify exporting the plot to an image.

   Image export questions come up all the time, and we should at least provide
   a good example for how to do it. We may even add helper functions to avoid
   some of the work.

9. Organize first-party and third-party plugins, and allow inlining of
   dependencies.

   Since Flot first introduced its plugin API, there has been a big expansion
   in the number of core and third-party plugins, and we need a better way to
   organize them all. We also need to figure out how plugins get accepted into
   the core repository, and what that means in terms of who maintains them.

   There are still a lot of open questions here, so we've created a new
   [forum topic](https://groups.google.com/forum/#!topic/flot-graphs/LrQLuG-e9qU)
   to discuss the problem, and get feedback on some ideas for how to solve it.

#### Contributing ####

If you are interested in contributing to Flot, check out the 0.9 milestone's
[list of open issues](https://github.com/flot/flot/issues?milestone=2&state=open).
Remember to start your work from the 0.9-work branch, and first discuss any
larger changes in the issue before implementing them.
