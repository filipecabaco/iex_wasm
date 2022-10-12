\ Wil Baden's sorter, 4tH version 2003, 2013
\ Set PRECEDES for different datatypes or sort order.

[UNDEFINED] sort     [IF]
[UNDEFINED] precedes [IF]
  defer precedes                       ( addr addr -- flag )
[THEN]                                 \ compatible with QSORT

: partition                            ( lo hi -- lo_1 hi_1 lo_2 hi_2 )
    2dup over - 2/ -1 cells and +  @ >r  ( r: median)
    2dup begin                         ( lo_1 hi_2 lo_2 hi_1)
         swap begin  dup @ r@   precedes while  cell+  repeat
         swap begin  r@ over @  precedes while  cell-  repeat
         2dup > not
         if 2dup 2dup @ swap @ rot ! swap ! >r cell+ r> cell- then
    2dup > until                       ( lo_1 hi_2 lo_2 hi_1)
    r> drop swap rot                   ( lo_1 hi_1 lo_2 hi_2)
    ;

: qsort                                ( lo hi -- )
    partition                          ( lo_1 hi_1 lo_2 hi_2)
[UNDEFINED] QSORTDEEPSTACK [IF]        \ don't select smaller subset
    2>r 2dup 2r> 2swap 2>r 2dup 2r> 2swap - + < if 2swap then
[THEN]
    2dup < if recurse else 2drop then
    2dup < if recurse exit then  2drop ;
                                       \ force tail recursion
: sort                                 ( addr n -- )
    dup 2 < if  2drop  exit then
    1- cells over + qsort  ;           ( addr addr+{n-1}cells) 

[DEFINED] 4TH# [IF]
  hide partition
  hide qsort
[THEN]
[THEN]
