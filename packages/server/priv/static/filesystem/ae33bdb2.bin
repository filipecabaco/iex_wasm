\ 4tH library - Lightweight Dynamic Strings - Copyright 2020, 2021 J.L. Bezemer
\ You can redistribute this file and/or modify it under
\ the terms of the GNU General Public License
\ include lib/anstools.4th

[UNDEFINED] ds.place [IF]
[UNDEFINED] 2!       [IF] include lib/anscore.4th [THEN]
[UNDEFINED] cfree    [IF] include lib/memchar.4th [THEN]
[UNDEFINED] E.LIBERR [IF] include lib/throw.4th   [THEN]

[UNDEFINED] /ds.pool [IF]
  128 constant /ds.pool
[THEN]

/ds.pool array (ds.pool)               \ dstring pool
       2 array (ds.vars)               \ holds the dstring variables

: (ds.free) cfree E.LIBERR throw" Cannot free dstring" ;
: (ds.range) (ds.pool) /ds.pool ;      ( -- x n)
                                       \ find a free slot
: (ds.find)                            ( -- f)
  (ds.range) bounds ?do                \ search entire pool
    i @ (error) = if i unloop ;then    \ if found, return address
  1 cells +loop (error)                \ otherwise return (ERROR)
;
                                       \ is a dstring unused?
: (ds.unused)                          ( x -- f)
  dup @ (error) = if drop false ;then  \ signal "used" when not allocated
  true (ds.vars) 2@ bounds             \ seach all dstring vars for address
  ?do over i @ = if 0= leave then 1 cells +loop nip
;
                                       \ compact the dstring pool
: ds.compact                           ( -- f)
  true (ds.pool) begin                 \ start with the pool
    dup (ds.range) cells + <           \ not reached the end yet?
  while
    dup (ds.unused) if nip false swap dup @ (ds.free) (error) over ! then
    cell+                              \ if unused, clear it, set flag
  repeat drop                          \ test next pool element
;
                                       \ free all allocated dstrings
: ds.destroy                           ( --)
  (ds.range) bounds ?do i @ error? if drop else (ds.free) then 1 cells +loop
;                                      \ free all strings in the pool
                                       \ count a dstring
: ds.count @ @ count ;                 ( x -- a n)
: ds.free 0 (ds.range) bounds ?do i @ (error) = if 1+ then 1 cells +loop ;
: ds.clear (ds.range) bounds ?do (error) i ! 1 cells +loop ;
: ds.build (ds.vars) 2! ds.clear ;     ( x n --)
                                       \ place a dstring
: ds.place                             ( a n x --)
  (ds.find) error? if                  \ did we find an open slot
    drop ds.compact E.LIBERR throw" Too many dstrings" recurse
  else                                 \ if not, compact pool and try again
    >r over 1+ callocate E.LIBERR throw" Cannot allocate dstring"
    r@ ! r> over ! @ @ place           \ if so, save string in pool
  then
;
                                       \ append string to a dstring
: ds+place                             ( a n x --)
  over over ds.count rot + 1+ cresize E.LIBERR throw" Cannot append string"
  dup rot @ ! +place                   \ resize current string and append
;

[DEFINED] 4TH# [IF]
  hide (ds.pool)
  hide (ds.vars)
  hide (ds.free)
  hide (ds.range)
  hide (ds.find)
  hide (ds.unused)
[THEN]
[THEN]

