\ Taken from http://rosettacode.org 
\ 4tH version 2014, Hans Bezemer

\ Floyd's triangle lists the natural numbers in a right triangle aligned to
\ the left where the first row is just 1, successive rows start towards the
\ left with the next number followed by successive naturals listing one more
\ number than the line above.

: lastn ( rows -- n ) dup 1- * 2/ ;
: >width ( n -- n )  s>d <# #s #> nip 2 + ;

: triangle                             ( rows -- )
  dup lastn 0 rot                      ( last 0 rows )
  0 do
    over cr
    i 1+ 0 do
      1+ swap 1+ swap
      over over >width .r
    loop
    drop
  loop
  drop drop cr ;

14 triangle
