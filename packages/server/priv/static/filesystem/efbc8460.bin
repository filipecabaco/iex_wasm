\ 4tH library - 3-character month format - Copyright 2012,2013 J.L. Bezemer
\ You can redistribute this file and/or modify it under
\ the terms of the GNU General Public License

[UNDEFINED] dd-mmm-yyyy [IF]
: (date) swap 1- cells + @c count ;

create (EN-date) 
  ," Jan" ," Feb" ," Mar" ," Apr"
  ," May" ," Jun" ," Jul" ," Aug"
  ," Sep" ," Oct" ," Nov" ," Dec"
does> (date) ; ' (EN-date) constant EN-date

create (FR-date) 
  ," Jan" ," Fev" ," Mar" ," Avr"
  ," Mai" ," Jun" ," Jul" ," Aou"
  ," Sep" ," Oct" ," Nov" ," Dec"
does> (date) ; ' (FR-date) constant FR-date

create (NL-date)
  ," jan" ," feb" ," mrt" ," apr"
  ," mei" ," jun" ," jul" ," aug"
  ," sep" ," okt" ," nov" ," dec"
does> (date) ; ' (NL-date) constant NL-date

create (DE-date)
  ," Jan" ," Feb" ," Mar" ," Apr"
  ," Mai" ," Jun" ," Jul" ," Aug"
  ," Sep" ," Okt" ," Nov" ," Dez"
does> (date) ; ' (DE-date) constant DE-date
                                       \ primitive for date formatter
: (ddmmmyyyy)                          ( d m y xt c -- a n)
  >r >r swap r> execute rot            ( d a n y)
  <# # # # # drop                      ( d a n)
  r@ hold dup chars rot + swap         ( d a+n-1 n)
  0 ?do char- dup c@ hold loop drop    ( d)
  r@ hold # # #> r> drop               ( a n)
; 
                                       \ two popular formats
: dd-mmm-yyyy [char] - (ddmmmyyyy) ;   ( d m y xt -- a n)
: dd_mmm_yyyy bl (ddmmmyyyy) ;         ( d m y xt -- a n)

[DEFINED] 4TH# [IF]
  hide (date)
  hide (EN-date)
  hide (FR-date)
  hide (NL-date) 
  hide (DE-date) 
[THEN]
[THEN]

\ 2 12 1960 EN-date dd-mmm-yyyy type cr