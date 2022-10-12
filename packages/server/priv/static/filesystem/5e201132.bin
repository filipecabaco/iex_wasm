\ 4tH library - POSIX STAT - Copyright 2011,2012 J.L. Bezemer
\ You can redistribute this file and/or modify it under
\ the terms of the GNU General Public License

[UNDEFINED] file-stat [IF]
s" X " sconstant access_time            \ format for access time
s" Y " sconstant modification_time      \ format for modification time
s" Z " sconstant change_time            \ format for change time

256 string stat_buf                     \ buffer for composing command
                                        \ return non-zero on error
: file-stat                             ( a1 n1 n2 -- n3 f)
  s" stat -c %" stat_buf place stat_buf +place stat_buf +place
  cin >r stat_buf count input pipe + open error? 0=
  if dup use refill if 0 parse number else (error) then swap close then
  error? r> use                         \ evaluate value and restore CIN
;

[DEFINED] 4TH# [IF]
  hide stat_buf
[THEN]
[THEN]

\ s" filestat.4th" access_time file-stat . . cr