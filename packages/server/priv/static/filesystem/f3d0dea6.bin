\ 4tH library - UPPER/LOWER CASE - Copyright 2003,2013 J.L. Bezemer
\ You can redistribute this file and/or modify it under
\ the terms of the GNU General Public License

[UNDEFINED] is-lower [IF]
[needs lib/istype.4th]
[THEN]

[UNDEFINED] s>upper [IF]
defer case?

\ upper- lower-case conversions (character)
: ?case if bl xor then ;
: char>upper dup is-lower ?case ;    ( c1 -- c2)
: char>lower dup is-upper ?case ;    ( c1 -- c2)

\ upper- lower-case conversions (string)
: (case)
  is case? 2dup bounds ?do i c@ dup case? if bl xor i c! else drop then loop
;

: s>upper ['] is-lower (case) ;  ( a n -- a n)
: s>lower ['] is-upper (case) ;  ( a n -- a n)

[DEFINED] 4TH# [IF]
  hide case?
  hide ?case
  hide (case)
[THEN]
[THEN]

