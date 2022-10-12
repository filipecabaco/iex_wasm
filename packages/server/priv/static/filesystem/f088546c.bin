\ 4tH library - ANS MEMORY (cells) - Copyright 2012 J.L. Bezemer
\ You can redistribute this file and/or modify it under
\ the terms of the GNU General Public License

[UNDEFINED] allocate [IF]
[UNDEFINED] /heap    [IF] 16384 /cell / constant /heap [THEN]
[UNDEFINED] forcecellheap [IF] [PRAGMA] forcecellheap  [THEN]
                                       \ create and initialize the heap
/heap array heap /heap 1- negate heap !

: (>node) abs 1+ cells + ;             ( a1 -n -- a2)
: (heap?) dup heap /heap cells + < ;   ( a -- f)
: (transfer) >r over over r> smove ;   ( a1 a2 n -- a1 a2)
: allocated cell- @ ;                  ( a -- n)

: (findfree)                           ( n1 -- a n2 n1)
  >r heap begin dup (heap?) while @ dup r@ + 0> while (>node) repeat r>
;                                      \ find free space
                                       \ merge at a single node
: (merge)                              ( a --)
  begin
    dup @ over over (>node) (heap?)    \ get next node
  while                                \ if we're not out of heap space
    @ dup 0<                           ( a n1 n2 f)
  while                                \ if free space as well
    + 1- over !                        \ merge it with the current node
  repeat drop drop drop                \ drop all addresses
;
                                       \ merge entire heap
: (mergeall)                           ( --)
  heap begin
    (heap?)                            \ if we're not out of heap space
  while                                \ if free space, merge it
    dup @ dup 0< if over (merge) drop dup @ then (>node)
  repeat drop                          \ examine next node
;
                                       \ save new node and merge
: (node!) over ! (merge) ;             ( a n --)

: (allocate)                           ( n -- a f)
  dup 0> if                            \ if a valid reqeust
    (findfree) over 0<                 \ freespace is negative
    if                                 \ if free space found
      over over 1+ + 0<                \ if not all consumed, leave free space
      if tuck 1+ tuck + >r >r over ! dup r> cells + r> (node!)
      else drop abs over !             \ else take it all
      then cell+ false                 \ success, return address
    else                               \ otherwise
      or 0<>                           \ allocation failed
    then
  else                                 \ not a valid request
    true                               \ return error
  then
;
                                       ( a -- f)
: free cell- dup @ dup 0> if negate (node!) false else or 0<> then ;
: allocate dup (allocate) if drop (mergeall) (allocate) else swap 0= then ;
                                       ( n -- a f)
: resize                               ( a1 n -- a2 f)
  dup 0> if                            \ if a valid request
    over allocated over over - dup 1 cells negate <
    if                                 \ shrink the segment
      1+ >r drop >r dup cell- r@ over ! r> (>node) r> (node!) false
    else                               \ reallocate the segment
      0> if swap allocate if or 0<> else swap (transfer) swap free then
      else or 0= then                  \ leave segment alone
    then
  else                                 \ if not a valid request
    0> 0=                              \ constuct a true flag
  then
;

[DEFINED] 4TH# [IF]
  hide heap
  hide /heap
  hide (>node)
  hide (node!)
  hide (heap?)
  hide (transfer)
  hide (findfree)
  hide (allocate)
  hide (merge)
  hide (mergeall)
[THEN]
[THEN]
