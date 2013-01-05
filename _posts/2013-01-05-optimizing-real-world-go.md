---
layout: post
category : weblog
tags : [go, golang]
---
{% include JB/setup %}

This post is about some fun I had while putting together a small
UNIX-inspired utility - [psm](https://github.com/bpowers/psm).

## Background 

At my [place of employment](http://socialcode.com) we've had
memory-usage problems over the past month, following a restructuring
in how we distribute long-running jobs between ec2 instances.  In the
course of several minutes to several hours, the memory usage of these
8 [celery](http://celeryproject.org/) jobs would grow first to fill
all available RAM, and eventually all RAM + swap - invoking the wrath
of the Linux [OOM killer](http://linux-mm.org/OOM_Killer).