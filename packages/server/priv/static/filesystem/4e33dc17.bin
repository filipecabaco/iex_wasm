( SQRT -- Integer square root with estimation of decimal )

[needs lib/math.4th]
[needs lib/fixeddot.4th]

: example  ( -- )  ( table of square roots from 500 to 1000 )
   ."  X      Square root X " cr
   100001 50000 do
     i dup 100 / 4 .r sqrt 2 spaces 4 1 .fr cr
   2500 +loop
;

example

