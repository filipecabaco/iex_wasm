\ Bubble Sort
\ Taken from http://rosettacode.org 
\ 4tH version 2011,2013 Hans Bezemer

[UNDEFINED] bubblesort [IF]
[UNDEFINED] precedes   [IF]
defer precedes                         ( n1 n2 a -- f)
[THEN]
[UNDEFINED] exchange   [IF]
defer exchange                         ( n1 n2 a --)
[THEN]

: bubblesort                           ( addr len -- )
  dup 1 > if                           \ protect from single element arrays
    begin
      1- 2dup true -rot 0              ( sorted addr len-1 )
      ?do                              ( mark unsorted )
        i swap >r dup 1+ swap over over r@ precedes
        if r@ exchange dup xor else drop drop then r>
      loop drop                        \ sorted
    until
  then 2drop
;
[THEN]
