\ 4tH library - FERF - Copyright 2009, 2012 J.L. Bezemer
\ You can redistribute this file and/or modify it under
\ the terms of the GNU General Public License

[UNDEFINED] ferf    [IF]
[UNDEFINED] pi      [IF] include lib/fpconst.4th [THEN]
[UNDEFINED] >taylor [IF] include lib/taylor.4th  [THEN]

create (a)
  705230784 ,
  422820123 ,
   92705272 ,
    1520143 ,
    2765672 ,
     430638 ,
does> swap cells + @c s>f 1000000000 s>f f/ 10 s>f f/ ;

: ferf
  fdup fdup fabs 1378 s>f 1000 s>f f/ f<
  if
    >taylor
            3 -taylor
           10 +taylor
           42 -taylor
          216 +taylor
         1320 -taylor
         9360 +taylor
        75600 -taylor
       685440 +taylor
      6894720 -taylor
     76204800 +taylor
    918086400 -taylor
    fdrop fdrop
    2 s>f pi fsqrt f/ f*
  else
    f0> >r fabs fdup 1 s>f
    6 0 do fover i (a) f* f+ frot frot fover f* frot loop
    fdup f* fdup f* fdup f* fdup f* 1 s>f fswap f/ -1 s>f f+
    fswap fdrop fswap fdrop r> if fnegate then
  then
;

[DEFINED] 4TH# [IF]
  hide (a)
[THEN]
[THEN]

\ : ferf-test
\  fclear 10 set-precision
\  -2 s>f begin
\    fdup 2 s>f F<
\  while
\    fdup fdup f. ferf f. cr
\    s" 0.05" s>float f+
\  repeat fdrop fdepth . depth .
\ ; ferf-test