\ 4tH library - TRANSLATE - Copyright 2004,2010 J.L. Bezemer
\ You can redistribute this file and/or modify it under
\ the terms of the GNU General Public License

[UNDEFINED] TRANSLATE [IF]
\ Translates one group of characters, identified by a2/n2
\ in string a1/n1 into another set, identified by a3/n2.
\ Always returns a1/n1. If the translation strings are not
\ of equal length or have zero length, no translation is done.

: translate                            ( a1 n1 a2 n2 a3 n2 -- a1 n1)
  dup 0> >r rot over = r> and          ( a1 n1 a2 a3 n2 f)
  if                                   ( a1 n1 a2 a3 n2)
    rot swap >r >r >r 2dup r> -rot     ( a1 n1 a3 a1 n1)
    r> -rot r> -rot chars bounds       ( a1 n1 a3 a2 n2 a4 a5) 
    ?do                                ( a1 n1 a3 a2 n2) 
      dup >r -rot r> 0                 ( a1 n1 n2 a3 a2 n2 0) 
      do                               ( a1 n1 n2 a3 a2) 
        dup i chars + c@ j c@ =        ( a1 n1 n2 a3 a2 f)        
        if over i chars + c@ j c! leave then
      loop rot                         ( a1 n1 a3 a2 n2)
    loop                               ( a1 n1 a3 a2 n2)
  then 2drop drop                      ( a1 n1)
;
[THEN]
