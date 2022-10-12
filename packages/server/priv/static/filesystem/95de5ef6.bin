\ COMMAS.F

\ Add thousands separator to a decimal numeric string

\ version: 2012-02-13

\ - decimal input string must include a decimal point
\ - output string resides in the Forth pictured numeric
\   output buffer

\ This code is PUBLIC DOMAIN. Use at your own risk.

[UNDEFINED] fs>comma [IF]
[UNDEFINED] is-digit [IF] include lib/istype.4th  [THEN]
[UNDEFINED] string/c [IF] include lib/cstring.4th [THEN]

char . value dp-char                   \ decimal point character
char , value 1000-char                 \ separator character

: s>comma                              ( a1 n1 -- n2)
  0 >r                                 \ setup counter
  begin
    dup                                \ end of string?
  while
    string/c dup is-digit dup          \ is it a digit?
    r@ 3 /mod 0<> swap 0= and and      \ should we add a 1000 separator?
    if 1000-char hold then             \ if so, add 1000 separator
    if r> 1+ >r then hold              \ increment counter
  repeat r> drop                       \ drop counter
[DEFINED] 4TH# [IF] drop [THEN]        \ 4tH expects a single number
;
                                       \ with a decimal point
: fs>comma                             ( a1 u1 -- a2 u2 )
  <#                                   \ setup number generation
  begin                                \ find decimal point
    dup                                \ end of string?
  while
    string/c dup hold dp-char =        \ decimal point found?
  until s>comma                        \ if not, continue
  #>
;
                                       \ without a decimal point
: ds>comma <# s>comma #> ;             ( a1 u1 -- a2 u2 )

[DEFINED] 4TH# [IF]
  hide s>comma
[THEN]
[THEN]

\ s" -123." fs>comma type cr
\ s" -1234.E-1000" fs>comma type cr
\ s" -123456789.4500" fs>comma type cr
\ s" +100000000.0000" fs>comma type cr
\ s" $10000000" ds>comma type cr
\ s" -INFINITY" fs>comma type cr
\ s" NANS(32767)" fs>comma type cr
\ s" !#$%'()*+-." fs>comma type cr
