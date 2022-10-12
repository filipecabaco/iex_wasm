\ 4tH library - FLN FLOG ZEN - Copyright 2008, 2021 J.L. Bezemer
\ You can redistribute this file and/or modify it under
\ the terms of the GNU General Public License
\ Ported to ZEN float by David Johnson, 2009
\ include lib/zenfloat.4th

[UNDEFINED] fln   [IF]
[UNDEFINED] ZenFP [IF] [ABORT] [THEN]  \ ONLY works with Zen FP library
[UNDEFINED] e     [IF] include lib/zenconst.4th [THEN]
                                       \ much better accuracy in 64-bit
/cell 4 - [IF] -19 [ELSE] -9 [THEN] constant (^eps)
                                       \ 64bit and 32bit precision epsilon
FLOAT array epsilon 1 (^eps) latest 2! \ set epsilon
FLOAT array lbase

: integer
  >r begin 2dup 1 s>f f< while lbase 2@ f* r> 1- >r repeat
  begin 2dup lbase 2@ f< 0= while lbase 2@ f/ r> 1+ >r repeat r>
;

: fraction
  >r 0 s>f 5 -1 2rot 2dup f*
  begin
    2over epsilon 2@ 2swap f<
  while
    2dup lbase 2@ f< 0=
    if 2swap 2rot 2over f+ 2swap 2rot lbase 2@ f/ then
    2swap 2 s>f f/ 2swap 2dup f*
  repeat 2drop 2drop r>
;

: (log)
  lbase 2! 2dup f0> 0= E.FPERR throw" Invalid float"
  0 integer fraction s>f f+
;

: fln e (log) ;
: flog 10 s>f (log) ;

[DEFINED] 4TH# [IF]
  hide integer
  hide epsilon
  hide lbase
  hide fraction
  hide (^eps)
[THEN]
[THEN]
