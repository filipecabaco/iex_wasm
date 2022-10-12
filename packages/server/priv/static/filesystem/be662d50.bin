\ 4tH demo - Key/value leaves - Copyright 2015 J.L. Bezemer
\ You can redistribute this file and/or modify it under
\ the terms of the GNU General Public License

include lib/leaf.4th

variable root                          \ create a root for the leaves
NULL root !                            \ initialize it (important!)

10 100 root l.append                   \ now append a bunch of value/key pairs
11 101 root l.append
12 102 root l.append
13 103 root l.append
14 104 root l.append
                                       \ delete one of them
101 root l.delete abort" Failed to delete"
15 105 104 root l.before l.insert      \ insert a new value/key before key 104

root @ begin                           \ now list all leaves
  dup NULL <>                          \ until the final one is found
while
  dup l.key .                          \ show the key
  dup l.get . cr                       \ show the value
  l.next                               \ jump to the next leaf
repeat drop                            \ drop the address

cr depth .                             \ are we clean?