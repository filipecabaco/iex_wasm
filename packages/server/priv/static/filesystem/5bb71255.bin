\ 4tH library - GNOMESORT - Copyright 2010,2011 J.L. Bezemer
\ You can redistribute this file and/or modify it under
\ the terms of the GNU General Public License

[UNDEFINED] gnomesort [IF]
[UNDEFINED] precedes  [IF]
defer precedes                         ( n1 n2 a -- f)
[THEN]
[UNDEFINED] exchange  [IF]
defer exchange                         ( n1 n2 a --)
[THEN]

: gnomesort                   ( a n)
  swap >r 1                   ( n c)
  begin                       ( n c)
    over over >               ( n c f)
  while                       ( n c)
    dup if                    ( n c)
      dup dup 1- over over r@ precedes
      if r@ exchange 1- else drop drop 1+ then
    else 1+ then              ( n c)
  repeat drop drop r> drop    ( --)
;
[THEN]