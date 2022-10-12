\ 4tH library - FSIN FCOS ZEN - Copyright 2009 J.L. Bezemer
\ You can redistribute this file and/or modify it under
\ the terms of the GNU General Public License

[UNDEFINED] fsin [IF]
[UNDEFINED] +taylor [IF] include lib/zentaylr.4th [THEN]
[UNDEFINED] floor   [IF] include lib/zenfloor.4th [THEN]
                                       \ this word courtesy 
: >range                               \ Albert van der Horst
  314159265 -8 2dup f+                 ( x pi2)
  2over 2over f/                       ( x pi2 x/pi2)
  floor 2over f*                       ( x pi2 mod)
  2rot 2swap f-                        ( pi2 mod)
  314159265 -8 2over                   ( pi2 mod pi mod)
  f< if 2swap f- else 2swap 2drop then
;

: fsin 
  >range 2dup >taylor                  ( x x2 x)
         6 -taylor                     ( x-3 x2 x3)
       120 +taylor                     ( x+5 x2 x5)
      5040 -taylor                     ( x-7 x2 x7)
    362880 +taylor                     ( x+9 x2 x9)
  39916800 -taylor                     ( x-11 x2 x11)
  2drop 2drop                          ( x-11)
;

: fcos
  1 s>f 2swap >range >taylor           ( 1 x2 1)
          2 -taylor                    ( 1-2 x2 x2)
         24 +taylor                    ( 1+4 x2 x4) 
        720 -taylor                    ( 1-6 x2 x6)
      40320 +taylor                    ( 1+8 x2 x8)
    3628800 -taylor                    ( 1-10 x2 x10)
  479001600 +taylor                    ( 1+12 x2 x12)
  2drop 2drop                          ( 1+12)
;

: fsincos 2dup fsin 2swap fcos ;
: ftan fsincos f/ ;                    \ ftan = fsin / fcos

[DEFINED] 4TH# [IF] hide >range [THEN]
[THEN]