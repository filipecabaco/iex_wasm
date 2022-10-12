\ 4tH library - To date conversion - Copyright 2012,2015 J.L. Bezemer
\ You can redistribute this file and/or modify it under
\ the terms of the GNU General Public License

[UNDEFINED] n>date [IF]
[UNDEFINED] is-digit [IF] include lib/istype.4th   [THEN]
[UNDEFINED] split<   [IF] include lib/tokenize.4th [THEN]
[UNDEFINED] row      [IF] include lib/row.4th      [THEN]

27 constant _NO_DATE_                  \ cannot be a valid date
31536000 constant s/year               \ seconds per year

: (1-1-1970) 1 dup 1970 ;              \ 1st Januari 1970
: d-m-y swap rot ;                     \ swap order on stack for
: m-d-y rot ;                          \ various date formats
: y-m-d ;
: y-d-m rot swap ;

create date-order?
[DEFINED] forceamericandate
[IF]
   0 , ' m-d-y ,
   1 , ' m-d-y ,
   2 , ' m-d-y ,                       \ the flag has three digits:
[ELSE]
   0 , ' d-m-y ,                       \ 0 = 0 < x < 13
   1 , ' d-m-y ,                       \ 1 = > 12
   2 , ' d-m-y ,                       \ 2 = > 31
[THEN]
   3 , ' m-d-y ,                       \ e.g. 210 = (9*2) + (3*1) + 0 = 21
   4 , ' m-d-y ,                       \ this table selects the appropriate
   5 , ' m-d-y ,                       \ word to reorder the stack
   9 , ' d-m-y ,
  10 , ' d-m-y ,
  11 , ' d-m-y ,
  12 , ' y-d-m ,
  18 , ' y-m-d ,
  19 , ' y-m-d ,
  21 , ' y-d-m ,
  NULL ,
does> 2 num-key row ;                  ( n -- n x f)
                                       \ reorder date components
: reorder-date                         ( n1 n2 n3 n4 x f -- d m y)
  if nip cell+ @c execute else drop drop drop drop drop (1-1-1970) then
  dup 100 < if time s/year / over < if 1900 + else 2000 + then then
;
                                       \ evaluate a date component
: (nn)                                 ( a1 n1 -- n2 n3)
  dup 0>                               \ if it is a valid date part
  if 0 over 12 > if 1+ over 31 > if 1+ then then else _NO_DATE_ then swap
;
                                       \ evaluate an encoded date
: analyse-date                         ( n1 n2 n3 -- n1 n2 n3 n4)
  (nn) >r 9 * swap (nn) >r 3 * + swap (nn) >r + r> r> rot r> swap
;
                                       \ convert number to date
: n>date                               ( n -- d m y)
  dup 9999 >                           \ e.g. 010101
  if dup 999999 >                      \ e.g. 01012001
    if dup 9999999 >                   \ e.g. 11012001
      if                               \ try "year comes first" (ISO 8601)
        dup >r 100 /mod 100 /mod analyse-date date-order? dup
        if r> drop reorder-date exit then
        drop drop drop drop drop drop r> 10000 /mod 100 /mod
      else 10000 /mod 100 /mod         \ else try "year comes last"
      then                             \ if leading zero, "year comes last"
    else 100 /mod 100 /mod             \ this one has a two digit year
    then analyse-date date-order? reorder-date
  else drop (1-1-1970)                 \ can't be a valid date
  then
;
                                       \ convert string to date
: s>date                               ( a1 n1 -- d m y)
  ['] is-type defer@ >r [: is-digit 0= ;] is is-type
  split< dup                           \ split first part
  if                                   \ is there anything left to split?
    1- split< dup                      \ adjust remaining string and repeat
    if                                 \ is there anything left to split?
      1- number (nn) >r 9 * >r number (nn) >r 3 *  >r number (nn)
      r> rot + r> r> rot + r> swap date-order? reorder-date
      r> is is-type exit               \ restore deferred word
    else                               \ null string?
      2drop                            \ drop the part split
    then                               \ drop remaining parts, 1/1/1970
  then 2drop 2drop (1-1-1970) r> is is-type
;

[DEFINED] 4TH# [IF]
  hide d-m-y
  hide m-d-y
  hide y-m-d
  hide y-d-m
  hide _NO_DATE_
  hide reorder-date
  hide analyse-date
  hide date-order?
  hide (nn)
  hide s/year
[THEN]
[THEN]
