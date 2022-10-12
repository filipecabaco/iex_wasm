\ 4tH library - Long date format conversion - Copyright 2013,2015 J.L. Bezemer
\ You can redistribute this file and/or modify it under
\ the terms of the GNU General Public License

\ Converts a large number of DD-MMM-YY(YY) variations to day, month, year
\ format, including the Common Log Format. It is geared for versatility and
\ correct conversion, NOT for catching format errors.

\ "Year first" is used by the US Army and Asian countries, "year last" is
\ used in the NCSA Common log format and most Western countries.

[UNDEFINED] log>date [IF]
[UNDEFINED] NULL     [IF] include lib/constant.4th [THEN]
[UNDEFINED] search   [IF] include lib/search.4th   [THEN]
[UNDEFINED] split>   [IF] include lib/tokenize.4th [THEN]
[UNDEFINED] is-digit [IF] include lib/istype.4th   [THEN]
[UNDEFINED] between  [IF] include lib/range.4th    [THEN]

31536000 constant s/year               \ seconds per year

:token _first split> 2nip  ;           \ execution token for begin of string
:token _last  split< 2drop ;           \ execution token for end of string

create (Month3)                        \ all 3 month abbreviations
  ," jan"     1 ,                      \ in English, Dutch, French and German
  ," feb"     2 ,                      \ some are written out in full, since
  ," fev"     2 ,                      \ the abbreviation is not a substring
  ," mrt"     3 ,                      \ of the full month
  ," mar"     3 ,
  ," maart"   3 ,
  ," apr"     4 ,
  ," avr"     4 ,
  ," mei"     5 ,
  ," mai"     5 ,
  ," may"     5 ,
  ," jun"     6 ,
  ," juin"    6 ,
  ," jul"     7 ,
  ," juil"    7 ,
  ," aug"     8 ,
  ," aou"     8 ,
  ," sep"     9 ,
  ," okt"    10 ,
  ," oct"    10 ,
  ," nov"    11 ,
  ," dec"    12 ,
  ," dez"    12 ,
  NULL ,                               \ end of table
does>                                  ( a1 n1 -- n2 f)
  >r begin                             \ save address
    2dup r@ @c null <>                 \ end of table reached?
  while                                \ if not, try to find
    r@ @c count search 0=              \ a month in the table above
  while                                \ if not found
    2drop r> 2 cells + >r              \ try the next entry
  repeat                               \ returned strings may not be the same!
  rot = -rot = or r> over 0= if cell+ @c then swap
;                                      \ return month if found (flag = true)

: (>date)                              ( a1 n1 xt1 xt2 -- d m y f)
  ['] is-type defer@ >r [: is-digit 0= ;] is is-type >r >r
  2dup r> execute number error?        \ save IS-TYPE behavior
  if                                   \ if the year is not a number
    r> drop true                       \ signal error
  else                                 \ correct 2 digit year, get day
    dup 100 < if time s/year / over < if 1900 + else 2000 + then then
    r> swap >r >r 2dup r> execute number dup 1 31 between
    if >r (Month3) r> -rot r> swap else r> 0<> then
  then                                 \ restore runtime behavior of IS-TYPE
  r> is is-type
;
                                       \ both return true on error
: log>date   _last _first (>date) ;    ( a1 n1 -- d m y f)
: asian>date _first _last (>date) ;    ( a1 n1 -- d m y f)

[DEFINED] 4TH# [IF]
  hide (Month3)
  hide (>date)
  hide _first
  hide _last
  hide s/year
[THEN]
[THEN]

\ s" 2sep60" log>date . . . . cr
\ s" 8. November 2003" log>date . . . . cr

