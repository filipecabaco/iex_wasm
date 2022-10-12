\ 4tH library - Unbiased randomizer - Copyright 2017 J.L. Bezemer
\ You can redistribute this file and/or modify it under
\ the terms of the GNU General Public License

[UNDEFINED] unbiased [IF]
[UNDEFINED] +UL      [IF] include lib/constant.4th [THEN]

[hex] 7FFFFFFF +UL constant max-rand [decimal]
variable seed

: xorshift32                           ( -- n)
  seed @ dup 13 lshift xor dup 17 rshift xor dup 5 lshift xor
  max-rand and dup seed !
;

: unbiased                             ( -- 0|1)
  begin xorshift32 dup xorshift32 xor 1 and 0= while drop repeat 1 and
;

: randomize time seed ! ;              ( -- )
[THEN]

\ 1 seed ! 100 0 do unbiased . loop cr depth .