\ 4tH library - ARG-OPEN - Copyright 2004,2008 J.L. Bezemer
\ You can redistribute this file and/or modify it under
\ the terms of the GNU General Public License

[UNDEFINED] ARG-OPEN [IF]
                                       \ open a file and abort on error
: arg-open                             ( m n -- h)
  args 2dup 2>r rot open error?        ( h f)
  if                                   ( h)
     stdout use                        \ force use of stdout
     ." Cannot open "                  \ write message
     2r> type cr abort                 \ write filename
  else                                 ( h)
     dup use 2r> 2drop                 \ use file, clear return stack
  then                                 ( h)
;
[THEN]


