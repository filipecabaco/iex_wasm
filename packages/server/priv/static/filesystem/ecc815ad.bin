\ 4tH library - Selection sort - Copyright 2011 J.L. Bezemer
\ You can redistribute this file and/or modify it under
\ the terms of the GNU General Public License

[UNDEFINED] selectsort [IF]
[UNDEFINED] precedes   [IF]
defer precedes                         ( n1 n2 a -- f)
[THEN]
[UNDEFINED] exchange   [IF]
defer exchange                         ( n1 n2 a --)
[THEN]

: selectsort                           ( array len -- )
  tuck 1- 0                            ( n a n 0)
  ?do                                  ( n a)
    i swap >r swap over over over 1+   ( i n i n i )
    ?do i over over j precedes 0= if swap then drop loop
    rot r@ exchange r>                 ( n a)
  loop drop drop                       ( --)
;
[THEN]
