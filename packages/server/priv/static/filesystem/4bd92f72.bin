\ 4tH library - INFO - Copyright 2014 J.L. Bezemer
\ You can redistribute this file and/or modify it under
\ the terms of the GNU General Public License

\ This library can be used to make information programs
\ Typical use:

\ offset info-eg
\   TAG info-eg entry1
\   c" This is an entry" 10 c,
\   c" And this too" 10 c,
\   0 c,
\   TAG info-eg entry2
\   c" This is a second entry" 10 c,
\   c" And this too" 10 c,
\   0 c,

\ create .info-eg
\   ," entry1" entry1 ,
\   ," entry2" entry2 ,
\   NULL ,
\ does> [: info-eg ;] is info-entry info ;

\ s" entry1" .info-eg

[UNDEFINED] info [IF]
[UNDEFINED] row  [IF] include lib/row.4th [THEN]

defer info-entry                       \ vector for the OFFSET
                                       \ show a section
: info                                 ( a n x --)
  2 string-key row                     \ find the proper section
  if                                   \ if found, get it's address
    cell+ @c begin                     \ get the next character
      dup info-entry dup               \ if it isn't a NULL character
    while                              \ then print it, unless it's a newline
      dup 10 = if drop cr else emit then 1+
    repeat drop drop 2drop             \ if so issue CR and increment counter
  else                                 \ drop address, char and string
    drop .| No info on "| type [char] " emit cr
  then                                 \ if not found, show a message
;
[THEN]