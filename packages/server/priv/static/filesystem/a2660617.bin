\ 4tH library - SLICE - Copyright 2003,2007 J.L. Bezemer
\ You can redistribute this file and/or modify it under
\ the terms of the GNU General Public License

\ slice addr/count string from position n2 to n3 and
\ leave an addr/count string result

\ cut n3 characters from addr/count string from position n2 and
\ leave an addr/count string result

[UNDEFINED] slice [IF]
: slice                ( a1 n1 n2 n3 -- a2 n4)
  1+ rot min >r        \ calculate upper limit
  swap over chars +    \ calculate address a2
  r> rot -             \ calculate count n4
;
                       ( a1 n1 n2 n3 -- a2 n4)
: /substring 1- over + slice ;

: cut                  ( a1 n1 n2 n3 -- a2 n4)
  swap over over + swap >r >r over swap - swap
  >r over r> r@ - over r> chars + rot r> chars +
  rot cmove
;
[THEN]
