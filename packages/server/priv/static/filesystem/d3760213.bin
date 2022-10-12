\ 4tH library - Java randomizer - Copyright 2017 J.L. Bezemer
\ You can redistribute this file and/or modify it under
\ the terms of the GNU General Public License

[UNDEFINED] random [IF]
/cell 4 [=]        [IF]                \ 32bit version
[UNDEFINED] dand   [IF] include lib/dblbin.4th [THEN]
[UNDEFINED] d*     [IF] include lib/mixed.4th  [THEN]

2 array seed                           \ seed variable

: (magic) -554899859 5 ;               ( -- d)
: (mask) -1 65535 dand ;               ( d1 -- d2)

: random                               ( n1 -- n2)
  48 swap - seed 2@ (magic) d* 11 u>d d+ (mask) 2dup seed 2! rot drshift drop
;
                                       ( n --)
: seed! u>d (magic) dxor (mask) seed 2! ;

[ELSE]                                 \ 64bit version
[hex]
FFFFFFFFFFFF constant (mask)
5DEECE66D    constant (magic)
[decimal]

variable seed                          \ seed variable
                                       ( n1 -- n2)
: random 48 swap - seed @ (magic) * 11 + (mask) and dup seed ! swap rshift ;
: seed! (magic) xor (mask) and seed ! ;
[THEN]                                 ( n --)

: randomize time seed! ;               ( --)

[DEFINED] 4TH# [IF]
  hide (magic)
  hide (mask)
[THEN]
[THEN]

\ 1 seed! 100 0 ?do 31 random . loop
