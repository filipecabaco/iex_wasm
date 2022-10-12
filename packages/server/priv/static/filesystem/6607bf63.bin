\ 4tH library - Tiny Dynamic Strings Array - Copyright 2021 J.L. Bezemer
\ You can redistribute this file and/or modify it under
\ the terms of the GNU General Public License

[UNDEFINED] ds.build [IF]
[UNDEFINED] ds.init  [IF] include lib/dstringt.4th [THEN]
[UNDEFINED] 2!       [IF] include lib/anscore.4th  [THEN]

2 array (ds.vars)                      \ holds the dstring variables
                                       ( v n --)
: ds.build 2dup (ds.vars) 2! bounds ?do i ds.init 1 cells +loop ;
: ds.destroy (ds.vars) 2@ bounds ?do i ds.free 1 cells +loop ;
                                       ( --)
[DEFINED] 4TH# [IF]
  hide (ds.vars)
[THEN]
[THEN]
