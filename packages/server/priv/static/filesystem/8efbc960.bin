\ 4tH library - HH:MM:SS to seconds conversion - Copyright 2013, 2015 J.L. Bezemer
\ You can redistribute this file and/or modify it under
\ the terms of the GNU General Public License

[UNDEFINED] h:m:s>secs [IF]
[UNDEFINED] is-digit   [IF] include lib/istype.4th   [THEN]
[UNDEFINED] split<     [IF] include lib/tokenize.4th [THEN]
[UNDEFINED] -leading   [IF] include lib/leading.4th  [THEN]
[UNDEFINED] compare    [IF] include lib/compare.4th  [THEN]

3600 12 * constant (12hours)           \ a constant holding 12 hours seconds

: h:m:s>secs                           ( a1 n1 -- n2)
  ['] is-type defer@ >r [: is-digit 0= ;] is is-type
  0 >r 3600 >r -leading -trailing      \ clean up string

  begin                                \ split off all the components
    dup                                \ if a null string, skip loop
  while                                \ if not, convert it to a number
    split> number error? dup >r        \ if a number, scale it, add to result
    if drop else r> swap r> tuck * r> + >r 60 / >r >r dup if chop then then r>
  until r> drop                        \ drop scaling factor

  dup if                               \ if remainder, unchop, clean string up
    1+ swap char- swap -leading 2dup s" PM" compare
    if                                 \ is it in the afternoon?
      s" AM" compare if r> else r> dup (12hours) >= if (12hours) - then then
    else                               \ is it in the morning?
      2drop r> dup (12hours) < if (12hours) + then
    then                               \ then adjust accordingly
  else                                 \ if null string, discard it
    2drop r>                           \ and just retrieve result
  then r> is is-type
;

[DEFINED] 4TH# [IF] hide (12hours) [THEN]
[THEN]
