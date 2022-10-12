\ 4tH library - ZEN FPOW - Copyright 2021 J.L. Bezemer
\ You can redistribute this file and/or modify it under
\ the terms of the GNU General Public License

[UNDEFINED] fpow  [IF]
[UNDEFINED] ZenFP [IF] [ABORT] [THEN]  \ ONLY works with Zen FP library
: fpow                                 ( f1 n -- f2)
  dup 1 = if drop ;then                \ x^1 = x
  dup if                               \ if exponent > 0
    >r 2dup r@ 2/ recurse 2dup f* r> 1 and if f* ;then 2nip
  ;then drop 2drop 1 s>f               \ x^0 = 1
;
[THEN]

