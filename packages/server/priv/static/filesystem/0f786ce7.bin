\ Bubble Sort
\ Taken from http://rosettacode.org 
\ 4tH version 2011,2013 Hans Bezemer

[UNDEFINED] sort     [IF]
[UNDEFINED] precedes [IF]
defer precedes                         ( addr addr -- flag )
[THEN]                                 \ compatible with QSORT

: sort                                 ( addr len -- )
  dup 1 > if                           \ protect from single element arrays
    begin
      1- 2dup true -rot cells bounds   ( sorted addr len-1 )
      ?do                              ( mark unsorted )
        i cell+ @ i @ over over precedes
        if i cell+ ! i ! dup xor else drop drop then
      1 cells +loop                    \ sorted
    until
  then 2drop
;
[THEN]
