\ Taken from:
\ http://www.thelearningpoint.net/computer-science/trees/binary-search-trees---c-program-source-code-and-documentation
\ Assumed to be in the public domain
\ 4tH translation - Copyright 2016 J.L. Bezemer
\ You can redistribute this file and/or modify it under
\ the terms of the GNU General Public License

[PRAGMA] printtree
include lib/bintree.4th

15 5 NULL insert-node 
14 -1 rot insert-node
13 3 rot insert-node
12 -14 rot insert-node
11 8 rot insert-node
10 10 rot insert-node
9 9 rot insert-node
8 6 rot insert-node
dup in-order cr
5 swap delete-node
-1 swap delete-node
dup in-order cr
dup ." Minimum element is: " find-min get-key . cr
dup ." Maximum element is: " find-max get-key . cr
." Looking for 8: " 8 over find-node NULL = if ." Not " then ." Found" cr
." Looking for 2: " 2 over find-node NULL = if ." Not " then ." Found" cr
destroy-tree

