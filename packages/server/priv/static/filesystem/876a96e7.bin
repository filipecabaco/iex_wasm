\ 4tH library - BUFFER - Copyright 2004,2012 J.L. Bezemer
\ You can redistribute this file and/or modify it under
\ the terms of the GNU General Public License

[UNDEFINED] ring-buffer [IF]
[UNDEFINED] /ring [IF]                 \ default ring size
64 constant /ring                      \ must be a power of 2!
[THEN]

struct
      1 +field head
      1 +field tail
  /ring +field ring
end-struct /ring-buffer

/ring 1- constant mask

: ring-buffer   ( b -- )    0 swap 2dup head ! tail ! ;
: buffer-used   ( b -- n )  dup head @ swap tail @ - mask and ;
: buffer-ends?  ( b -- f )  buffer-used mask = ;
: buffer-empty? ( b -- f )  buffer-used 0= ;
: wrap          ( x -- n n) @ dup 1+ mask and ;
: >b            ( n b -- )  dup head dup >r wrap >r >r ring r> th ! r> r> ! ;
: b>            ( b -- n )  dup tail dup >r wrap >r >r ring r> th @ r> r> ! ;

[DEFINED] 4TH# [IF]
  hide mask
  hide head
  hide tail
  hide ring
  hide /ring
  hide wrap
[THEN]
[THEN]
