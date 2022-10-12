\ 4tH library - ANS counted strings - Copyright 2012, 2015 J.L. Bezemer
\ You can redistribute this file and/or modify it under
\ the terms of the GNU General Public License

[UNDEFINED] ccount [IF]
: ccount dup char+ swap c@ ;
: cplace over >r rot over 1+ r> cmove c! ;
: +cplace 2dup 2>r dup c@ char+ + swap cmove 2r> dup c@ rot + swap c! ;
[THEN]

\ 32 string Hello
\ s" Hello" Hello cplace s"  world!" Hello +cplace
\ Hello ccount type cr depth .