\ 4tH library - ZEN FP ANS layer - Copyright 2009,2013 J.L. Bezemer
\ You can redistribute this file and/or modify it under
\ the terms of the GNU General Public License

[UNDEFINED] fdup   [IF]
[UNDEFINED] f>d    [IF] include lib/zentodbl.4th  [THEN]
[UNDEFINED] fround [IF] include lib/zenround.4th  [THEN]
[IGNORE]    fclear                     \ ANS-float compatibility
aka 2rot    frot                       \ simple synonyms
aka 2over   fover
aka 2@      f@
aka 2!      f!

CELL-BITS 2 + 30103 * 100000 / constant maxdigits
maxdigits value precision              \ # of digits to display (see F., R.)

: set-precision maxdigits min to precision ;
: fdup  2dup  ;                        \ equivalents of double stack words
: fswap 2swap ;
: fdrop 2drop ;
: fnip  2nip  ;
[THEN]