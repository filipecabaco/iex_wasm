\ * LANGUAGE    : ANS Forth with extensions
\ * PROJECT     : Forth Environments
\ * DESCRIPTION : The Riemann Zeta function [real and complex]
\ * CATEGORY    : Special functions
\ * AUTHOR      : Marcel Hendrix
\ * LAST CHANGE : April 29, 2012, Marcel Hendrix

\ Original 60-digit precision version posted to comp.lang.forth
\ by Marcel Hendrix on 30 April 2012. Ported for FSL compatibility
\ and use with double precision, by K. Myneni, 2 May 2012.

\ Provides:
\   fzeta  ( F: r1 -- r2 )   \ real zeta function

\  Notes:

\  In Canadian Mathematical Society, Conference Proceedings, 1991.
\  'An Efficient Algorithm for the Riemann Zeta Function,' P. Borwein

\  Borwein's algorithm 2:

\              k
\            .--- (n+i-1)! * 4^i
\  d_k = n *  >   ---------------
\            '--- (n-i)! * (2*i)!
\             i=0

\                                n-1
\                 -1           .---- (-1)^k (d_k - d_n)
\  Zeta(s) = --------------- *  >    ------------------
\            d_n*(1-2^(1-s))   '----      (k+1)^s
\                                k=0

\  The algorithm only works for Re(s) > 1. A special case is when
\  Im(s) = 0.5, but it relates to efficiency, not to accuracy.

( Riemann Zeta Function    Version 1.00 MHX )
[UNDEFINED] fzeta [IF]
[UNDEFINED] f**   [IF] include lib/falog.4th [THEN]

16 constant N_valid_digits
N_valid_digits 14 * 10 / constant _N
_N 1+ floats array _Zc

float array _x
float array _y
float array _z

1 s>f fdup fdup
_x f! _y f! _z f!
_N 1+ 0 DO
   _x f@ _Zc I floats + f!
   _N I - s>f  _N I + s>f f* f2* f2* _y f@ f* fdup _y f!
   I 2* 1+ s>f I 2* 2 + s>f f* _z f@ f* fdup _z f!
  ( y z ) f/ _x f@ f+ _x f!
LOOP

\ Valid for x > 1
: fzeta ( F: x -- z )
    _x f!
    0 s>f -1 _N 1- ?DO
       _Zc _N floats + f@  _Zc I floats + f@ f-
       I 1+ s>f _x f@ f** f/ fswap f-
    -1 +LOOP
    ( sum)
    _Zc _N floats + f@ f/ _x f@ fnegate 2 s>f fswap f** f2* 1 s>f fswap f- f/
;

[DEFINED] 4TH# [IF]
  hide N_valid_digits
  hide _x
  hide _y
  hide _z
  hide _N
  hide _Zc
[THEN]
[THEN]

