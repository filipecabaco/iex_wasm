\ 4tH library - string CONCAT - Copyright 2012 J.L. Bezemer
\ You can redistribute this file and/or modify it under
\ the terms of the GNU General Public License

[UNDEFINED] concat [IF]
variable __concat                      \ destination address

: concat                               ( a1 n1 .. ai ni i a2 -- a2 n2) 
  __concat ! 1- dup                    \ save destination, setup counter
  begin dup while rot >r rot >r 1- repeat drop >r __concat @ place r>
  begin dup while r> r> __concat @ +place 1- repeat drop __concat @ count
;                                      \ first transfer to Rstack, then append

[DEFINED] 4TH# [IF] hide __concat [THEN]
[THEN]

\ 64 string target 
\ s" This " s" is " s" the " s" end." 4 target concat type cr depth .