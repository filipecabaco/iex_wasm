\ 4tH library - PALINDROME? - Copyright 2010 J.L. Bezemer
\ You can redistribute this file and/or modify it under
\ the terms of the GNU General Public License

[UNDEFINED] palindrome? [IF]           \ this version is case-sensitive!
: palindrome?                          ( a n -- f)
  1- chars over +                      \ save string, calculate addresses
  begin
    over over <                        \ as long we didn't pass the middle
  while                                \ compare the characters
    over c@ over c@ =                  \ are they still equal?
  while
    1- swap 1+ swap                    \ increment pointers
  repeat >=                            \ evaluate addresses
;
[THEN]