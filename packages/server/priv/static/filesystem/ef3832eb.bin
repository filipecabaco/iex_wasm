\ Insertion Sort
\ Taken from http://rosettacode.org 
\ 4tH version 2011, Hans Bezemer

[UNDEFINED] sort     [IF]
[UNDEFINED] precedes [IF]
defer precedes                         \ compatible with QSORT
[THEN]

: (insert)                             ( start end -- start )
  dup @ >r                             \ v = a[i] ( r: v )
  begin
    over over <                        \ j>0
  while
    r@ over cell- @ precedes           \ a[j-1] > v
  while
    cell-                              \ j--
    dup @ over cell+ !                 \ a[j] = a[j-1]
  repeat
[UNDEFINED] 4TH# [IF] then [THEN]
  r> swap ! ;                          \ a[j] = v

: sort                                 ( array len -- )
  dup 2 < if 2drop exit then
  1 ?do dup i cells + (insert) loop drop ;

[DEFINED] 4TH# [IF] hide (insert) [THEN]
[THEN]
