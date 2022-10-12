\ 4tH library - FLS FFS - Copyright 2011, 2017 J.L. Bezemer
\ You can redistribute this file and/or modify it under
\ the terms of the GNU General Public License

\ An implementation of the BSD ffs() and fls() functions.

\ Bits are numbered starting from 1, starting at the right-most (least
\ significant) bit. A return value of zero from any of these words means
\ that the argument was zero.

[UNDEFINED] firstbit [IF]
[UNDEFINED] highbit  [IF] include lib/constant.4th [THEN]

: firstbit                             ( n1 -- n2)
  dup if 1 swap begin dup 1 and 0= while swap 1+ swap 1 rshift repeat drop then
;

: lastbit                              ( n1 -- n2)
  dup if                               \ zero returns 0
    /cell char-bits * swap             \ start at last bit
    begin dup highbit and 0= while swap 1- swap 1 lshift repeat drop
  then                                 \ check high bit and decrement
;
[THEN]