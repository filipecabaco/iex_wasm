include lib/combsort.4th
include lib/choose.4th

:noname >r cells r@ + @ swap cells r> + @ swap < ; is precedes
:noname >r cells r@ + swap cells r> + over @ over @ swap rot ! swap ! ; is exchange

100 array example

: array! 100 0 do 1000 choose example i th ! loop ;
: .array 100 0 do example i th ? loop cr ;

array! .array example 100 combsort cr .array