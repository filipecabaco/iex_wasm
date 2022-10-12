\ 4tH library - CharAt - Copyright 2009 J.L. Bezemer
\ You can redistribute this file and/or modify it under
\ the terms of the GNU General Public License

[UNDEFINED] charat [IF]                \ normal character search
: charat                               ( a1 n1 c -- a2 f)
  >r bounds                            \ calculate addresses
  begin over over >  while dup c@ r@ <> while 1+ repeat
  r> drop tuck <>                      \ make flag and cleanup
;
                                       \ reverse character search
: -charat                              ( a1 n1 c -- a2 f)
  >r bounds 1- swap 1-                 \ calculate addresses
  begin over over < while dup c@ r@ <> while 1- repeat
  r> drop tuck <>                      \ make flag and clean up
;
                                       \ TRUE when character in string
: charin charat nip ;                  ( a n c -- f)
[THEN]