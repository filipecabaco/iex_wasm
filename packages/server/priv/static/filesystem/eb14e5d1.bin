\ 4tH library - COMUS SKIP SCAN - Copyright 2003,2012 J.L. Bezemer
\ You can redistribute this file and/or modify it under
\ the terms of the GNU General Public License

[UNDEFINED] SPLIT [IF]
[UNDEFINED] ?NOT  [IF] [NEEDS lib/yesno.4th] [THEN]

: (scan) 
  is ?not >r begin dup while over c@ r@ = ?not while chop repeat r> drop
;

: skip ['] (yes) (scan) ;              ( a1 n1 c -- a2 n2) ( SKIP CHARACTERS )
: scan ['] (no)  (scan) ;              ( a1 n1 c -- a2 n2) ( SCAN STRING )
: split >r 2dup r> scan 2swap >r over r> swap - ;
                                       ( a1 n1 c -- a2 n3 a1 n4)
[DEFINED] 4TH# [IF]
  hide (scan)
[THEN]
[THEN]