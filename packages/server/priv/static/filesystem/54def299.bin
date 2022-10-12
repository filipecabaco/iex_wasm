\ 4tH library - Encode Roman numerals - Copyright 2012 J.L. Bezemer
\ You can redistribute this file and/or modify it under
\ the terms of the GNU General Public License

[UNDEFINED] >roman [IF]
offset (romans) 0 c, 1 c, 5 c, 21 c, 9 c, 2 c, 6 c, 22 c, 86 c, 13 c,

: roman-digit                          ( a1 n1 a2 n2 -- a3)
  drop >r (romans)                     \ decode format
  begin dup while tuck 4 mod 1- chars r@ + c@ over c! char+ swap 4 / repeat
  r> drop drop                         \ encode roman digit
;

: (split) swap >r /mod r> swap ;       ( a1 n1 a2 n2 -- a1 n3 a2 n4)

: >roman                               ( n1 a -- a n2)
  10000 mod tuck                       \ make sure it "fits"
  1000 (split) s" M  " roman-digit 100 (split) s" CDM" roman-digit
  10 (split) s" XLC" roman-digit 1 (split) s" IVX" roman-digit nip over -
;

[DEFINED] 4TH# [IF]
  hide (romans)
  hide roman-digit
  hide (split)
[THEN]
[THEN]

\ 16 string a 1888 a >roman type cr depth .