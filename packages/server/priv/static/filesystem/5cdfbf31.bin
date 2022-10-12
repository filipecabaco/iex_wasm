\ 4tH library - get string between delimiters - Copyright 2016 J.L. Bezemer
\ You can redistribute this file and/or modify it under
\ the terms of the GNU General Public License

[UNDEFINED] enclose [IF]               ( c a1 a2 -- c a3 a2)
: (char>) >r begin dup r@ < while over over c@ <> while char+ repeat r> ;
                                       \ get string between c1 and c2
: enclose                              ( c1 c2 a1 n1 -- a2 n2)
  chars over + >r rot swap r> (char>)  \ find first delimiter
  >r dup r@ < if char+ then nip tuck r> (char>)
  drop nip over -                      \ find second delimiter
;                                      \ now calculate length

[DEFINED] 4TH# [IF] hide (char>) [THEN]
[THEN]

\ s" This is (THE) end" pad place char ( char ) pad count enclose type cr