\ 4tH library - CHAR-MATCH - Copyright 2011, 2017 J.L. Bezemer
\ You can redistribute this file and/or modify it under
\ the terms of the GNU General Public License

[UNDEFINED] char-match [IF]
[UNDEFINED] break?     [IF] include lib/breakq.4th [THEN]
                                       ( a1 n1 f -- a1 n1 -f | a+1 n-1 +f)
: ?chop dup if rot char+ rot 1- rot then ;
                                       \ match any character and remove
: char-match                           ( a1 n1 a2 n2 -- a1+1 n1-1 f | a1 n1 f)
  bounds 2>r dup dup if drop over c@ false 2r@ break? ?chop then 2r> 2drop
;
                                       \ match character and remove
: char-equal                           ( a1 n1 c -- a1+1 n1-1 f | a1 n1 -f)
  over if >r over c@ r> = ?chop else >zero then
;

: (skip-chars)                         ( a1 n1 a2 n2 f -- a3 n3)
  >r bounds 2>r                        \ calculate addresses
  begin dup while over c@ r"@ 2r@ break? while chop repeat
  2r> 2drop r> drop                    \ cleanup
;
                                       \ skip characters while/until
: skip-until true  (skip-chars) ;      ( a1 n1 a2 n2 -- a3 n3)
: skip-while false (skip-chars) ;      ( a1 n1 a2 n2 -- a3 n3)

[DEFINED] 4TH# [IF]
  hide (skip-chars)
  hide ?chop
[THEN]
[THEN]
