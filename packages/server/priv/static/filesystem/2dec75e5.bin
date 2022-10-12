\ 4tH library - ID Operating System - Copyright 2011 J.L. Bezemer
\ You can redistribute this file and/or modify it under
\ the terms of the GNU General Public License

[UNDEFINED] id-system [IF]
-1 constant Unknown
 0 constant Unix
 1 constant Microsoft

: id-system                            ( -- n)
  cin >r s" echo" input pipe + open error?
  if                                   \ open a pipe to ECHO
    drop Unknown                       \ if it fails, return "Unknown"
  else                                 \ if it succeeds, read the line
    dup use refill if 0 parse nip 0> else Unknown then swap close
  then r> use                          \ if nothing is returned, it is Unix
;                                      \ restore the input channel
[THEN]