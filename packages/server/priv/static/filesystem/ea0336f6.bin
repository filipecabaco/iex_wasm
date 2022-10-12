\ 4tH library - Binary Insertion Sort - Copyright 2017 J.L. Bezemer
\ You can redistribute this file and/or modify it under
\ the terms of the GNU General Public License

[UNDEFINED] sort     [IF]
[UNDEFINED] precedes [IF]
defer precedes                         ( addr addr -- flag )
[THEN]                                 \ compatible with QSORT

aka r"@ a[]

: sort
  dup 0> 0= if drop drop ;then         \ don't do empty arrays
  swap >r                              \ put array on return stack
  1 ?do
    0 i dup 2/                         ( lo hi m)

    begin                              \ find the entry
      a[] over th @ a[] i th @ over over precedes
      if                               ( lo hi m a[m] a[i])
        drop drop >r nip r@ 1+ swap r> true
      else                             ( m+1 hi m +f)
        swap precedes dup if >r nip dup r> then
      then                             ( lo m m f)
    while                              ( lo hi m)
      drop over over over - 2/ +       ( lo hi m')
      >r over over < 0= r> swap        ( lo hi m' f)
    until
                                       \ now insert it
    dup i <                            ( m f)
    if                                 \ make room and insert
      a[] i th @ swap                  ( a[i] m)
      a[] over th over over cell+ i rot - smove
      cells a[] + !                    ( --)
    else                               \ drop the value
      drop                             ( --)
    then drop drop                     \ next element
  loop r> drop                         ( --)
;
[DEFINED] 4TH# [IF] hide a[] [THEN]
[THEN]
