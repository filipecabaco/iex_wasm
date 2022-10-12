\ 4tH library - P. L'Ecuyer randomizer - Copyright 2014 J.L. Bezemer
\ You can redistribute this file and/or modify it under
\ the terms of the GNU General Public License

\ Reference:
\   Pierre LEcuyer,
\   Efficient and Portable Combined Random Number Generators,
\   Communications of the ACM,
\   Volume 31, Number 6, June 1988, pages 742-751.

\ Parameters:
\   Two values are used as the seed for the sequence.  On first call,
\   the user should initialize S1 to a value between 1 and 2147483562;
\   S2 should be initialized to a value between 1 and 2147483398.

[UNDEFINED] plecuyer [IF]
[UNDEFINED] f/ [IF] [ABORT] [THEN]

variable _s1                           \ random seed variables
variable _s2

: seed2! _s2 ! _s1 ! ;                 ( n1 n2 --)

: plecuyer
  _s1 @ dup 53668 / dup -12211 * swap -53668 *
  rot + 40014 * + dup 0< if 2147483563 + then

  _s2 @ dup 52774 / dup -3791 * swap -52774 *
  rot + 40692 * + dup 0< if 2147483399 + then

  over over _s2 ! _s1 ! -              ( s1 s2)
  dup 1 < if 2147483562 + then         ( s1-s2)

  s>f 2147483563 s>f f/                ( f)
;

[DEFINED] 4TH# [IF]
  hide _s1
  hide _s2
[THEN]
[THEN]

\ S1 = 12345
\ S2 = 34567

\ fclear 12345 34567 seed2! 10 0 do plecuyer f. cr loop depth .

\  I      R                     S1            S2

\  1        0.575025     493972830    1406600364
\  2        0.945577     390105768     506978341
\  3        0.253573    1781664868    1237121178
\  4        0.883384    1526187241    1776619217
\  5        0.794246     866180343    1308034228
\  6        0.976838    1103021545    1152761561
\  7        0.246036    1221914854     693555855
\  8        0.928839    1942689135    2095505401
\  9        0.986301     153034416     182453399
\ 10        0.232776    1043483711     543601765