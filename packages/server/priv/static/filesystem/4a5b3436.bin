\ 4tH library - COMBSORT with different end - Copyright 2010 J.L. Bezemer
\ You can redistribute this file and/or modify it under
\ the terms of the GNU General Public License

[UNDEFINED] combsort  [IF]
[UNDEFINED] gnomesort+ [IF]
include lib/gno2sort.4th
[THEN]

: combsort                             ( a n --)
  dup begin                            ( a n g)
    10 13 */ tuck >r >r 0              ( a g 0)
    begin                              ( a g 0)
      over r@ <                        ( a g 0 f)
    while                              ( a g 0)
      rot >r over over r@ precedes     ( g 0 f)
      if over over r@ exchange then    ( g 0)
      r> rot 1+ rot 1+                 ( a g 0)
    repeat drop drop r> r>             ( a n g)
    dup 9 <                            ( a n g f)
  until drop gnomesort+                ( --)
;
[THEN]
