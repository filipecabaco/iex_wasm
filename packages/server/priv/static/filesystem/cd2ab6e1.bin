\ 4tH library - SAY - Copyright 2007,2012 J.L. Bezemer
\ You can redistribute this file and/or modify it under
\ the terms of the GNU General Public License

\ Note that this library file requires you have installed
\ FESTIVAL, which can be obtained here:
\ http://www.cstr.ed.ac.uk/projects/festival

[UNDEFINED] say [IF]
: say                                  ( a n -- f)
  cout >r s" festival --tts" output pipe + open error? dup >r
  if drop 2drop else dup use -rot type close then r> r> use
;
[THEN]
  
