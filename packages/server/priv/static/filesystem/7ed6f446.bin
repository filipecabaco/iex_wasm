\ 4tH library - ANS MEMORY (chars) - Copyright 2012 J.L. Bezemer
\ You can redistribute this file and/or modify it under
\ the terms of the GNU General Public License

[UNDEFINED] callocate [IF]
[UNDEFINED] /nell     [IF] include lib/ncoding.4th [THEN]
[UNDEFINED] /heap     [IF] 16384 constant /heap    [THEN]
                                       \ create and initialize the heap
/heap buffer: heap /heap nell- negate heap n!

: (>node) abs nell+ + ;                ( a1 -n -- a2)
: (heap?) dup heap /heap + < ;         ( a -- f)
: (transfer) >r over over r> cmove ;   ( a1 a2 n -- a1 a2)
: callocated nell- n@ ;                ( a -- n)

: (findfree)                           ( n1 -- a n2 n1)
  >r heap begin dup (heap?) while n@ dup r@ + 0> while (>node) repeat r>
;                                      \ find free space
                                       \ merge at a single node
: (merge)                              ( a --)
  begin
    dup n@ over over (>node) (heap?)   \ get next node
  while                                \ if we're not out of heap space
    n@ dup 0<                          ( a n1 n2 f)
  while                                \ if free space as well
    + nell- over n!                    \ merge it with the current node
  repeat drop drop drop                \ drop all addresses
;
                                       \ merge entire heap
: (mergeall)                           ( --)
  heap begin
    (heap?)                            \ if we're not out of heap space
  while                                \ if free space, merge it
    dup n@ dup 0< if over (merge) drop dup n@ then (>node)
  repeat drop                          \ examine next node
;
                                       \ save new node and merge
: (node!) over n! (merge) ;            ( a n --)

: (allocate)                           ( n -- a f)
  dup 0> if                            \ if a valid reqeust
    (findfree) over 0<                 \ freespace is negative
    if                                 \ if free space found
      over over nell+ + 0<             \ if not all consumed, leave free space
      if tuck nell+ tuck + >r >r over n! dup r> + r> (node!)
      else drop abs over n!            \ else take it all
      then nell+ false                 \ success, return address
    else                               \ otherwise
      or 0<>                           \ allocation failed
    then
  else                                 \ not a valid request
    true                               \ return error
  then
;
                                       ( a -- f)
: cfree nell- dup n@ dup 0> if negate (node!) false else or 0<> then ;
: callocate dup (allocate) if drop (mergeall) (allocate) else swap 0= then ;
                                       ( n -- a f)
: cresize                              ( a1 n -- a2 f)
  dup 0> if                            \ if a valid request
    over callocated over over - dup nell negate <
    if                                 \ shrink the segment
      nell+ >r drop >r dup nell- r@ over n! r> (>node) r> (node!) false
    else                               \ reallocate the segment
      0> if swap callocate if or 0<> else swap (transfer) swap cfree then
      else or 0= then                  \ leave segment alone
    then
  else                                 \ if not a valid request
    0> 0=                              \ constuct a true flag
  then
;
                                       \ if not used with CELL heap
[UNDEFINED] forcecellheap [IF]         \ create aliases
  aka callocate allocate
  aka cfree free
  aka cresize resize
  aka callocated allocated
[THEN]

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
