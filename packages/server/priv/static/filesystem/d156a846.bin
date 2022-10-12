\ ANS Forth compatibility layer for RetroForth 9.2.9.
\ Neal Bridges, August 2006.  neal@quartus.net  http://quartus.net
\ 4tH version DOUBLE - Hans Bezemer, April 2007, 2020

[UNDEFINED] d+      [IF]
[UNDEFINED] 2over   [IF] include lib/anscore.4th  [THEN]
[UNDEFINED] highbit [IF] include lib/constant.4th [THEN]

0 constant u>d
-1 constant -s>d
aka drop d>u

: 0. 0 dup ;                           ( -- d)
: signs? xor highbit and ;             ( n1 n2 -- 0 | highbit )
: u< 2dup signs? if nip else - then 0< ;
: u> swap u< ;
: d+ >r rot over + dup >r u> if 1+ then r> swap r> + ;
: d2* 2dup d+ ;
: d10* 2dup d+ 2dup 2dup d+ 2dup d+ d+ ;
: dnegate over if 1+ swap negate swap then negate ;
: d- dnegate d+ ;
: d< d- nip 0< ;
: d+- 0< if dnegate then ;
: dabs dup d+- ;
: d2/ >r 2/ r@ 1 and if highbit or else lowbits and then r> 2/ ;
: du< rot 2dup = if 2drop u< else u> nip nip then ;
: d= d- or 0= ;
: d0< nip 0< ;
: d0= or 0= ;
: dmax 2over 2over d< if 2swap then 2drop ;
: dmin 2over 2over d< 0= if 2swap then 2drop ;
[THEN]
