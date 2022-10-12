\ 4tH library - Bitonic Sort - Copyright 2014 J.L. Bezemer
\ You can redistribute this file and/or modify it under
\ the terms of the GNU General Public License

[UNDEFINED] sort     [IF]
[UNDEFINED] precedes [IF]
defer precedes                         ( addr addr -- flag )
[THEN]                                 \ compatible with QSORT

: (bitonicMerge)                       ( a n f)
  over 1 > if
    rot >r >r                          ( n)
    1 begin over over > while 1 lshift repeat 1 rshift
    tuck - tuck r> -rot cells r@ + r@  ( n-m f m a+n-m a)
    ?do                                ( n-m f m)
       over over cells i + i           ( n-m f m f i+m i)
       rot >r over @ over @ precedes r> =
       if over @ over @ swap rot ! swap ! else drop drop then
    1 cells +loop                      ( n-m f m)
    r> rot >r swap over over r@ recurse
    cells + swap r> recurse exit       ( --)
  then
  drop drop drop
;

: (bitonicSort)                        ( a n f)
  over 1 > if
    >r over over 2/ r@ 0= recurse      ( a n R: f)
    over over 2/ cells + over dup 2/ - r@ recurse
    r> (bitonicMerge) exit
  then
  drop drop drop
;

: sort true (bitonicSort) ;            ( a n --)

[DEFINED] 4TH# [IF]
  hide (bitonicMerge)
  hide (bitonicSort)
[THEN]
[THEN]
