\ Taken from:
\ http://www.thelearningpoint.net/computer-science/trees/binary-search-trees---c-program-source-code-and-documentation
\ Assumed to be in the public domain
\ 4tH translation - Copyright 2016, 2020 J.L. Bezemer
\ You can redistribute this file and/or modify it under
\ the terms of the GNU General Public License

[UNDEFINED] find-node [IF]
[UNDEFINED] free      [IF] include lib/memcell.4th  [THEN]
[UNDEFINED] NULL      [IF] include lib/constant.4th [THEN]
[UNDEFINED] E.LIBERR  [IF] include lib/throw.4th    [THEN]

struct
  field: (key)                         \ key of the node
  field: (val)                         \ value of the node
  field: (left)                        \ link to lesser key
  field: (right)                       \ link to greater key
end-struct (/node)                     \ size of node
                                       \ is it NULL?
: null? NULL over = ;                  ( n -- n f)
                                       \ find the minimum key
: find-min                             ( node1 -- node2)
  null? 0= if dup -> (left) @ null? if drop else nip recurse then then
;
                                       \ find the maximum key
: find-max                             ( node1 -- node2)
  null? 0= if dup -> (right) @ null? if drop else nip recurse then then
;
                                       \ find a specific key
: find-node                            ( n node1 -- node2)
  null? if nip exit then               \ don't do NULL pointers
  over over -> (key) @ = if nip exit then
  over over -> (key) @ > if -> (right) else -> (left) then @ recurse
;
                                       \ insert a new node
: insert-node                          ( value key node1 -- node2)
  null?                                \ if the pointer is NULL
  if
    drop (/node) allocate              \ allocate a node
    if                                 \ if allocation fails, return NULL
      drop drop drop NULL
    else                               \ otherwise, init node
      >r r@ -> (key) ! r@ -> (val) ! NULL dup
      r@ -> (left) ! r@ -> (right) ! r>
    then                               \ there is nothing to do as the
  else                                 \ data is already in the tree
    over over -> (key) @ = if nip nip exit then
    over over -> (key) @ > over >r     \ otherwise recurse
    if -> (right) else -> (left) then dup >r @ recurse r> ! r>
  then
;
                                       \ delete a node
: delete-node                          ( key node1 -- node2)
  null? if nip exit then               \ if root is NULL, return
  over over -> (key) @ <               \ if key is smaller, recurse
  if dup >r -> (left) dup >r @ recurse r> ! r> exit then

  over over -> (key) @ >               \ if key is bigger, recurse
  if dup >r -> (right) dup >r @ recurse r> ! r> exit then nip
                                       \ if both pointers are not NULL
  dup -> (right) @ NULL <> over -> (left) @ NULL <> and
  if                                   \ here we will replace with minimum
    dup -> (right) @ find-min          \ element in the right sub tree
    over -> (key) over -> (key) @ swap !
    -> (key) @ over -> (right) @ recurse over -> (right) !
  else                                 \ if there is only one or zero children
    dup -> (left) @ NULL =             \ then we can directly remove it and
    if dup -> (right) @                \ connect its parent to its child
    else dup -> (right) @ NULL = if dup -> (left) @ else dup then
    then swap free E.LIBERR throw" Cannot free node"
  then
;
                                       \ destroy entire binary tree
: destroy-tree                         ( rootnode --)
  null? if drop exit then              \ don't do NULL pointers
  dup -> (left)  @ null? if drop else recurse then
  dup -> (right) @ null? if drop else recurse then
  free E.LIBERR throw" Cannot free node"
;                                      \ recurse left and right nodes
                                       \ some access words
: get-key -> (key) @ ;                 ( node -- key)
: get-value -> (val) @ ;               ( node -- value)
: set-value -> (val) ! ;               ( value node --)

[DEFINED] printtree [IF]               \ optional print functions
: in-order                             ( node --)
  null? if
    drop
  else
    dup >r -> (left) @ recurse r@ -> (key) ? r> -> (right) @ recurse
  then
;

: pre-order                            ( node --)
  null? if
    drop
  else
    dup >r -> (key) ? r@ -> (left) @ recurse r> -> (right) @ recurse
  then
;

: post-order                           ( node --)
  null? if
    drop
  else
    dup >r -> (left) @ recurse r@ -> (right) @ recurse -> r> (key) ?
  then
;
[THEN]

[DEFINED] 4TH# [IF]
  hide (key)
  hide (val)
  hide (left)
  hide (right)
  hide (/node)
[THEN]
[THEN]
