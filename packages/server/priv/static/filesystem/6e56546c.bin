\ 4tH library - Digital root (double number) - Copyright 2013 J.L. Bezemer
\ You can redistribute this file and/or modify it under
\ the terms of the GNU General Public License

\ Calculates OEIS A010888 sequence
\ The additive persistence is the number of
\ summations required to obtain the single digit.

[UNDEFINED] ddigiroot [IF]
[UNDEFINED] mu/mod    [IF] include lib/mixed.4th [THEN]

: (Sdigit) 0. 2swap begin base @ mu/mod 2>r u>d d+ 2r> 2dup d0= until 2drop ;
: ddigiroot 0 -rot begin (Sdigit) 2>r 1+ 2r> 2dup base @ u>d d< until d>u ;
                                       ( ud -- n1 n2)
[DEFINED] 4TH# [IF]
  hide (Sdigit)
[THEN]
[THEN]
