\ 4tH library - INTROSORT - Copyright 2016 J.L. Bezemer
\ You can redistribute this file and/or modify it under
\ the terms of the GNU General Public License

[UNDEFINED] sort    [IF]
[UNDEFINED] lastbit [IF] include lib/bitset.4th [THEN]

include lib/ins2sort.4th               \ get insertionsort
aka sort insertSort                    \ and rename it
hide sort

include lib/hea2sort.4th               \ get heapsort
aka sort heapSort                      \ and rename it
hide sort
                                       \ choose a median of three for pivot
: (swap) over @ over @ swap rot ! swap ! ;
: (bubble) over @ over @ > if swap then ;
: (choosepivot) (bubble) >r (bubble) r> (bubble) drop nip ;
                                       ( x1 x2 x3 -- x4)
: (partition)                          ( x1 n1 n2 -- n3)
  rot dup rot 2>r                      ( n1 x1 r: x1 n2)
  swap 1- 2r@ cells + @ 2r@ bounds     ( x1 n1-1 p x1 n2 r: x1 n2)
  ?do i @ 1- over precedes if >r 1+ 2dup cells + r> swap i (swap) then loop
  drop 1+ dup cells rot + 2r> cells + (swap)
;                                      \ 1+ index of smaller element on swap
                                       \ array size depthlimit
: (introsort)                          ( a n1 n2 --)
  over 16 < if drop insertSort exit then
  dup 0= if drop heapSort exit then 1- >r
                                       \ use other sorts when required
  over over dup 1- cells >r 2/ cells over + over r> + (choosepivot) >r
  over over 1- cells + r> (swap)       \ swap the values at pointers
  over over 1- 0 swap (partition) >r   \ perform a quicksort
  over r> r@ over >r recurse
  swap r@ 1+ cells + swap r> 1+ - r> recurse
;

: sort dup lastbit (introsort) ;       ( a n --)

[DEFINED] 4TH# [IF]
  hide (swap)
  hide (bubble)
  hide (choosepivot)
  hide (partition)
  hide (introsort)
[THEN]
[THEN]
