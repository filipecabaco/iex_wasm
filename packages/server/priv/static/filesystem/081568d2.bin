\ 4tH library - BASENAME, DIRNAME - Copyright 2011,2013 J.L. Bezemer
\ You can redistribute this file and/or modify it under
\ the terms of the GNU General Public License

[UNDEFINED] dirname [IF]
char / value Directory_Separator       \ POSIX standard
                                       ( a1 n1 c -- a2 n2)
: <char/ >r begin dup while 1- 2dup chars + c@ r@ = until r> drop ;
: dirname Directory_Separator <char/ ; ( a1 n1 -- a2 n2)
: -ext [char] . <char/ ;               ( a1 n1 -- a2 n2)
                                       \ get the basename including extension
: basename                             ( a1 n2 -- a2 n2)
  2dup tuck dirname dup if 1+ then tuck chars + -rot - dup if 2swap then 2drop
;
                                       \ get just the extension
: extension                            ( a1 n1 -- a2 n2)
  dup >r dup >r chars + 0              \ save count, calculate end of string
  begin                                \ check length and whether dot is found
    r@ while over char- c@ [char] . <> while 1+ swap char- swap r> 1- >r
  repeat r> drop r> over = if dup xor then
;                                      \ adjust if string returned unchanged
                                       ( a1 n1 -- a2 n2)
: basename-ext basename 2dup extension nip if -ext then ;
[THEN]
