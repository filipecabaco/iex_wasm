\ 4tH library - Linux-like logger - Copyright 2012,2020 J.L. Bezemer
\ You can redistribute this file and/or modify it under
\ the terms of the GNU General Public License

[UNDEFINED] >logger  [IF]
[UNDEFINED] E.LIBERR [IF] include lib/throw.4th   [THEN]
[UNDEFINED] logtime  [IF] include lib/logtime.4th [THEN]

file (logger)                          \ logger handle

: init-logger stdout to (logger) ;     ( --)
: close-logfile (logger) close ;       ( --)

: (open-logfile) 
  open error? E.LIBERR throw" Cannot initialize logger" to (logger)
;

: init-logfile output (open-logfile) ; ( a n --)
: use-logfile append (open-logfile) ;  ( a n --)
                                       \ issue a message
: >logger                              ( a1 n1 a2 n2 --)
  cout >r (logger) use init-logtime .logtime space type ." : " type cr r> use
;                                      \ issue message and reset handle

[DEFINED] 4TH# [IF]
  hide (logger)
  hide (open-logfile)
[THEN]
[THEN]
