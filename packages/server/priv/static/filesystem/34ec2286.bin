\ Thanks for asking. Those routines are public domain (originally posted to
\ comp.sys.arm a long time ago), so you can use them freely for any purpose.
\ Cheers, Wilco Dijkstra

\ http://github.com/irungentoo/filter_audio/blob/master/other/spl_sqrt_floor.c

\ Algorithm:
\ Successive approximation of the equation (root + delta) ^ 2 = N
\ until delta < 1. If delta < 1 we have the integer part of SQRT (N).
\ Use delta = 2^i for i = cell-bits/2 - 1 .. 0.

\ Output precision is half cell size. Note for large input values
\ (close to MAX-N), the highest bit of the low half cell) contains
\ the MSB information (a non-sign value).

\ This routine is significantly faster than the standard SQRT which
\ is defined in MATH.4TH

[UNDEFINED] isqrt     [IF]
[UNDEFINED] cell-bits [IF] include lib/constant.4th [THEN]
: isqrt                                ( n1 -- n2)
  0 swap -1 cell-bits 2 / 1- do        ( r v)
    over 1 i lshift +                  ( r v t)
    i lshift over - dup 0> 0=          ( r v t-v f)
    if abs rot 2 i lshift or swap rot then drop
  -1 +loop drop 2/                     ( r)
;
[THEN]
