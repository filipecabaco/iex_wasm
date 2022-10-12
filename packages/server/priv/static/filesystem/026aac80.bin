(   gc.f)
(   scope tracking and garbage collection)
(   placed in the public domain by Jim Schneider, 17 September 1996)

[UNDEFINED] gc-alloc      [IF]
[UNDEFINED] forcecellheap [IF]
  [DEFINED] allocate [IF] [ABORT] [ELSE] include lib/memcell.4th [THEN]
[THEN]

[UNDEFINED] forcecellgc   [IF]
  [UNDEFINED] callocate   [IF] include lib/memchar.4th [THEN]
  aka cresize   xresize                \ aliases for cell garbage collection
  aka callocate xalloc
  aka cfree     xfree
  aka nell+     node+
  aka nell-     node-
  aka n@        node@
  aka n!        node!
[ELSE]
  aka resize    xresize                \ aliases for char garbage collection
  aka allocate  xalloc
  aka free      xfree
  aka cell+     node+
  aka cell-     node-
  aka @         node@
  aka !         node!
[THEN]

62 constant #nodes                     \ number of nodes/block

variable freelist
variable blocklist
variable cur-scope
                                       ( Add 62 nodes to the free list)
: extend-freelist                      ( --)
  #nodes 2* 1+ cells allocate throw blocklist @ over ! dup blocklist ! cell+
  freelist @ over freelist ! swap #nodes 0
  do dup cell+ cell+ over ! cell+ cell+ loop
  cell- cell- ! ;
                                       ( Draw a node from the freelist)
: draw-node                            ( -- node-t)
  freelist @ dup 0=
  if drop extend-freelist freelist @ then
  dup @ freelist ! 0 over ! 0 over cell+ ! ;
                                       ( Return a node to the freelist)
: discard-node                         ( node-t --)
  freelist @ over ! 0 over cell+ ! freelist ! ;
                                       ( Allocate memory, track it in the current scope)
: gc-alloc                             ( size -- a-addr )
  draw-node swap node+ xalloc throw 2dup node! swap 2dup cell+ ! cur-scope @
  over ! cur-scope ! node+ ;
                                       ( Resize a previously allocated region of memory)
: gc-resize                            ( a-addr \ len -- a-addr')
  node+ swap node- dup node@ swap rot xresize throw
  2dup node! dup rot cell+ ! node+ ;
                                       ( Free a previously allocated block)
: gc-free                              ( a-addr --)
  node- 0 over node@ cell+ ! xfree throw ;
                                       ( Start a scope for garbage collection)
: start-scope                          ( -- scope-t)
  cur-scope @ 0 cur-scope ! ;
                                       ( End the current scope, discard its storage)
: end-scope                            ( scope-t --)
  cur-scope @ swap cur-scope !
  begin dup while dup cell+ @ dup if xfree throw else drop then @ repeat drop ;
                                       ( Start garbage collection)
: start-gc                             ( --)
  0 dup dup freelist ! blocklist ! cur-scope ! ;
                                       ( Stop garbage collection, free freelist)
: end-gc                               ( --)
  blocklist @ begin dup while dup @ swap free throw repeat drop ;

[DEFINED] 4TH# [IF]
  hide #nodes
  hide freelist
  hide blocklist
  hide cur-scope
  hide extend-freelist
  hide xalloc
  hide xresize
  hide xfree
  hide node+
  hide node-
  hide node@
  hide node!
[THEN]
[THEN]
