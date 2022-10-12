\ 4tH library - S>ASCII7 - Copyright 2004,2016 J.L. Bezemer
\ You can redistribute this file and/or modify it under
\ the terms of the GNU General Public License

[UNDEFINED] s>ascii7 [IF]
[UNDEFINED] is-print [IF] [NEEDS lib/istype.4th] [THEN]
                                       \ strip all foreign chars
: s>ascii7                             ( a n -- a n)
  2dup bounds ?do
    i c@ dup is-print 0=               \ if printable, ignore
    if dup is-white if bl i c! else [char] ^ i c! then then drop
  loop                                 \ else replace character
;
                                       \ repacks buffer
: s>print                              ( a1 n1 -- a1 n2)
  over + over tuck ?do i c@ is-print if i c@ over c! char+ then loop over -
;
[THEN]
