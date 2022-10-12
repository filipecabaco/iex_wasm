\ -- super KISS generator --
\ Algorithm 2009 by George Marsaglia
\ Forth version by Marcel Hendrix, 2009
\ 4tH version by Hans Bezemer, 2009,2013

[UNDEFINED] kiss [IF]
[UNDEFINED] um* [IF] include lib/mixed.4th [THEN]
41790 constant ixmax
max-n constant max-rand

ixmax array q
variable indx
variable carry
variable xcng
variable xxs

: reset ( -- u )
  ixmax 0 ?do
    q i th @ 7010176 um* carry @ u>d d+ carry ! invert q i th !
  loop 1 indx ! q @
;

: cng xcng @ 69609 * 123 + dup xcng ! ;
: xs xxs @ dup 13 lshift xor dup 17 rshift xor dup 5 rshift xor dup xxs ! ;
: supr indx @ ixmax < if q indx @ th @ 1 indx +! else reset then ;
: kiss ( -- u ) supr cng + xs + ;
: initialize ixmax indx ! ixmax 0 ?do cng xs + q i th ! loop ;
: seed3! ( -- ) xxs ! xcng ! carry ! initialize ;
: randomize time xcng ! cng xxs ! xs carry ! initialize ;

[DEFINED] 4th# [IF]
  hide q
  hide ixmax
  hide indx
  hide carry
  hide xcng
  hide xxs
  hide reset
  hide initialize
[THEN]
[THEN]

\ 362436 1236789 521288629 seed3!
\ 0 1000000 over ?do drop kiss loop ." x  = " . cr

\           1  x= B754D5CD  x=-1219177011
\          10  x= 8DB4048B  x=-1917582197
\         100  x= 20FEE35D  x=  553575261
\        1000  x= C5BA67A7  x= -977639513
\       10000  x= 2229E08A  x=  573169802
\      100000  x= C2856C21  x=-1031443423
\     1000000  x= 16DA5756  x=  383407958
\    10000000  x= 1C3F1FB8  x=  473898936
\   100000000  x= 7C2EF719  x= 2083452697
\  1000000000  x= CC000AE2  x= -872412446
