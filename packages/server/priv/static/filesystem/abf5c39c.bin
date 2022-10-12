\ 4tH library - TOOLKIT FILE - Copyright 2010,2012 J.L. Bezemer
\ You can redistribute this file and/or modify it under
\ the terms of the GNU General Public License
\ Inspired by the Toolkit File utilities by Wil Baden

[UNDEFINED] spit [IF]
: file? open error? dup ;              ( a1 n2 -- f f)
: seek? swap over use over seek swap ; ( n1 h -- f h)

: (spit)                               ( a1 n1 a2 n2 fam -- f)
   cout >r file? >r                    ( a1 n1 h f)
   if drop 2drop else dup use >r type r> close then r> r> use
;

: spit output (spit) ;                 ( a1 n1 a2 n2 -- f)
: +spit output append + (spit) ;       ( a1 n1 a2 n2 -- f)

: spit!                                ( a1 n1 a2 n2 n3 -- f)
  cin cout 2>r -rot input output + file? >r
  if                                   ( a1 n1 n3 h)
    drop drop 2drop                    ( --)
  else                                 ( a1 n1 n3 h)
    seek? >r if 2drop else type then r> close
  then r> 2r> use use                  ( f)
;                                      ( f)

: slurp                                ( a1 n1 a2 n2 -- a1 n3 f)
  cin >r input file? >r
  if drop dup xor else dup use >r over swap accept r> close then r> r> use
;                                      ( a1 n3 f)

: slurp@                               ( a1 n1 a2 n2 n3 -- a1 n4 f)
  cin >r -rot input file? >r           ( a1 n1 n3 h f)
  if                                   ( a1 n1 n3 h)
    drop drop dup xor                  ( a1 0)
  else                                 ( a1 n1 n3 h)
    seek? >r if dup xor else over swap accept then r> close 
  then r> r> use                       ( a1 n4 f)
;

[DEFINED] 4TH# [IF]
  hide file?
  hide seek?
  hide (spit)
[THEN]
[THEN]