\ 4tH library - F>D ZEN - Copyright 2010,2011 J.L. Bezemer
\ You can redistribute this file and/or modify it under
\ the terms of the GNU General Public License

[UNDEFINED] f>d [IF]
[UNDEFINED] ZenFP [IF] [ABORT] [THEN]
: f>d                                  ( f -- d)
  over abs u>d rot dup 0<              \ abs mantissa, compare exponent
  if                                   \ if exponent less than zero
    abs 0 ?do 10 mu/mod rot drop loop  \ divide mantissa as unsigned number
  else                                 \ if exponent greater than zero
    0 ?do 10 mu* loop                  \ multiply mantissa as unsigned number
  then
  rot 0< if dnegate then               \ if mantissa less than zero
;                                      \ negate double number
[THEN]