---
layout: blog
title: A new branching scheme
author: dnschnur
---

Last week's release of 0.8.1 was Flot's first-ever point-release. One of the
reasons why we haven't had them in the past is because our branching scheme
didn't support it.

Before 0.8, every pull request and fix was merged straight into master, making
it always the latest version of the library. This was easy to understand, but
prevented us from releasing minor fixes separate from major changes that we
knew were incomplete or still needed more testing.

<div class="blog-image">
	<img src="/images/blog/2013-05-29-a-new-branching-scheme.png" alt="{{ post.title }}" title="{{ post.title }}" width="860" height="265"></img>
</div>

You may have already noticed that after the release of 0.8 we added a couple
of new branches: 0.9-work and code-cleanup. Now master represents the stable
release - currently 0.8.2 - while new features and major releases are given
separate branches. Feature branches are merged into the next major-release
branch on completion, and when the release is ready it is merged into master.

All this time, we can continue merging minor fixes into master. This lets us
ship point-releases to get those changes out to you faster, so you don't have
to wait until the next major-release to use them safely in production.

After every point-release we merge back into the next major-release branch, to
keep it up-to-date as work continues.

This is great for users, but it does mean that those of you contributing pull
requests need to do a little more to ensure that you're working from the
correct branch. If your contribution is anything beyond a bug fix - if it adds
a feature or changes the API in any way - then you should base against the
0.9-work branch.

As always, please try to follow Flot's
[contribution guidelines](https://github.com/flot/flot/blob/master/CONTRIBUTING.md).
We will soon begin requiring that new code pass our automated JSHint before
we'll merge it. It's just a good idea in general; it makes the merge easy for
us so we have more time to work on new features for you.
