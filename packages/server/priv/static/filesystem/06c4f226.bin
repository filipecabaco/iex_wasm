\ Taken from http://en.literateprograms.org/Rot13_(Forth)
\ Optimized for 4tH by J.L. Bezemer, 2007/2012

[UNDEFINED] within [IF]
include lib/range.4th
[THEN]

[UNDEFINED] rot13 [IF]
: rot13                                ( c -- o )
  dup bl or dup [char] a [char] z 1+ within
  if [char] m > if -13 + else 13 + then else drop then
;
[THEN]
