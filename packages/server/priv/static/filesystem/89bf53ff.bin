\ 4tH library - UTF8 TYPE - Copyright 2012,2015 J.L. Bezemer
\ You can redistribute this file and/or modify it under
\ the terms of the GNU General Public License

\ This works just like an ordinary TYPE, but instead of simple
\ ASCII it outputs fully compliant UTF8. ISO 8859 is assumed.

[UNDEFINED] utf8type  [IF]
[UNDEFINED] putwch    [IF] include lib/utf8.4th     [THEN]
[UNDEFINED] is-xml    [IF] include lib/istype.4th   [THEN]
[UNDEFINED] ascii>xml [IF] include lib/asciixml.4th [THEN]
: UTF8type                             ( a n --)
  ['] putch defer@ >r [: emit ;] is putch
  bounds ?do i c@ dup is-xml if ASCII>XML type else putwch then loop
  r> is putch                          \ restore old behavior
;
[THEN]