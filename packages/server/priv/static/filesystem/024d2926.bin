\ Author: Phil Burk and Darren Gibbs
\ Copyright 1994 3DO, Phil Burk, Larry Polansky, Devid Rosenboom

\ The pForth software code is dedicated to the public domain,
\ and any third party may reproduce, distribute and modify
\ the pForth software code or any derivative works thereof
\ without any compensation or license.  The pForth software
\ code is provided on an "as is" basis without any warranty
\ of any kind, including, without limitation, the implied
\ warranties of merchantability and fitness for a particular
\ purpose and their equivalents under the laws of any jurisdiction.

\ 4tH Zenfloat version by J.L. Bezemer, 2011

[UNDEFINED] f~ [IF]
[UNDEFINED] ZenFP [IF] [ABORT] [THEN]
: f~                                   ( r1 r2 r3 -- f )
  2dup f0<
  if
    2rot 2rot                          ( -- r3 r1 r2 )
    2over 2over                        ( -- r3 r1 r2 r1 r2 )
    f- fabs                            ( -- r3 r1 r2 |r1-r2| )
    2rot 2rot                          ( -- r3  |r1-r2| r1 r2 )
    fabs 2swap fabs f+                 ( -- r3 |r1-r2|  |r1|+|r2| )
    2rot fabs f*                       ( -- |r1-r2|  |r1|+|r2|*|r3| )
    f<
  else 
    2dup f0=
    if
      2drop                            ( -- m1 e1 m2 e2)
      rot = >r = r> and                ( -- f)
    else
      2rot 2rot                        ( -- r3 r1 r2 )
      f- fabs                          ( -- r3 |r1-r2| )
      2swap f<
    then
  then
;
[THEN]

\ include lib/ttester.4th
\ t{  0 s>f  0 s>f  0 s>f f~ => true }t
\ t{  7 s>f -2 s>f  0 s>f f~ => false }t
\ t{ -2 s>f  7 s>f  0 s>f f~ => false }t
\ t{  7 s>f  7 s>f  0 s>f f~ => true }t
\ t{  0 s>f  0 s>f  7 s>f f~ => true }t
\ t{  0 s>f  0 s>f -7 s>f f~ => false }t