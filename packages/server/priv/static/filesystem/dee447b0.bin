\ Taken from http://rosettacode.org 
\ 4tH version 2012, Hans Bezemer

\ Compute the n-th term of a series, i.e. the sum of the n first terms of the
\ corresponding sequence. Informally, it is also called the sum of the series,
\ thus the title of this task. This approximates the zeta function for s=2,
\ whose exact value is the solution of the Basel problem.

\ http://en.wikipedia.org/wiki/Basel_problem

include lib/fp4.4th
include lib/fpow10.4th
include lib/fpconst.4th

: sum ( fn start count -- fsum )
  0 s>f
  bounds do
    i s>f dup execute f+
  loop drop ;

:noname ( x -- 1/x^2 ) fdup f* 1/f ;   ( xt )

fclear 15 set-precision
1 1000 sum f.          \ 1.64393456668156
pi pi f* 6 s>f f/ f.   \ 1.64493406684823