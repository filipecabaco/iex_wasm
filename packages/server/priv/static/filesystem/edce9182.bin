\ Binary search tables - Copyright 2019 J.L. Bezemer
\ You can redistribute this file and/or modify it under
\ the terms of the GNU General Public License

\ Typical use:
\   10 constant /bstable
\   /bstable array bstable

\   bstable /bstable bs.init
\   5 bstable bs.insert if drop drop else bs.entry bs.value 25 swap ! then
\   5 bstable bs.find   if bs.entry bs.value ? else drop drop then
\   5 bstable bs.delete if ." Success" else ." Failure" then cr

[UNDEFINED] bs.find [IF]
[UNDEFINED] bsearch [IF] include lib/bsearch.4th [THEN]

struct
  field: (siz)                         \ max entries in table
  field: (cur)                         \ entries used in table
end-struct bs.head                     \ size of table header
                                       \ get value field of entry
aka cell+ bs.value                     ( x1 -- x2)
                                       ( x n --)
: bs.init bs.head - 2/ over -> (siz) ! 0 swap -> (cur) ! ;
: bs.entry 2* cells bs.head + + ;      ( x1 n -- x2)
: (bs.move) dup if smove ;then drop drop drop ;
: (bs.count) over -> (cur) @ over - 2* cells ;
                                       ( x n1 -- x n1 n2)
: bs.find                              ( n1 x -- x n2 f)
  ['] b-compare defer@ >r ['] get-key defer@ >r
  [: swap 2* cells + @ ;] is get-key
  [: over over < negate -rot > + ;] is b-compare
  tuck dup bs.head + swap -> (cur) @ bsearch 
  r> is get-key r> is b-compare        \ save/restore execution semantics
;
                                       \ insert an item
: bs.insert                            ( n1 x -- x n2 f)
  stow bs.find dup >r                  \ find the entry
  if                                   \ if found, return entry
    rot drop                           ( x n2) 
  else                                 \ if not found, check entries
    over dup -> (cur) @ swap -> (siz) @ <
    if                                 \ if enough entries free, insert item
      (bs.count) >r over over bs.entry dup dup 2 cells + r> (bs.move)
      >r rot r> ! over 1 swap -> (cur) +!
    else                               \ if too many entries
      drop nip (error)                 \ return (error) as offset        
    then
  then r>                              \ retrieve flag 
; 
                                       \ delete an item
: bs.delete                            ( n1 x -- f)
  bs.find dup >r                       ( x n2 f)
  if                                   \ if entry is found
    1+ (bs.count) >r stow bs.entry dup 2 cells - r> (bs.move)
    -1 swap -> (cur) +!                \ delete and update count
  else                                 ( x n2)
    drop drop                          \ entry was not found 
  then r>                              \ retrieve flag
;

[DEFINED] 4TH# [IF]
  hide (siz)
  hide (cur)
  hide (bs.count)
  hide (bs.move)
[THEN]
[THEN]

