---
layout: post
title: "Notes on 'Practical FS Design'"
description: ""
category: weblog
tags: [fs, kernel]
---
{% include JB/setup %}

I recently finished [Practical File System
Design](https://books.google.com/books/about/Practical_File_System_Design_with_the_BE.html?id=HVp0QgAACAAJ&hl=en)
by [Dominic Giampaolo](http://www.nobius.org/~dbg/) - a great read on
filesystem implementation.  Some aspects of the book are dated
(initially published in 1999), but it does (lightly) discuss
multithreading issues, which are absent from much of the classic UNIX
literature.  The three topic covered I felt were especially notable
are journaling, indexing, and the comparison with other filesystems.

## Context

This book was written in 1999, and as a result there are a number of
statements and context that seem quaint today.  Testing was done on
systems with 32 MB RAM and 3.2 GB hard drives (HDs), and
dual-processor CPUs at or under 200 MHz.  In fact - all IO that
happened in 64Kb chunks or larger bypassed the kernel's cache
altogether.  The capacity of RAM and HDs common today has increased by
two to three orders of magnitude.  Similarly - SSDs change the nature
of storage, eliminating multi-millisecond seeks.  Throughput is still
faster for sequential operations than it is for random IO, but there
is limited performance to be gained by complicated disk IO schedulers
attempting to minimize seek time. Additionally, disk performance has
increased faster than single-CPU performance, with this closing gap
potentially leaving less room for expensive algorithms to run while
waiting for disk seeks.

## Journaling

[Filesystem
journaling](https://en.wikipedia.org/wiki/Journaling_file_system) is a
way to improve the reliability of filesystems while decreasing the
amount of time required to recover from a power loss or other
dirty-unmount event.  Journaling originates from
[ACID](https://en.wikipedia.org/wiki/ACID) relational DBs, as a way of
ensuring consistency.  Because of this lineage, before this book I
assumed that journaling covered both file-system data structures (like
inodes and directories) as well as data, but this isn't necessarily
the case.  The goal of journaling in
[BeFS](https://en.wikipedia.org/wiki/Be_File_System) is to ensure the
consistency of the FS's on-disk data structures - data writes are not
journaled.  The first journaling filesystem for Linux was
[Reiser3](https://en.wikipedia.org/wiki/ReiserFS), which initially
only supported journaling metadata (data journaling was added years
later in 2.6.8).  Modern [ext4](https://en.wikipedia.org/wiki/Ext4)
filesystems support journaling data writes, but it is disabled by
default for performance reasons.  This is important - while journaling
protects the integrity of on-disk kernel data structures, it is still
possible for an application's file to lose data in a catastrophic
event (like a power failure).  Applications must still take care that
their files are sane even when backed by a journaled filesystem.


## Indexing

A unique feature of BeFS is support for queries on indexed [extended
attributes
(xattrs)](https://en.wikipedia.org/wiki/Extended_file_attributes).
Extended attributes are a per-file collection of key/value pairs.  A
major difference between Linux and BeFS xattrs is that BeFS xattrs are
typed.  In addition to strings, xattrs can directly represent floats,
doubles and ints.  For example - the BeOS's mail program stores the
content of each email individually as unique files in the filesystem.
Email headers (like from/to/subject/reply-to) are stored as xattrs on
the content file.  An email from Rob Pike in 1999 would have an xattr
key `MAIL:from` with the string value `pike@research.att.com`.
Extended attribute indexes are FS-global per-attribute
[B+trees](https://en.wikipedia.org/wiki/B%2B_tree), along with a query
interface and in-kernel parser.  A significant disadvantage seems to
be that (at least as of the time of writing) indexes are only updated
for attributes created or modified after the time of index creation.
The first time the email program is opened, it creates the indexes on
ensures the indexes are created - with a fresh BeOS install this isn't
practically a problem, but if the index is mistakenly deleted, there
isn't a generic way to re-index your email.  I'm happy to assume this
was solved/worked around in the last 15 years.

Additionally, the logarithmic-time search of the B+tree is only useful
for a subset of queries.  Many (most?) of the interesting BeFS queries
expressed in the book included wildcards or other regex-like features
that forced a full walk of the B+tree's leaves.  To be fair, the data
locality of this walk is certainly faster than visiting every inode on
the FS.

Another disadvantage is that indexes are global to the filesystem.
This makes sense as BeOS was designed for single-user workstations,
but it is interesting to think about how this could be adapted for
modern use on Linux or BSD servers.  However, with the rise of SQLite,
applications that desire indexing can statically build in a DB by
adding 2 files to their source directory, sidestepping portability
issues arising from depending on a particular filesystem.

Finally - the same B+trees are used for directory listings (just
without allowing duplicate names.


## Other filesystems

The exposition of other filesystems and performance comparisons were
interesting.  [Ext2](https://en.wikipedia.org/wiki/Ext2) is portrayed
as a fast but reckless filesystem, with
[XFS](https://en.wikipedia.org/wiki/XFS) as an advanced but slow
filesystem.  Since the time of publication ext2 has mutated into ext4,
grown many of the features of XFS (such as journaling, b-tree-like
directory indexes, and extents), and the two filesystems now perform
similarly in benchmarks.


## Random niceties

I particularly liked that in BeFS inode numbers are directly
translatable into disk blocks.  Starting with
[FFS](https://en.wikipedia.org/wiki/Unix_File_System), many
traditional Unix filesystems allocate chunks of inodes at a time in
fixed positions on disk.  BeFS's break from this enables them to store
inodes referenced in a directory directly after the blocks used to
store that directory's B+tree index, enabling the directory index +
contents to often be accessed as a single sequential IO operation with
[read-ahead](https://en.wikipedia.org/wiki/Readahead).

In order to support returning absolute paths of files from the results
of index queries, each inode stores an identifier that points to the
directory it resides in.  This enables easy absolute path creation,
but means that BeFS doesn't support hardlinks, the ability for
directory entries in 2 distinct directories to point directly to a
single inode.  An alternative would be for the indexes to store paths
to the files (effectively symlinks), however this would have a whole
range of negative consequences. Every time a file was moved or
renamed, every index would have to be updated, with a performance
decrease linear to the number of indexes defined.  It would
additionally mean that the B+tree implementation couldn't share as
much code between directories and indexes, or that a ton of spare
symlink inodes would have to be created.  In short, it would probably
be a disaster.  I suppose its comforting in a way that I can't see a
clearly better solution from my armchair.


## Wrapup

A very readable tome.  I feel I now have a much better grasp on the
high-level concepts of journaling, along with how B+trees are used to
implement directories.
