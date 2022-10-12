\ 4tH library - LCG randomizers - Copyright 2017 J.L. Bezemer
\ You can redistribute this file and/or modify it under
\ the terms of the GNU General Public License

[UNDEFINED] random [IF]
[UNDEFINED] um/mod [IF] include lib/mixed.4th [THEN] [HEX]

defer random                          \ link your own randomizer
variable seed                         \ seed variable
0 value max-rand                      \ maximum random number

: {zero} ;                            \ zero is a valid seed
: {non-zero} dup 0= if 1+ then ;      \ zero is not a valid seed

: lcg                                 ( x m b a -- n)
  seed @ um* rot u>d d+ rot dup to max-rand um/mod drop
  swap execute dup seed !
;

: lehmer ['] {zero} 7FFFFFFB +UL 0 10A860C1 lcg ;
: simscript ['] {non-zero} 7FFFFFFF 0 259287D0 lcg ;
: epm2 ['] {zero} 7FFFFF07 0 9EF4 lcg ;
: randomize time seed ! ;             ( -- )

[DECIMAL] [DEFINED] 4TH# [IF]
  hide {zero}
  hide {non-zero}
[THEN]
[THEN]
