\ 4tH library - Fast >FLOAT - Copyright 2020 J.L. Bezemer
\ You can redistribute this file and/or modify it under
\ the terms of the GNU General Public License

\ Note this although implementation is significantly faster than others,
\ it is NOT completely ANS-Forth compliant

[UNDEFINED] >float  [IF]
[UNDEFINED] fpow    [IF] include lib/fpow.4th  [THEN]
[UNDEFINED] E.FPERR [IF] include lib/throw.4th [THEN]

2 array (limit)                        \ maximum double number size

: (convert)                            ( d1 a1 n1 -- d2 a2 n3 exp)
  0 >r begin                           \ put exponent on return stack
    dup                                \ check the length
  while                                \ as long as there's some string left
    over c@ [char] 0 - 10 u<           \ is it a figure
  while
    2over (limit) 2@ du<               \ is it within limits
  while
    r> 1+ >r over c@ [char] 0 - >r     \ increment exponent, shift accu
    2swap d10* r> u>d d+ 2swap chop    \ add figure to it and chop string
  repeat r>                            \ retrieve exponent
;
                                       ( a1 n1 -- a2 n2 f)
: (sign?) over c@ [char] - = dup >r if chop then r> ;

: (+exp)                               ( a1 n1 -- a2 n2 n3)
  0 >r begin                           \ put exponent on return stack
    dup >r 0. 2swap (convert) >r 2nip r> over r> < 
  while                                \ loop until string no longer changes
    r> + >r                            \ add to exponent
  repeat drop r>                       \ get expontent from stack
;
                                       ( a1 n1 -- a2 n2 e)
: (exp) chop (sign?) >r 0. 2swap (convert) drop 2swap d>u r> if negate then ;
: (frac) >r chop (convert) negate r> + >r (+exp) drop r> ;
                                       ( d1 a1 n1 e1 -- d2 a2 n2 e2)
: >float                               ( a n -- f bool|-bool)
  0 invert max-n 10 mu/mod (limit) 2! drop
  -trailing dup unless nip s>f true ;then (sign?) >r
  dup unless rdrop 2drop false ;then 0. 2swap (convert) >zero >r
  dup if (+exp) r> + >r then           \ collect surplus figures as exponent
  dup if over c@ [char] . = if r> (frac) >r then then
  dup if over c@ bl or [char] e = if (exp) r> + >r then then
  nip if 2drop rdrop rdrop false ;then \ any characters left is a fail
  d>f 10 s>f r@ abs fpow r> 0< if f/ else f* then r> if fnegate then true
;                                      \ apply sign, signal ok
                                       ( a n -- f)
: s>float >float 0= E.FPERR throw" Bad float" ;

[DEFINED] 4TH# [IF]
  hide (limit)
  hide (sign?)
  hide (+exp)
  hide (exp)
  hide (frac)
[THEN]
[THEN]

