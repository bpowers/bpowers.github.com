---
layout: post
category : weblog
tags : [go, golang]
---
{% include JB/setup %}

This post is about some fun I had while putting together a small
UNIX-y utility to measure RAM and swap usage -
[psm](https://github.com/bpowers/psm).  While a small, simple program,
I was able to half its runtime and decrease memory allocations by
two orders of magnitude with the help of some standard go tools.

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

    %developers ALL= NOPASSWD:/usr/bin/ps_mem.py

And it is somewhat slow, especially if the server is under load (due
to memory pressure/swapping) or the number of total mappings is large.

After our immediate issues were resolved, I spent some time over the
holidays seeing if I could implement something similar in Go, which
would run quickly and be installed as setuid root, so that devs that
don't have root on our production boxes could quickly see who was
using what RAM and swap.  In addition, it would be a fun way to dig in
to the proc filesystem, learn a bit more about how the kernel accounts
for memory, and write some Go.

I thought hard about trying to speed up ps_mem.py itself, but since
this was a fun hack done in my spare time I gave into my latent Not
Invented Here syndrome so that I could write something up in Go.

## World, meet psm

"It's like ps_mem.py, but faster to type"

The end result is a small program, `psm`, which produces output
similar to `ps_mem.py`, but with the addition of a column for swap
usage:

    bpowers@python-worker-01:~$ psm -filter=celery
        MB RAM    SHARED   SWAPPED	PROCESS (COUNT)
          60.6       1.1     134.2	[celeryd@notifications:MainProcess] (1)
          62.6       1.1          	[celeryd@health:MainProcess] (1)
         113.7       1.2          	[celeryd@uploads:MainProcess] (1)
         155.1       1.1          	[celeryd@triggers:MainProcess] (1)
         176.7       1.2          	[celeryd@updates:MainProcess] (1)
         502.9       1.2          	[celeryd@lookbacks:MainProcess] (1)
         623.8       1.2      28.5	[celeryd@stats:MainProcess] (1)
         671.3       1.2          	[celeryd@default:MainProcess] (1)
    #   2366.7               164.7	TOTAL USED BY PROCESSES

 It took me a leisurely day at a coffee shop of studying `ps_mem.py`,
 the kernel's `fs/proc/task_mmu.c`, and hacking to get some useful
 output.  The optimization was all done on an Amtrak ride from NY to
 DC; the rest of my time has been spent on some small cleanups,
 documentation and packaging.  The [github
 page](https://github.com/bpowers/psm) for `psm` has installation
 instructions, but if you're on Ubuntu 12.04 you can simply do:

    sudo apt-get install python-software-properties # for apt-add-repository
    sudo add-apt-repository ppa:bobbypowers/psm
    sudo apt-get update
    sudo apt-get install psm

To try it out.

## Make it fast!

I
[really](http://permalink.gmane.org/gmane.linux.laptop.olpc.devel/22816)
[like](https://github.com/lloyd/yajl/pull/59) optimizing code.  Its
taken years to develop the restraint to wait until I have something
working before I try to make it faster.

I'm going to walk though my process and the tools I used with the
remainder of this post.

### Goal

My objective was simple - make `psm` output its results and exit as
quickly as possible.

### Tools of the trade

To make `psm` go faster, first I had to know how fast it was already
going.  I cycled between three tools: the bash time builtin, the GNU
[time(1)](http://linux.die.net/man/1/time) command, and go's
[pprof](http://golang.org/misc/pprof/) tool.  I should also mention I
did my testing on a Fedora 18 install, with the latest version of go's
default branch installed.  In general there have been some nice
improvements since go1 was released, but I didn't explicitly test go1
vs go default.
