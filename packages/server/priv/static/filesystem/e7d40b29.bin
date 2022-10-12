\ 4tH library - FSIN FCOS - Copyright 2008,2009 J.L. Bezemer
\ You can redistribute this file and/or modify it under
\ the terms of the GNU General Public License

[UNDEFINED] fsin    [IF]
[UNDEFINED] pi      [IF] include lib/fpconst.4th [THEN]
[UNDEFINED] +taylor [IF] include lib/taylor.4th  [THEN]
                                       \ this word courtesy 
: >range                               \ Albert van der Horst
  pi fdup f+                           ( x pi2)
  fover fover f/                       ( x pi2 x/pi2)
  floor fover f*                       ( x pi2 mod)
  frot fswap f-                        ( pi2 mod)
  pi fover                             ( pi2 mod pi mod)
  f< if fswap f- else fnip then
;

: fsin 
  >range fdup >taylor                  ( x x2 x)
         6 -taylor                     ( x-3 x2 x3)
       120 +taylor                     ( x+5 x2 x5)
      5040 -taylor                     ( x-7 x2 x7)
    362880 +taylor                     ( x+9 x2 x9)
  39916800 -taylor                     ( x-11 x2 x11)
  fdrop fdrop                          ( x-11)
;

: fcos
  1 s>f fswap >range >taylor           ( 1 x2 1)
          2 -taylor                    ( 1-2 x2 x2)
         24 +taylor                    ( 1+4 x2 x4) 
        720 -taylor                    ( 1-6 x2 x6)
      40320 +taylor                    ( 1+8 x2 x8)
    3628800 -taylor                    ( 1-10 x2 x10)
  479001600 +taylor                    ( 1+12 x2 x12)
  fdrop fdrop                          ( 1+12)
;

: fsincos fdup fsin fswap fcos ;
: ftan fsincos f/ ;                    \ ftan = fsin / fcos

[DEFINED] 4TH# [IF] hide >range [THEN]
[THEN]
