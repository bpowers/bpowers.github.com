---
layout: post
category : weblog
tags : [go, golang]
---
{% include JB/setup %}

This post is about some fun I had while putting together a small
UNIX-y utility - [psm](https://github.com/bpowers/psm).

## Background 

At my [place of employment](http://socialcode.com) we've had
memory-usage problems over the past month, following a restructuring
in how we distribute long-running jobs between ec2 instances.  In the
course of several minutes to several hours, the memory usage of these
8 [celery](http://celeryproject.org/) jobs would grow first to fill
all available RAM, and eventually all RAM + swap - invoking the wrath
of the Linux [OOM killer](http://linux-mm.org/OOM_Killer).  This was
an unfortunate series of events, particularly so because it only
happened on production.

While investigating what was going on, I made good use of the
excellent `ps_mem.py` by [pixelbeat](http://www.pixelbeat.org/)
([source](https://github.com/pixelb/scripts/blob/master/scripts/ps_mem.py)).
This script is fantastic, especially since I can just scp the copy
from my laptop over to a machine and then run `sudo ./ps_mem.py`.  The
two (minor) downsides are that it requires a custom sudo rule for
non-admin users to be able to use it:

    %developers ALL= NOPASSWD:/usr/local/bin/ps_mem.py

And it is somewhat slow, especially if the server is under load (due
to memory pressure/swapping) or the number of total mappings is large.

After our immediate issues were resolved, I spent some time over the
holidays seeing if I could implement something similar in Go, which
would run quickly and be installed as setuid root, so that devs that
don't have root on our production boxes could quickly see who was
using what RAM and swap.