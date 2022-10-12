\ 4tH library - String buffers - Copyright 2010, 2020 J.L. Bezemer
\ You can redistribute this file and/or modify it under
\ the terms of the GNU General Public License

[UNDEFINED] str-buffer [IF]            ( a1 n1 --)
[UNDEFINED] nell+      [IF] include lib/ncoding.4th [THEN]
[UNDEFINED] compare    [IF] include lib/compare.4th [THEN]
[UNDEFINED] E.LIBERR   [IF] include lib/throw.4th   [THEN]

: str-buffer over dup nell+ nell+ swap n! over nell+ >r chars + r> n! ;
                                       \ store a string unconditionally
: >str-buffer                          ( a1 n1 a2 -- a3)
  dup n@ >r over 1+ chars r@ + tuck over n!
  nell+ n@ > E.LIBERR throw" String buffer full" r@ place r>
;                                      \ else store the string
                                       \ find a string
: str-buffer?                          ( a1 n1 a2 -- a3 n1 f)
  dup n@ >r nell+ nell+                \ calculate begin and end addresses
  begin
    dup r@ <                           \ still within string area?
  while                                \ if so, see if the string is the same
    >r 2dup r@ count dup >r compare    \ if so, exit else go to next string
    if r> 1+ chars r> + else 2drop r> r> swap r> drop true exit then
  repeat                               \ if not found, discard addresses
  r> drop drop false                   \ and return false flag
;
                                       \ user defined action with every string
: each-str                             ( xt a2 --)
  dup n@ >r nell+ nell+                \ calculate begin and end addresses
  begin
    dup r@ <                           \ still within string area?
  while                                \ if so, execute the callback word
    dup >r count dup >r rot dup >r execute r> r> 1+ chars r> +
  repeat
  r> drop drop drop                    \ discard addresses and execution token
;                                      \ store a unique string
                                       ( a1 n1 a2 --)
: str-buffer!                          \ try to find the string
  dup >r str-buffer? if r> drop 2drop else r> >str-buffer drop then
;                                      \ if not found, store it, else abort
[THEN]

\ 1024 constant /buffer
\ /buffer string buffer
\ buffer /buffer str-buffer
\ s" This is the end" buffer >str-buffer count type cr
\ s" Beautiful friend" buffer >str-buffer count type cr
\ s" Beautiful friend" buffer str-buffer!
\ : print-str type cr ;                ( ?? a n -- ??)
\ ' print-str buffer each-str depth .
