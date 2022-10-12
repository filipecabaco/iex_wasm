\ 4tH library - TRIPLE SHARP - Copyright 2015 J.L. Bezemer
\ You can redistribute this file and/or modify it under
\ the terms of the GNU General Public License

[UNDEFINED] tsign   [IF]
[UNDEFINED] tu/mod  [IF] [NEEDS lib/triple.4th]   [THEN]
[UNDEFINED] digit>c [IF] [NEEDS lib/digit.4th]    [THEN]
[UNDEFINED] 3drop   [IF] [NEEDS lib/3dup3rot.4th] [THEN]

/hold 3 * constant /thold
/thold string tholdbuf
tholdbuf /thold + constant tholdend
variable hld

: thold hld -1 over +! @ c! ;
: <t# tholdend hld ! ;
: t#> 3drop hld @ tholdend over - ;
: tsign >r >r >r 0< if [char] - thold then r> r> r> ;
: t# base @ tu/mod >r >r >r digit>c thold r> r> r> ;
: t#s begin t# 3dup t0= until ;
: (tsigned) dup >r -rot r> tabs ;

[DEFINED] 4TH# [IF]
  hide hld
  hide tholdbuf
  hide tholdend
[THEN]
[THEN]

\ -1 -1 15 (tsigned) <t# t#s tsign char $ thold t#> type cr depth .
\ Gives: $295147905179352825855
