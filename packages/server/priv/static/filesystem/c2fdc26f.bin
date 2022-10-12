\ 4tH library - Extract/Transform/Load - Copyright 2017 J.L. Bezemer
\ You can redistribute this file and/or modify it under
\ the terms of the GNU General Public License

[UNDEFINED] /etl       [IF]
[UNDEFINED] row        [IF] include lib/row.4th      [THEN]
[UNDEFINED] selectsort [IF] include lib/sel2sort.4th [THEN]

3 constant /fieldmap                   \ size of a fieldmap
3 constant /etl                        \ size of ETL structure

/etl array (temp)                      \ required for sorting
                                       \ analyze a header
: read-header                          ( trans map read -- trans len)
  ['] precedes defer@ >r ['] exchange defer@ >r
                                       \ save execution semantics
  2>r 0 over begin                     \ set up field counter
    2r@ execute dup                    \ abort if no fieldname
  while                                \ now look up the field
    rot /fieldmap string-key row       ( n1 t a n2 x f)
    if                                 \ if found, fill record
      >r 2drop over over ! cell+ dup r@ cell+ @c swap !
      cell+ dup r> 2 cells + @c swap ! cell+
    else                               \ if not found, drop it
      drop 2drop
    then swap 1+ swap                  \ increment field counter
  repeat 2r> 2drop 2drop drop nip      \ clean up
                                       \ set up sorting routine
  [: >r /etl * cells r@ + @ swap /etl * cells r> + @ swap < ;] is precedes
  [: >r /etl * cells r@ + swap /etl * cells r> +
     dup (temp) /etl smove tuck /etl smove (temp) swap /etl smove ;]
  is exchange                          \ now sort it and restore
                                       \ execution semantics
  over - /etl cells / over over selectsort r> is exchange r> is precedes
;
                                       \ read a line of stuff
: read-tuple                           ( trans len buffer read --)
  >r >r /etl * cells over + >r 0       ( trans 0 r: read buffer trans')
  begin                                \ put some stuff on the return stack
    over r@ <                          \ have we read the last field?
  while                                \ do we have to read this field?
    over @ over = j execute rot        \ get the field (a bit dirty)
    if                                 \ put in the correct place
      2>r swap cell+ dup @ chars 2r> rot r'@ + over >r dup >r place
      cell+ dup @ r> r> rot execute cell+ swap
    else                               \ otherwise drop it
      2drop
    then 1+                            \ increment field counter
  repeat drop drop r> drop r> drop r> drop
;                                      \ clean up

[DEFINED] 4TH# [IF] hide (temp) [THEN]
[THEN]