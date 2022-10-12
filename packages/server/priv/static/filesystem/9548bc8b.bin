\ 4tH library - Wichman Hill randomizer - Copyright 2014 J.L. Bezemer
\ You can redistribute this file and/or modify it under
\ the terms of the GNU General Public License

\  Author:
\    Original FORTRAN77 version by Brian Wichman, David Hill.

\  Reference:
\    Brian Wichman, David Hill,
\    An Efficient and Portable Pseudo-Random Number Generator,
\    Applied Statistics, Volume 31, Number 2, 1982, pages 188-190.

[UNDEFINED] wichill [IF]
[UNDEFINED] fdup    [IF] [ABORT] [THEN]

[DEFINED] ZenFP     [IF]
  [UNDEFINED] floor [IF] include lib/zenfloor.4th [THEN]
[THEN]

variable _s1                           \ random seed variables
variable _s2
variable _s3

: (seed) dup >r @ * swap mod r> ! ;    ( n1 n2 v --)
: (+rand) >r @ s>f r> s>f f/ f+ ;      ( f1 v n -- f2) 
: seed3! _s3 ! _s2 ! _s1 ! ;           ( n1 n2 n3 --)

: wichill                              ( -- f)
  30269 171 _s1 (seed) 30307 172 _s2 (seed) 30323 170 _s3 (seed) 0 s>f
  _s1 30269 (+rand) _s2 30307 (+rand) _s3 30323 (+rand) fdup floor f-
;

[DEFINED] 4TH# [IF]
  hide _s1
  hide _s2
  hide _s3
  hide (seed)
  hide (+rand)
[THEN]
[THEN]

\ fclear 12345 34567 56789 seed3! 10 0 do wichill f. cr loop

\      R                 S1        S2        S3
\                     12345     34567     56789
\        0.294227     22434      5352     11416
\        0.112944     22320     11334        48
\        0.685823      2826      9800      8160
\        0.330013     29211     18715     22665
\        0.302333       696      6438      2029
\        0.844439     28209     16284     11377
\        0.561166     10968     12604     23741
\        0.592238     29119     16091      3011
\        0.704393     15233      9715     26702
\        0.891146      1709      4095     21213
