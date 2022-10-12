\ 4tH library - Decode Roman numerals - Copyright 2012,2013 J.L. Bezemer
\ You can redistribute this file and/or modify it under
\ the terms of the GNU General Public License

[UNDEFINED] >arabic [IF]
[UNDEFINED] chop    [IF] : chop 1 /string ; [THEN]

create (arabic)
  1000 128 * char M + ,
   500 128 * char D + ,
   100 128 * char C + ,
    50 128 * char L + ,
    10 128 * char X + ,
     5 128 * char V + ,
     1 128 * char I + ,
does>                                  ( c -- n n)
  7 cells bounds do                    \ roman digit in first seven bits
    i @c over over 127 and = if nip 7 rshift leave else drop then
  1 cells +loop dup
;

: >arabic                              ( a1 n1 -- n2)
  0 dup >r >r                          \ save previous digit and total
  begin
    over over                          \ anything to convert?
  while
    c@ dup (arabic) rot <>             \ valid roman digit?
  while                                \ convert digit, take 4 and 9 into account
    r> over r> over over > if -2 * + else drop then + swap >r >r chop
  repeat [UNDEFINED] 4TH# [IF] then [THEN] drop 2drop r> r> drop
;

[DEFINED] 4TH# [IF] hide (arabic) [THEN]
[THEN]

\ s" MCMLXXXIV" >arabic . depth .