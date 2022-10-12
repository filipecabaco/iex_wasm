\ 4tH library - STACK - Copyright 2004,2007 J.L. Bezemer
\ You can redistribute this file and/or modify it under
\ the terms of the GNU General Public License

[UNDEFINED] STACK [IF]
: stack dup ! ;                        ( stack --)
: a@ @ @ ;                             ( stack -- n) 
: >a 1 cells over +! @ ! ;             ( n stack --) 
: a> dup a@ -1 cells rot +! ;          ( stack -- n)
: adepth dup @ swap - ;                ( stack -- n)
[THEN]
