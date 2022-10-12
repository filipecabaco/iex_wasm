\ 4tH library - ANS MEMORY demo - Copyright 2012 J.L. Bezemer
\ You can redistribute this file and/or modify it under
\ the terms of the GNU General Public License

\ [PRAGMA] forcecellheap

\ include lib/ansmem.4th
\ include lib/memchar.4th
include lib/memcell.4th

[DEFINED] forcecellheap [IF]
aka ! t!
aka @ t@
[ELSE]
aka c! t!
aka c@ t@
[THEN]

variable a
variable b
variable c
                                       \ displays size of allocation
: .size ." (" 0 .r ." )" cr ;
                                       \ allocate and init 8 elements
8 allocate abort" Cannot allocate A" dup a ! 
8 0 do i over i th t! loop allocated .size
                                       \ allocate and init 16 elements
16 allocate abort" Cannot allocate B" dup b ! 
16 0 do i over i th t! loop allocated .size
                                       \ require more space
a @ 32 resize abort" Cannot resize A" dup c !
32 0 do dup i th t@ . loop allocated .size
                                       \ require less space
b @ 4 resize abort" Cannot resize B" dup a !
4 0 do dup i th t@ . loop allocated .size
                                       \ free both allocations
c @ free abort" Cannot free C"
a @ free abort" Cannot free A"

depth .


