\ 4tH library - ANS FACILITY - Copyright 2003,2012 J.L. Bezemer
\ You can redistribute this file and/or modify it under
\ the terms of the GNU General Public License

[UNDEFINED] time&date [IF]
VARIABLE da VARIABLE mo VARIABLE yr

2440588 1721119 - +constant adjust

: TIME&DATE time 86400 /mod >r 3600 /mod >r 60 /mod r> r> adjust
  4 * 1- dup 146097 / dup yr ! 146097 * - 2/ 2/ 4 * 3 +
  1461 /mod SWAP 4 + 4 / 5 * 3 - 153 /MOD mo ! 5 + 5 / da ! yr @ 100
  * + yr ! mo @ 10 < IF 3 mo +! ELSE -9 mo +! 1 yr +! THEN da @ mo
  @ yr @ ;

\ a very crude implementation of MS
: MS 1000 / 1+ >r time begin time over - r@ > until r> drop drop ;

[DEFINED] 4TH# [IF]
  hide adjust
  hide da
  hide mo
  hide yr
[THEN]
[THEN]
