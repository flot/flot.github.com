---
layout: blog
title: Semantic Versioning
author: dnschnur
---

Flot has historically used a *major.minor* versioning scheme, with the last
stable version being 0.7.  With the next release we will adopt the popular
[Semantic Versioning](http://semver.org) specification.  This change will have
several benefits:

 - We'll be able to produce patch-level releases to address bugs outside of the
   major release schedule.

 - Many package managers and other tools already require semantic versioning,
   so this will improve compatibility, at least avoiding having to track a
   separate version number in manifest files.

 - Semantic versioning provides a clear indication of API stability between
   releases, so you'll know when to expect breaking changes.

If you have any scripts or package management tools that expect a version in
the old format, please be prepared to update them.

Our next release will be tagged and labeled as 0.8.0-beta.
