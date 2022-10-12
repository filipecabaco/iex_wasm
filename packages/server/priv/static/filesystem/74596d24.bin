\ 4tH library - SEDOL - Copyright 2013 J.L. Bezemer
\ You can redistribute this file and/or modify it under
\ the terms of the GNU General Public License

\ SEDOL stands for Stock Exchange Daily Official List, a list of security
\ identifiers used in the United Kingdom and Ireland for clearing purposes.
\ The numbers are assigned by the London Stock Exchange, on request by the
\ security issuer. SEDOLs serve as the National Securities Identifying Number
\ for all securities issued in the United Kingdom and are therefore part of
\ the security's ISIN as well. SEDOLs are seven characters in length,
\ consisting of two parts: a six-place alphanumeric code and a trailing check
\ digit. 

[UNDEFINED] sedol? [IF] 
[UNDEFINED] digit? [IF] include lib/digit.4th [THEN]

create (weight) 1 , 3 , 1 , 7 , 3 , 9 , does> swap cells + @c * + ;
                                       \ check digit for 6 digit number
: sedol#                               ( a n -- a n c)
  6 min tuck 0 tuck
  do over i + c@ digit? if i (weight) else drop leave then loop
  10 mod 10 swap - 10 mod [char] 0 + rot swap
;
                                       \ check seven digit sedol
: sedol?                               ( a n -- f)
  dup 6 > if 1- 2dup chars + c@ >r sedol# r> = if 6 = nip exit then then
  2drop false                          \ check length and SEDOL checksum
;
[DEFINED] 4TH# [IF]
  hide (weight)
[THEN]
[THEN]




