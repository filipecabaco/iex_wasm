\ 4tH library - English figures - Copyright L.G. Lisle, J.L. Bezemer
\ You can redistribute this file and/or modify it under
\ the terms of the GNU General Public License

[UNDEFINED] .ORDINAL [IF]
: .number cells + @c count type ;

create .crd
  ," zero"
  ," one"
  ," two"
  ," three"
  ," four"
  ," five"
  ," six"
  ," seven"
  ," eight"
  ," nine"
  ," ten"
  ," eleven"
  ," twelve"
  ," thirteen"
  ," fourteen"
  ," fifteen"
  ," sixteen"
  ," seventeen"
  ," eighteen"
  ," nineteen"
does> swap .number ;

create .tens
  ," twenty"
  ," thirty"
  ," forty"
  ," fifty"
  ," sixty"
  ," seventy"
  ," eighty"
  ," ninety"
  ," hundred"
  ," thousand"
does> swap 1- 1- .number ;
                                       \ unsigned numbers, smaller than 110
: .cardinal                            ( n --)
  dup 19 >
  if 10 /mod .tens space then dup
  if .crd space else drop then
;

: .th
  dup 
  if 100 /mod dup if .cardinal 10 .tens space else drop then .cardinal
  else drop
  then
;

: .eng
  dup 1999 >
  if 1000 /mod .th 11 .tens space then .th
;
                                       \ signed numbers, smaller than 1,000,000
: .english                             ( n --)
  dup 0<
  if ." minus " abs then dup
  if .eng else .crd space then
;

create .ord
  ," first"
  ," second"
  ," third"
  ," fourth"
  ," fifth"
  ," sixth"
  ," seventh"
  ," eighth"
  ," ninth"
  ," tenth"
  ," eleventh"
  ," twelfth"
  ," thirteenth"
  ," fourteenth"
  ," fifteenth"
  ," sixteenth"
  ," seventeenth"
  ," eighteenth"
  ," nineteenth"
does> swap 1- .number space ;

create .10ord
  ," twen"
  ," thir"
  ," for"
  ," fif"
  ," six"
  ," seven"
  ," eigh"
  ," nine"
does> swap 1- 1- .number ." tieth " ;
                                       \ unsigned numbers, smaller than 100
: .ordinal                             ( n --)
  dup 20 <
  if .ord
  else 10 /mod swap dup if swap .tens .ord else drop .10ord then
  then
;

[DEFINED] 4TH# [IF]
hide .number
hide .crd
hide .tens
hide .th
hide .eng
hide .ord
hide .10ord
[THEN]
[THEN]
