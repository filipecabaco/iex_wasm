\ 4tH library - ZEN FP I/O - Copyright 2009, 2020 J.L. Bezemer
\ You can redistribute this file and/or modify it under
\ the terms of the GNU General Public License
\ include lib/zenfloat.4th

[UNDEFINED] >float  [IF]
[UNDEFINED] ZenFP   [IF] [ABORT] [THEN] \ ONLY works with Zen FP library
[UNDEFINED] E.FPERR [IF] include lib/throw.4th [THEN]

max-n 10 / constant (limit)            \ cell boundary

: (convert)                            ( a1 n1 n2 -- a2 n3 n4 n5)
  0 >r >r                              \ setup exponent, save accu
  begin
    over over                          \ is there any string left?
  while                                \ if so, get digit and compare
    c@ [char] 0 - dup 0< over 9 > or 0= r@ (limit) < and
  while                                \ don't cross the cell boundary
    r> 10 * + r> 1+ >r >r chop         \ shift left, increment exponent
  repeat drop r> r>                    \ drop value, get accu and exponent
;
                                       \ returns an exponent
: (+exp)                               ( a1 n1 -- a2 n2 n3)
  0 >r begin dup >r 0 (convert) nip over r> < while r> + >r repeat drop r>
;                                      \ loop until string no longer changes

: (sign!) if negate then ;             ( n bool -- -n|n)
: (sign?) over c@ [char] - = dup >r if chop then r> ;
: (frac) chop rot >r rot (convert) negate r> + 2swap (+exp) drop ;
: (exp) chop (sign?) >r 0 (convert) drop r> (sign!) >r rot r> + -rot ;

: >float                               ( a n -- f bool|-bool)
  -trailing dup if (sign?) -rot else swap true exit then
  dup if 0 (convert) dup xor 2swap else 2drop drop false exit then
  dup if (+exp) swap >r swap >r + r> r> then
  dup if over c@ [char] . = if (frac) then then
  dup if over c@ bl or [char] e = if (exp) then then
  nip if 2drop drop false exit then    \ if string left, no floating point
  >r swap (sign!) r> true              \ apply sign, signal ok
;
                                       ( a n -- f)
: s>float >float 0= E.FPERR throw" Bad float" ;
                                       \ print an FP number in fixed format
: f.                                   ( f --)
  over 0= if dup xor then              \ fix zero
  >r dup abs s>d                       \ save exponent
  <# r@ 0 max 0 ?do [char] 0 hold loop
  r@ 0< if                             \ save any trailing zeros needed
    r@ negate 0 max 0 ?do # loop [char] . hold
  then                                 \ generate actual number
  r> drop #s sign #> type space        \ and print the whole number
;

[DEFINED] 4TH# [IF]
  hide (limit)
  hide (convert)
  hide (sign?)
  hide (sign!)
  hide (frac)
  hide (exp)
  hide (+exp)
[THEN]
[THEN]
