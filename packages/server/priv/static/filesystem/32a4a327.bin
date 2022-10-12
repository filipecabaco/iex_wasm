\ 4tH library - PARSE-NAME - Copyright 2005,2010 J.L. Bezemer
\ You can redistribute this file and/or modify it under
\ the terms of the GNU General Public License

[UNDEFINED] PARSE-NAME [IF]
[UNDEFINED] ?NOT [IF]
include lib/yesno.4th
[THEN]
                                       \ parse WS delimited string
: (PARSE-WS)                           ( -- c n a)
  is ?NOT source drop >in @ chars + dup >r
  begin dup c@ dup while dup bl > ?NOT while drop 1+ repeat
  swap r@ - dup >in +! r>
;
                                       ( -- a n)
: PARSE-WS ['] (YES) (PARSE-WS) swap rot if 1 >in +! then ;
: OMIT-WS ['] (NO) (PARSE-WS) 2drop drop ;
: PARSE-NAME omit-ws parse-ws ;        ( -- a n)

[DEFINED] 4TH# [IF]
  hide (PARSE-WS)
[THEN]
[THEN]