\ 4tH library - fixed precision dot - Copyright 2005 J.L. Bezemer
\ You can redistribute this file and/or modify it under
\ the terms of the GNU General Public License

[UNDEFINED] FIXED [IF]
: FIXED SWAP DUP ABS ROT <# 0 ?DO # LOOP [CHAR] . HOLD #S SIGN #> ;
: .F FIXED TYPE SPACE ; 
: .FR TUCK + 1+ >R FIXED R> OVER - SPACES TYPE ;
[THEN]

