\ 4tH library - BOX - Copyright 2005 J.L. Bezemer
\ You can redistribute this file and/or modify it under
\ the terms of the GNU General Public License

\ Load EMITS when needed
[UNDEFINED] emits [IF]
[NEEDS lib/emits.4th]
[THEN]

[UNDEFINED] BOX [IF]
char + constant LT                     \ left top corner
char + constant RT                     \ right top corner
char + constant LB                     \ left bottom corner
char + constant RB                     \ right bottom corner
char - constant HL                     \ horizontal line
char | constant VL                     \ verical line

defer .space                           \ determines spacing of box
                                       \ private words
: (space) VL dup emit over spaces emit cr ;
: (none) ;                             \ line drawing words
: .line emit over HL emits emit cr ;
: .msg VL emit space -rot type space VL emit cr ;
                                       \ addresses of words
' (space) constant big                 \ we want a big box
' (none)  constant small               \ we want a small box
                                       ( a1 n1 xt --)
: box is .space dup 1+ 1+ RT LT .line .space .msg .space RB LB .line drop ;
                                       \ hide all private definitions 
[DEFINED] 4TH# [IF]
hide LT
hide RT
hide LB
hide RB
hide HL
hide VL
hide (space)
hide (none)
hide .line
hide .space
hide .msg
[THEN]
[THEN]
