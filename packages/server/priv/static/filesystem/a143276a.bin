\ 4tH library - ANS MEMORY - Copyright 2004,2012 J.L. Bezemer
\ You can redistribute this file and/or modify it under
\ the terms of the GNU General Public License

[UNDEFINED] allocate [IF]

[UNDEFINED] /paragraph [IF]
  [UNDEFINED] forcecellheap [IF]
    32 constant /paragraph             \ size of a paragraph in chars
  [ELSE]
    32 /cell / constant /paragraph     \ size of a paragraph in cells
  [THEN]
[THEN]

[UNDEFINED] #paragraph [IF]
512 constant #paragraph                \ number of paragraphs
[THEN]

#paragraph array HAT                   \ Heap Allocation Table
#paragraph /paragraph *                \ the heap itself

[DEFINED] forcecellheap [IF]           \ force a cell based heap
array heap                             \ allocate heap
aka smove transfer
[ELSE]                                 \ standard SMOVE
buffer: heap                           \ allocate heap
aka cmove transfer                     \ standard CMOVE
[THEN]
                                       ( a -- h# f)
: addr>HAT heap - /paragraph /mod swap over 0< or 0= over #paragraph < and ;
: HAT! ?do dup HAT i th ! loop ;       ( n1 n2 n3 -- n1)
: (paragraph) 0 max /paragraph 1- + /paragraph / ;
                                       \ return allocated memory size
: (allocated)                          ( a -- h# n)
  dup >r addr>HAT                      \ convert address
  if dup begin HAT over th @ r@ = while 1+ dup #paragraph = until over -
  else 0                               \ return zero paragraphs
  then r> drop                         \ discard address
;
                                       \ return allocated memory in bytes
: allocated (allocated) nip /paragraph * ;
: free 0 swap (allocated) dup if bounds HAT! else drop drop 0= then ;
: paragraph (paragraph) /paragraph * ; ( n1 -- n2)
                                       \ allocate space on heap
: allocate                             ( n -- a f)
  (paragraph) >r 0 dup                 \ calculate the number of paragraphs
  begin                                \ set up: "candidate", "paragraph"
    dup #paragraph <                   \ are we at the end of the HAT?
  while                                \ if not the end of the HAT
    HAT over th @                      \ is this paragraph free?
    if
      nip 1+ dup                       \ if not, get next candidate
    else
      1+ over over swap - r@ >=        \ if it is, is there enough space?
      if drop dup /paragraph * heap + over r> + rot HAT! false exit then
    then                               \ if so, allocate it and return address
  repeat r> drop drop true             \ there wasn't enough contiguous space
;
                                       \ resize an allocated memory block
: resize                               ( a1 n -- a2 f)
  >r dup allocated dup dup             ( a1 n n f)
  if                                   ( a1 n n)
    drop r@ paragraph over >           ( a1 n f)
    if                                 ( a1 n)
      over swap r> allocate if >r else tuck >r transfer free r> swap exit then
    else                               ( a1 n)
      over addr>HAT                    ( a1 n h# f)
      if 0 -rot dup r> (paragraph) + >r swap /paragraph / + r> HAT! exit then
    then                               ( a1 n h#)
  then r> drop drop drop true          ( a1 f)
;

[DEFINED] debug-mem [IF]
: .HAT
  cr ." ---------"
  #paragraph 0 do i cr ." [" 2 .r ." ] " HAT i th @ 4 .r loop
  cr ." ---------" cr ;
[THEN]

[DEFINED] 4TH# [IF]
  hide HAT
  hide HAT!
  hide addr>HAT
  hide heap
  hide #paragraph
  hide /paragraph
  hide (paragraph)
  hide (allocated)
  hide transfer
[THEN]
[THEN]
