\ 4tH library - Digital root - Copyright 2013 J.L. Bezemer
\ You can redistribute this file and/or modify it under
\ the terms of the GNU General Public License

\ Calculates OEIS A010888 sequence
\ The additive persistence is the number of
\ summations required to obtain the single digit.

[UNDEFINED] digiroot [IF]
: (Sdigit) 0 swap begin base @ /mod >r + r> dup 0= until drop ;
: digiroot 0 swap begin (Sdigit) >r 1+ r> dup base @ < until ;
                                       ( n1 -- n2 n3)
[DEFINED] 4TH# [IF]
  hide (Sdigit)
[THEN]
[THEN]