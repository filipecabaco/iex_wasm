\ 4tH library - SEARCH (STRING) - Copyright 2003,2017 J.L. Bezemer
\ You can redistribute this file and/or modify it under
\ the terms of the GNU General Public License

[UNDEFINED] search  [IF]
[UNDEFINED] compare [IF] include lib/compare.4th [THEN]

: search                               ( a1 n1 a2 n2 -- a3 n3 f)
  swap >r >r 2dup                      \ save search string for backup
  begin                                \ compare substring
    2dup r@ min r'@ r@ compare         \ if not equal, continue
  while                                \ if not found, return backup string
    dup if chop else 2drop r> drop r> dup xor exit then
  repeat 2nip r> r> drop drop true     \ if found, discard backup string
;
[THEN]

\ S" abcdefghijklmnopqrstuvwxyz" sconstant s1
\ S" abc" sconstant s2
\ S" jklmn" sconstant s3
\ S" z" sconstant s4
\ S" mnoq" sconstant s5
\ S" 12345" sconstant s6

\ s1 s2 SEARCH . . . cr                  \ true,  len: 26
\ s1 s3 SEARCH . . . cr                  \ true,  len: 17
\ s1 s4 SEARCH . . . cr                  \ true,  len:  1
\ s1 s5 SEARCH . . . cr                  \ false, len: 26
\ s1 s6 SEARCH . . . cr                  \ false, len: 26
\ s1 0 0 SEARCH . . . cr                 \ true,  len: 26