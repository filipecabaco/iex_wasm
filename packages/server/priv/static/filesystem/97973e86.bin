\ 4tH library - GETOPTS - Copyright 2011 J.L. Bezemer
\ You can redistribute this file and/or modify it under
\ the terms of the GNU General Public License

[UNDEFINED] get-options [IF]
[UNDEFINED] row         [IF]
  include lib/row.4th
[THEN]

argn value option-index                \ first invalid option
                                       \ argument in next ARGS
: +argument                            ( n1 n2 -- n1+1 n2 a2 n3 )
  swap 1+ tuck argn <                  \ is there still an argument?
  if
    over args                          \ if valid, return argument
  else                                 \ else issue message
    ." Missing argument to option -" dup emit cr 0 dup
  then                                 \ and return empty string
;
                                       \ execute option in table
: get-option                           ( c a --)
  2 num-key row                        \ if found execute option
  if cell+ @c execute drop else drop ." Invalid option -" emit cr then
;                                      \ if not, issue message
                                       ( n1 a1 n2 -- argn a1 n2)
: end-arguments 2>r to option-index argn 2r> ;
                                       \ check a single argument
: check-argument                       ( a -- a)
  >r dup args over c@ [char] - =       \ if it is a valid option
  if                                   \ then evaluate it
    begin chop 2dup 0> while c@ dup while r@ get-option repeat drop
  else
    end-arguments                      \ else terminate scanning
  then 2drop 1+ r>                     \ all scanned, increment index
;
                                       \ get an optional argument
: get-argument                         ( n1 c a1 n2 -- n1 c a2 n3 a3 n4)
  >r chop dup 0> if r> -rot else 2drop r> +argument then 0 dup 2swap
;
                                       ( xt --)
: get-options 1 swap begin over argn < while check-argument repeat drop drop ;

[DEFINED] 4tH# [IF]
  hide +argument
  hide get-option
  hide check-argument
[THEN]
[THEN]

