\ 4tH library - PRINT - Copyright 2003,2010 J.L. Bezemer
\ You can redistribute this file and/or modify it under
\ the terms of the GNU General Public License

\ Has RMARGIN been defined? If not, abort!
[UNDEFINED] RMARGIN [IF]
[ABORT] [THEN]

\ Load definitions when needed
[UNDEFINED] SCAN [IF]
[NEEDS lib/scanskip.4th]
[THEN]

[UNDEFINED] PRINT [IF]
VARIABLE #emits 

: (PRINT) DUP #emits +! TYPE ;         \ public
: SHOW emit 1 #emits +! ;              \ public
: NL CR 0 #emits ! ;                   \ public
: ?SPACE #emits @ IF BL SHOW THEN ;    \ public
: PRINT-WORD DUP 1+ #emits @ + RMARGIN > IF NL ELSE ?SPACE THEN (PRINT) ;

: NEXT-WORD                            \ private
  BL DUP >R SKIP OVER OVER R> SCAN TUCK
  >R >R - R> R> ROT >R ROT R> PRINT-WORD
;

: PRINT ( addr count --)               \ public
  BEGIN DUP WHILE NEXT-WORD REPEAT
  DROP DROP
;

[DEFINED] 4TH# [IF]
hide #emits
hide NEXT-WORD
[THEN]
[THEN]

