include lib/gnomsort.4th
include lib/choose.4th

:noname >r cells r@ + @ swap cells r> + @ swap < ; is precedes
:noname >r cells r@ + swap cells r> + over @ over @ swap rot ! swap ! ; is exchange

10 array example

: array! 10 0 do 100 choose example i th ! loop ;
: .array 10 0 do example i th ? loop cr ;

array! .array example 10 gnomesort .array