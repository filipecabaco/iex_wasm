include lib/fp1.4th                    \ simple floating point support
include lib/zenfloor.4th               \ for FLOOR
include lib/mrg32k3a.4th               \ for RANDOM

1 32 lshift 209 - value m              \ denominator, see MRG32k3a library

5 array (count)                        \ setup an array of 5 elements

: test
  1234567 randomize!
  random . cr random . cr random . cr
  random . cr random . cr cr           \ perform the first test

  987654321 randomize! m 1+ s>f        \ set up denominator

  100000 0 ?do                         \ do this 100,000 times
    random s>f fover f/ 5 s>f f* floor f>s cells (count) + 1 swap +!
  loop fdrop
                                       \ show the results
  5 0 ?do i . ." : " (count) i th ? cr loop
;

test

\ 1459213977
\ 2827710106
\ 4245671317
\ 3877608661
\ 2595287583

\ 0 : 20002
\ 1 : 20060
\ 2 : 19948
\ 3 : 20059
\ 4 : 19931

