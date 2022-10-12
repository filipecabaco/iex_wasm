\ 4tH library - CSV converter - Copyright 2013 J.L. Bezemer
\ You can redistribute this file and/or modify it under
\ the terms of the GNU General Public License

\ Converts a CSV field to a standard string. Modifies the input string!

[UNDEFINED] csv> [IF]
: csv>                                 ( a n1 -- a n2)
  true -rot cells over + over dup >r   ( f a1 a2 a1)
  ?do                                  \ scan the whole string
     i c@ over over swap c! [char] " = \ is it a quote?
     if over if char+ then >r 0= r> else char+ >r true and r> then
  loop r> rot drop tuck -              \ calculate length
;
[THEN]

\ s| ""stan""dard""| csv> type cr depth .