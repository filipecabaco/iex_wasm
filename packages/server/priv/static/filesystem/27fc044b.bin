\ 4tH library - High speed FLS FFS - Copyright 2017 J.L. Bezemer
\ You can redistribute this file and/or modify it under
\ the terms of the GNU General Public License

\ An implementation of the BSD ffs() and fls() functions, 2 - 4 times
\ faster than the BITSET implementation.

\ Bits are numbered starting from 1, starting at the right-most (least
\ significant) bit. A return value of zero from any of these words means
\ that the argument was zero.

[UNDEFINED] firstbit [IF]

offset (msb)
  1 c, 2 c, 2 c, 3 c, 3 c, 3 c, 3 c, 4 c, 4 c, 4 c, 4 c, 4 c, 4 c, 4 c, 4 c,
  5 c, 5 c, 5 c, 5 c, 5 c, 5 c, 5 c, 5 c, 5 c, 5 c, 5 c, 5 c, 5 c, 5 c, 5 c,
  5 c, 6 c, 6 c, 6 c, 6 c, 6 c, 6 c, 6 c, 6 c, 6 c, 6 c, 6 c, 6 c, 6 c, 6 c,
  6 c, 6 c, 6 c, 6 c, 6 c, 6 c, 6 c, 6 c, 6 c, 6 c, 6 c, 6 c, 6 c, 6 c, 6 c,
  6 c, 6 c, 6 c, 7 c, 7 c, 7 c, 7 c, 7 c, 7 c, 7 c, 7 c, 7 c, 7 c, 7 c, 7 c,
  7 c, 7 c, 7 c, 7 c, 7 c, 7 c, 7 c, 7 c, 7 c, 7 c, 7 c, 7 c, 7 c, 7 c, 7 c,
  7 c, 7 c, 7 c, 7 c, 7 c, 7 c, 7 c, 7 c, 7 c, 7 c, 7 c, 7 c, 7 c, 7 c, 7 c,
  7 c, 7 c, 7 c, 7 c, 7 c, 7 c, 7 c, 7 c, 7 c, 7 c, 7 c, 7 c, 7 c, 7 c, 7 c,
  7 c, 7 c, 7 c, 7 c, 7 c, 7 c, 7 c, 8 c, 8 c, 8 c, 8 c, 8 c, 8 c, 8 c, 8 c,
  8 c, 8 c, 8 c, 8 c, 8 c, 8 c, 8 c, 8 c, 8 c, 8 c, 8 c, 8 c, 8 c, 8 c, 8 c,
  8 c, 8 c, 8 c, 8 c, 8 c, 8 c, 8 c, 8 c, 8 c, 8 c, 8 c, 8 c, 8 c, 8 c, 8 c,
  8 c, 8 c, 8 c, 8 c, 8 c, 8 c, 8 c, 8 c, 8 c, 8 c, 8 c, 8 c, 8 c, 8 c, 8 c,
  8 c, 8 c, 8 c, 8 c, 8 c, 8 c, 8 c, 8 c, 8 c, 8 c, 8 c, 8 c, 8 c, 8 c, 8 c,
  8 c, 8 c, 8 c, 8 c, 8 c, 8 c, 8 c, 8 c, 8 c, 8 c, 8 c, 8 c, 8 c, 8 c, 8 c,
  8 c, 8 c, 8 c, 8 c, 8 c, 8 c, 8 c, 8 c, 8 c, 8 c, 8 c, 8 c, 8 c, 8 c, 8 c,
  8 c, 8 c, 8 c, 8 c, 8 c, 8 c, 8 c, 8 c, 8 c, 8 c, 8 c, 8 c, 8 c, 8 c, 8 c,
  8 c, 8 c, 8 c, 8 c, 8 c, 8 c, 8 c, 8 c, 8 c, 8 c, 8 c, 8 c, 8 c, 8 c, 8 c,

