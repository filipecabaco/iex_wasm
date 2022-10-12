\ 4tH library - >IDENTIFIER - Copyright 2014 J.L. Bezemer
\ You can redistribute this file and/or modify it under
\ the terms of the GNU General Public License

[UNDEFINED] >identifier [IF]
[UNDEFINED] char>lower  [IF] include lib/ulcase.4th  [THEN]
[UNDEFINED] -leading    [IF] include lib/leading.4th [THEN]
                                       \ change one character
: (substitute)                         ( a n xt -- a n)
  >r over dup c@ dup r> execute        \ execute test
  if char>lower else drop [char] _ then swap c!
;                                      \ change to lower case or underscore
                                       \ change string to identifier
: >identifier                          ( a n -- a n)
  -leading -trailing 2dup dup          \ strip all spaces
  if ['] is-alpha (substitute) chop then
  begin dup while ['] is-alnum (substitute) chop repeat 2drop
;                                      \ change remainder of string

[DEFINED] 4TH# [IF] hide (substitute) [THEN]
[THEN]
