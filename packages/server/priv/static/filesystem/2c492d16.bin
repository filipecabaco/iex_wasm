\ 4tH library - Perrin sequence - Copyright 2011 J.L. Bezemer
\ You can redistribute this file and/or modify it under
\ the terms of the GNU General Public License (http://oeis.org/A001608)

[UNDEFINED] perrin [IF]
: perrin                               ( +n1 -- +n2)
  dup if 1-
    dup if 1-
      dup if dup recurse swap 1- recurse else 2 then
    else dup then
  else 3 then +
;
[THEN]

\ 50 0 do i perrin . loop cr depth .