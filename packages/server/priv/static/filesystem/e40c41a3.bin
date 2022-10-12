\ 4tH library - INTERPRET-FILE - Copyright 2011 J.L. Bezemer
\ You can redistribute this file and/or modify it under
\ the terms of the GNU General Public License

[UNDEFINED] interpret-file [IF]
[UNDEFINED] interpret      [IF] include lib/interprt.4th [THEN]
: interpret-file                       ( a n -- f)
  cin >r input open error? dup >r      \ open file, save flag and execute
  if drop else dup use begin refill while ['] interpret catch until close then
  r> r> use                            \ restore original stream
;
[THEN]