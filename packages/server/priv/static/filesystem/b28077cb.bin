\ Continued fractions - Copyright 2012 J.L. Bezemer
\ You can redistribute this file and/or modify it under
\ the terms of the GNU General Public License

include lib/fp3.4th

: fsqrt2 1 s>f 0> if 2 s>f else fdup then ;
: fnapier dup dup 1 > if 1- else drop 1 then s>f dup 1 < if drop 2 then s>f ;
: fpi dup 2* 1- dup * s>f 0> if 6 else 3 then s>f ;
                                       ( n -- f1 f2)
: cont.fraction                        ( xt n -- f)
  0 swap 1+ over s>f                   \ calculate for 1 .. n
  do i over execute frot f+ f/ -1 +loop
  0 swap execute fnip f+               \ calcucate for 0
;

fclear 100 set-precision               \ initialize FP

' fsqrt2  200 cont.fraction f. cr
' fnapier 200 cont.fraction f. cr
' fpi     200 cont.fraction f. cr