\ 4tH Trabb Pardo-Knuth algorithm - Copyright 2012 J.L. Bezemer
\ You can redistribute this file and/or modify it under
\ the terms of the GNU General Public License

\ In their 1977 work "The Early Development of Programming Languages",
\ Trabb Pardo and Knuth introduced a trivial program which involved arrays,
\ indexing, mathematical functions, subroutines, I/O, conditionals and 
\ iteration. They then wrote implementations of the algorithm in several
\ early programming languages to show how such concepts were expressed.

include lib/fp2.4th
include lib/fenter.4th
include lib/zenfsqrt.4th

: toolarge? 
  fdup 400 s>f f< if fswap f. ." = " f. else fdrop fdrop ." TOO LARGE" then cr
;

: calculate 
  11 0 do fdup fabs fsqrt fover fdup fdup f* f* 5 s>f f* f+ toolarge? loop
;

: enter 11 0 do ." Enter no. " i 1+ 0 .r ." : " fenter loop ;
: Trabb-Pardo-Knuth enter calculate ;

Trabb-Pardo-Knuth