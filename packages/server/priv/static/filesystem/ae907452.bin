\ 4tH library - Priority queue - Copyright 2020 J.L. Bezemer
\ You can redistribute this file and/or modify it under
\ the terms of the GNU General Public License

[UNDEFINED] pq.new   [IF]
[UNDEFINED] allocate [IF] include lib/memcell.4th  [THEN]
[UNDEFINED] NULL     [IF] include lib/constant.4th [THEN]
[UNDEFINED] E.LIBERR [IF] include lib/throw.4th    [THEN]
\ include lib/anstools.4th

struct
  field: (data)                        \ data field
  field: (prio)                        \ priority
  field: (next)                        \ next link
end-struct (/pq)

: pq.new                               ( data prio -- node)
  (/pq) allocate E.LIBERR throw" Cannot create node" >r
  r@ -> (prio) ! r@ -> (data) ! NULL r@ -> (next) ! r>
;

: (pq.find)                            ( prio node1 -- node2)
  begin                                \ end of linked list?
    dup -> (next) @ NULL <>            ( prio node1 f) 
  while                                \ priority still higher?
    over over -> (next) @ -> (prio) @ >
  while                                \ get next link
    -> (next) @
  repeat nip                           \ drop the priority
;
                       
: pq.peek dup -> (data) @ ;            ( node -- node data)
: pq.empty? dup NULL = ;               ( node -- node f)
: pq.pop dup -> (next) @ swap free E.LIBERR throw" Cannot free node" ;
                                       ( node1 -- node2)
: pq.push                              ( data prio node1 -- node2)
  >r r@ -> (prio) @ over > >r pq.new r>  ( node2 f r: head)
  if r> over -> (next) ! ;then
  dup -> (prio) @ r@ (pq.find)         ( node3)
  over over -> (next) @ swap -> (next) ! -> (next) ! r>
;

[DEFINED] 4TH# [IF]
  hide (data)
  hide (prio)
  hide (next)
  hide (/pq)
  hide (pq.find)
[THEN]
[THEN]

\ 4 1 pq.new >r 5 2 r> pq.push >r 6 3 r> pq.push >r 7 0 r> pq.push >r
\ begin r> pq.empty? except pq.peek . pq.pop >r repeat drop cr depth .

