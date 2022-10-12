\ 4tH library - Tiny Dynamic Strings - Copyright 2020, 2021 J.L. Bezemer
\ You can redistribute this file and/or modify it under
\ the terms of the GNU General Public License
\ include lib/anstools.4th

[UNDEFINED] ds.place [IF]
[UNDEFINED] cfree    [IF] include lib/memchar.4th [THEN]
[UNDEFINED] E.LIBERR [IF] include lib/throw.4th   [THEN]

\ ds.free	v --
\ ds.init	v --
\ ds.place	a n v --
\ ds.count 	v -- a n
\ ds+place	a n v --
                                       ( n -- a a)
: (ds.alloc) dup 1+ callocate E.LIBERR throw" Cannot allocate dstring" dup ;
: ds.free @ cfree E.LIBERR throw" Cannot free dstring" ;
: ds.init >r s" $" (ds.alloc) r> ! place ;
: ds.place >r (ds.alloc) >r place r> r> dup ds.free ! ;
: ds.count @ count ;                   ( v -- a n)
                                       \ DS equivalent of +PLACE
: ds+place                             ( a n v --)
  over over @ count rot + (ds.alloc) rot drop rot count rot place
  swap >r dup >r +place r> r> dup ds.free !
;                                      \ create a new string and copy both

[DEFINED] 4TH# [IF]
  hide (ds.alloc)
[THEN]
[THEN]

