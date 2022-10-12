\ 4tH library - ROW - Copyright 2007,2014 J.L. Bezemer
\ You can redistribute this file and/or modify it under
\ the terms of the GNU General Public License

\ Generic table-search routine

\ Parameters:  address of search key word
\              number of fields in table
\              address of table
\              value to search (string or integer)

\ Returns:     true flag if found
\              address of row
\              original value (string or integer)

\ TYPICAL USE:
\ ============
\ create mystable
\   ," Hello" 1 ,
\   ," Bye"   3 ,
\   ," Aloha" 4 ,
\   ," Doei"  5 ,
\   null ,

\ create myntable
\   0 , 1 ,
\   1 , 3 ,
\   2 , 5 ,
\   3 , 7 ,
\   4 , 9 ,
\   null ,

\ s" Aloha" mystable 2 string-key row . . type cr
\ s" Gutentag" mystable 2 string-key row . . type cr 

\ 2 myntable 2 num-key row . . . cr
\ 6 myntable 2 num-key row . . . cr


[UNDEFINED] ROW [IF]
[UNDEFINED] NULL [IF]
include lib/constant.4th
[THEN]

[UNDEFINED] COMPARE [IF]
include lib/compare.4th
[THEN]

defer key=

:token string-key >r 2dup r@ @c count compare 0= r> swap ;
:token num-key over over @c = ;

: row                                 ( x a1 n1 xt -- x a2 f)
  is key= >r                          ( x a)
  begin                               ( x a)
    dup @c NULL <> dup                ( x a f f)
  while                               ( x a f)
    drop key= dup 0=                  ( x a f -f)
  while                               ( x a f)
    drop r@ cells +                   ( x a)
  repeat                              ( x a)
[UNDEFINED] 4TH# [IF] then [THEN]
  r> drop                             ( x a f)
;

[DEFINED] 4TH# [IF]
  hide key=
[THEN]
[THEN]
