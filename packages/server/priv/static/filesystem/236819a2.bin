\ 4tH library - COMPARE (STRING) - Copyright 2003,2019 J.L. Bezemer
\ You can redistribute this file and/or modify it under
\ the terms of the GNU General Public License

\ Pragma's:
\ USEICOMPARE   - will define ICOMPARE instead of COMPARE
\ ANSCOMPARE    - will define an ANS-Forth compatible COMPARE
\ CASESENSITIVE - will define a case-sensitive COMPARE

\ Typical use if you want to define both COMPARE and ICOMPARE
\ [PRAGMA] useicompare
\ include lib/compare.4th
\ include lib/compare.4th

[UNDEFINED] compare   [IF]             \ this routine compares two strings
                                       \ set dependent pragma if required
[DEFINED] anscompare  [DEFINED] icompare + [IF] 
[PRAGMA] casesensitive
[THEN]
                                       \ compile ICOMPARE if required
[DEFINED] useicompare [UNDEFINED] icompare * [IF]
[DEFINED] casesensive [IF] [ABORT] [THEN]
: icompare                             ( a1 n1 a2 n2 -- f )
[ELSE]
: compare                              ( a1 n1 a2 n2 -- f )
[THEN]
  rot over over swap - >r              ( a1 a2 n2 n1)
  min 0 tuck                           ( a1 a2 0 n 0)
  ?do                                  ( a1 a2 f)
    drop                               ( a1 a2)
    over i + c@                        ( a1 a2 c1)
[UNDEFINED] casesensitive [IF]
    dup [char] A - max-n and 26 < if bl or then
[THEN]
    over i + c@                        ( a1 a2 c1 c2)
[UNDEFINED] casesensitive [IF]
    dup [char] A - max-n and 26 < if bl or then
[THEN]
    - dup                              ( a1 a2 f f)
    if leave then                      ( a1 a2 f)
  loop
  >r drop drop r> r> swap dup          ( f1 f2 f2)
  if swap then drop                    ( f)
[DEFINED] anscompare [IF]
  dup 0< negate swap 0> or             ( f)
[THEN]
;
[THEN]



