\ Selection Sort
\ Taken from http://rosettacode.org 
\ 4tH version 2011,2013 Hans Bezemer

[UNDEFINED] sort     [IF]
[UNDEFINED] precedes [IF]
defer precedes                         ( addr addr -- flag )
[THEN]                                 \ compatible with QSORT

: sort                                 ( array len -- )
  bounds over                          ( end start end )
  cell- swap ?do                       ( end )
    i over over cell+ ?do i @ over @ precedes if drop i then 1 cells +loop
    i @ over @ i ! swap !              ( end least )
  1 cells +loop
  drop ;
[THEN]

