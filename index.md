---
layout: page
title: Bobby Powers
tagline: Linux, Go, coffee, system dynamics
---
{% include JB/setup %}

This is my internet-home with links to projects I've worked on, along
with occasional weblog postings.

As of September 2015 I've started grad school in CS at [UMass
Amherst](https://www.cics.umass.edu/)!

## Recent Posts

<ul class="posts">
  {% for post in site.posts %}
    <li><span>{{ post.date | date_to_string }}</span> &raquo; <a href="{{ BASE_PATH }}{{ post.url }}">{{ post.title }}</a></li>
  {% endfor %}
</ul>

## Selected Projects

- [libsd](https://github.com/sdlabs/libsd) - System Dynamics
  simulation engine in C.

- [sd.js](https://github.com/sdlabs/sd.js) - System Dynamics
  simulation engine and diagram layout in JavaScript.

- [seshcookie](https://github.com/bpowers/seshcookie) - http sessions
  stored in encrypted cookies for Go.

- [psm](https://github.com/bpowers/psm2) - a Linux utility for RAM and
  swap reporting.

- [cnote](https://github.com/bpowers/cnote) - a music indexing service
  written in C that exposes a REST API.

- [btscale](https://github.com/bpowers/btscale) - reverse-engineered
  JS API to the Acaia scale.

- [slackfs](https://github.com/bpowers/slackfs) - FUSE filesystem to
  interact with Slack, along with tmux-based UI.


## Free Software

I use and support free software, having contributed to a variety of
projects over the years - mostly to address issues that I've
encountered.  I like to leave things better than how I found them.

### Linux kernel

I helped test and fixup the initial x32 pseudo-arch support in
[00194b2e](https://github.com/torvalds/linux/commit/00194b2e845da29395ad00c13a884d9acb9306b5),
[ce5f7a99](https://github.com/torvalds/linux/commit/ce5f7a99df87918b5be4618a9386213a8e9a7146),
and
[f044db4c](https://github.com/torvalds/linux/commit/f044db4cb4bf16893812d35b5fbeaaf3e30c9215).
[f75a8df3](https://github.com/torvalds/linux/commit/f75a8df3bd6466e29a4e40b86b2cfc96fe06d328)
and
[10db4e1e](https://github.com/torvalds/linux/commit/10db4e1e4e9a910a26b94045660e5ba7e7c71419)
address spurious and actual warnings emitted during kernel builds.

### Git

I found and fixed some issues with `git diff --no-index` in
[176a3354](https://github.com/git/git/commit/176a33542eddc6e319bfef4ca726813ce0b9af55)
and
[f3999e03](https://github.com/git/git/commit/f3999e03274df6b98a98a32912f5e171d6eea35f).

### Go language

I've authored a number of small changes, addressing issues in HTTP
headers
([235bd4eb543e](https://code.google.com/p/go/source/detail?r=)), JSON
support
([233ff5d46b3d](https://code.google.com/p/go/source/detail?r=233ff5d46b3d)),
gob
([7f39a0541e03](https://code.google.com/p/go/source/detail?r=7f39a0541e03)),
and the build system
([5a1c75805f59](https://code.google.com/p/go/source/detail?r=5a1c75805f59),
[4f0d27dab290](https://code.google.com/p/go/source/detail?r=4f0d27dab290),
[7d0f321ea87c](https://code.google.com/p/go/source/detail?r=7d0f321ea87c)),
along with a nice little performance hack in the time package
([d9e4f47ae341](https://code.google.com/p/go/source/detail?r=d9e4f47ae341)).

### OLPC

Once upon a time I was an intern with (and subsequently a community
member of) [OLPC](http://laptop.org).  I helped with some
[bugs](http://dev.laptop.org/ticket/6797) that had cropped up, worked
on a (sadly unfinished) [activity named
Model](http://wiki.laptop.org/go/Model) to enable students to do
system dynamics modeling on the XOs, and [rewriting the boot animation
in C](http://permalink.gmane.org/gmane.linux.laptop.olpc.devel/22884),
speeding up boot time by 12 seconds.

## Coffee

I love coffee.  I've done some work on accessing the [Acaia
scale](http://acaia.co/) from JavaScript, which required reverse
engineering their wire protocol.

## System dynamics

I studied system dynamics in [school](http://www.uib.no/rg/dynamics).
I even wrote a nice thesis on how you could neatly [apply
object-oriented programming](/thesis.pdf) to modeling, as a method of
reducing complexity.

I'm currently working on a web-based editor for SD models, with a
focus on usability and design:

<center><img src="/images/editor-screenshot.png" width="651" height="562" /></center>


## Employment

I was most recently a software architect at
[SocialCode](http://socialcode.com).  I am currently pursuing a
graduate education in CS full-time, focusing on systems.