offset (lsb)
  1 c, 2 c, 1 c, 3 c, 1 c, 2 c, 1 c, 4 c, 1 c, 2 c, 1 c, 3 c, 1 c, 2 c, 1 c,
  5 c, 1 c, 2 c, 1 c, 3 c, 1 c, 2 c, 1 c, 4 c, 1 c, 2 c, 1 c, 3 c, 1 c, 2 c,
  1 c, 6 c, 1 c, 2 c, 1 c, 3 c, 1 c, 2 c, 1 c, 4 c, 1 c, 2 c, 1 c, 3 c, 1 c,
  2 c, 1 c, 5 c, 1 c, 2 c, 1 c, 3 c, 1 c, 2 c, 1 c, 4 c, 1 c, 2 c, 1 c, 3 c,
  1 c, 2 c, 1 c, 7 c, 1 c, 2 c, 1 c, 3 c, 1 c, 2 c, 1 c, 4 c, 1 c, 2 c, 1 c,
  3 c, 1 c, 2 c, 1 c, 5 c, 1 c, 2 c, 1 c, 3 c, 1 c, 2 c, 1 c, 4 c, 1 c, 2 c,
  1 c, 3 c, 1 c, 2 c, 1 c, 6 c, 1 c, 2 c, 1 c, 3 c, 1 c, 2 c, 1 c, 4 c, 1 c,
  2 c, 1 c, 3 c, 1 c, 2 c, 1 c, 5 c, 1 c, 2 c, 1 c, 3 c, 1 c, 2 c, 1 c, 4 c,
  1 c, 2 c, 1 c, 3 c, 1 c, 2 c, 1 c, 8 c, 1 c, 2 c, 1 c, 3 c, 1 c, 2 c, 1 c,
  4 c, 1 c, 2 c, 1 c, 3 c, 1 c, 2 c, 1 c, 5 c, 1 c, 2 c, 1 c, 3 c, 1 c, 2 c,
  1 c, 4 c, 1 c, 2 c, 1 c, 3 c, 1 c, 2 c, 1 c, 6 c, 1 c, 2 c, 1 c, 3 c, 1 c,
  2 c, 1 c, 4 c, 1 c, 2 c, 1 c, 3 c, 1 c, 2 c, 1 c, 5 c, 1 c, 2 c, 1 c, 3 c,
  1 c, 2 c, 1 c, 4 c, 1 c, 2 c, 1 c, 3 c, 1 c, 2 c, 1 c, 7 c, 1 c, 2 c, 1 c,
  3 c, 1 c, 2 c, 1 c, 4 c, 1 c, 2 c, 1 c, 3 c, 1 c, 2 c, 1 c, 5 c, 1 c, 2 c,
  1 c, 3 c, 1 c, 2 c, 1 c, 4 c, 1 c, 2 c, 1 c, 3 c, 1 c, 2 c, 1 c, 6 c, 1 c,
  2 c, 1 c, 3 c, 1 c, 2 c, 1 c, 4 c, 1 c, 2 c, 1 c, 3 c, 1 c, 2 c, 1 c, 5 c,
  1 c, 2 c, 1 c, 3 c, 1 c, 2 c, 1 c, 4 c, 1 c, 2 c, 1 c, 3 c, 1 c, 2 c, 1 c,

: (msb@) 1- (msb) + nip ;              ( n shift byte -- bit)
: (lsb@) 1- (lsb) + nip ;              ( n shift byte -- bit)

: lastbit                              ( n1 -- n2)
  /cell 1- char-bits * over over rshift dup if (msb@) ;then
  drop char-bits - over over rshift 255 and dup if (msb@) ;then
  drop char-bits - over over rshift 255 and dup if (msb@) ;then
/cell 8 [=] [IF]
  drop char-bits - over over rshift 255 and dup if (msb@) ;then
  drop char-bits - over over rshift 255 and dup if (msb@) ;then
  drop char-bits - over over rshift 255 and dup if (msb@) ;then
  drop char-bits - over over rshift 255 and dup if (msb@) ;then
[THEN]
  drop char-bits - over 255 and dup if (msb@) ;then
  drop drop dup xor
;

: firstbit                             ( n1 -- n2)
  0 over 255 and dup if (lsb@) ;then
  drop char-bits + over over rshift 255 and dup if (lsb@) ;then
  drop char-bits + over over rshift 255 and dup if (lsb@) ;then
/cell 8 [=] [IF]
  drop char-bits + over over rshift 255 and dup if (lsb@) ;then
  drop char-bits + over over rshift 255 and dup if (lsb@) ;then
  drop char-bits + over over rshift 255 and dup if (lsb@) ;then
  drop char-bits + over over rshift 255 and dup if (lsb@) ;then
[THEN]
  drop char-bits + over over rshift dup if (lsb@) ;then
  drop drop dup xor
;

[DEFINED] 4TH# [IF]
  hide (lsb)
  hide (msb)
  hide (lsb@)
  hide (msb@)
[THEN]
[THEN]
