\ 4tH library - Variable size array - Copyright 2021 J.L. Bezemer
\ You can redistribute this file and/or modify it under
\ the terms of the GNU General Public License

[UNDEFINED] +varray  [IF]
[UNDEFINED] resize   [IF] include lib/memcell.4th [THEN]
[UNDEFINED] E.LIBERR [IF] include lib/throw.4th   [THEN]

struct
  field: (cur)                         \ current available element
  field: (max)                         \ maximum number of elements
  field: (dat)                         \ offset to data area
end-struct (/varray)                   \ minimum size varray

: (&cur) over over @ -> (cur) ;        ( n a -- n a cur')
: (?out-of-range) E.LIBERR throw" Index varray out of range" ;
: (|va|?) over 0< (?out-of-range) (&cur) @ > ;
: (va[]) @ -> (dat) swap th ;          ( n a -- 'a+n)
                                       ( n1 a -- n2)
: v@ (|va|?) (?out-of-range) (va[]) @ ;
: -varray @ free E.LIBERR throw" Cannot free varray" ;
                                       \ enable virtual array
: +varray                              ( a n --)
  (/varray) allocate E.LIBERR throw" Cannot allocate varray"
  0 over -> (cur) ! tuck -> (max) ! swap !
;                                      \ initialize and store address
                                       \ store a value
: v!                                   ( n1 n2 a --)
  (|va|?) if                           \ check ranges - need expansion?
    over over @ -> (max) @ < 0= (?out-of-range)
    over over @ swap resize E.LIBERR throw" Cannot resize varray"
    over ! (&cur) !                    \ resize array and store new address
  then (va[]) !                        \ now store value
;

[DEFINED] 4TH# [IF]
  hide (cur)
  hide (max)
  hide (dat)
  hide (/varray)
  hide (&cur)
  hide (?out-of-range)
  hide (|va|?)
  hide (va[])
[THEN]
[THEN]

\ variable myarray myarray 1024 +varray 23 0 myarray v! 56 100 myarray v!
\ 0 myarray v@ . 100 myarray v@ . cr myarray -varray depth .

