---
layout: blog
title: Looking to our next release
author: dnschnur
---

We're finally wrapping up the migration of issues and the wiki to Github!

The goal was to migrate as much as possible, to minimize swapping back and forth between
the two projects. Using [a fork](https://github.com/dnschnur/google-code-issues-migrator)
of the [issue migrator](https://github.com/arthur-debert/google-code-issues-migrator) by
Arthur Debert, we were able to get pretty close to what we wanted. The migration process
had two major limitations:

 - All issues and comments show as having been created by me, and all at the same time.
   This is unavoidable, since Github's API naturally doesn't allow the creation of new
   issues and comments under someone else's identity. To mitigate this, the script adds a
   header to each issue and comment identifying its original author and creation time.

 - Since Github doesn't support file attachments in comments, any screenshots or patches
   were left behind. Since every issue has a link back to its original Google Code issue,
   we can still reach them; it's just a little inconvenient.

Besides that we've preserved just about everything, including issue state, status, other
labels and links to duplicate issues. Some tweaks are still required to fix some broken
references, but they're low-priority and only necessary in a few places.

I apologize to anyone who may have received Github notification spam during this process.
There were a couple of @ mentions in comments that triggered notifications, and watchers
of the repository likely received updates for the migrated issues. We can't do anything
about this, and it's a one-time event, so I hope you'll understand.

The last thing remaining is to finish migration of the current contents of the wiki; that
should be complete by this weekend.

We're now looking ahead to the 0.8 release. It's been a long time since our last major
release; the project went quiet for a while when @OleLaursen had less time to contribute,
and since I became active I've been focusing on issue triage, cleanup and organizational
changes like the migration to Github. With that out of the way, our priority is a new
release, so all these great updates and fixes can reach a wider audience.

I've created a 'Release 0.8' milestone in the issue tracker, and will add issues and pull
requests to it over the next couple of weeks. The next blog post will provide more info on
what's targeted for 0.8, and our expected timeframe for the release.
