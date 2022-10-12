\ 4tH library - eSpeak interface - Copyright 2011,2012 J.L. Bezemer
\ You can redistribute this file and/or modify it under
\ the terms of the GNU General Public License

\ Note that this library file requires you have installed
\ espeak, which can be obtained here:
\ http://espeak.sourceforge.net/

[UNDEFINED] speak [IF]
32 string (speak-cmd)                  \ build eSpeak commandline
                                       \ a2 n2 holds eSpeak language code
: speak                                ( a1 n1 a2 n2 -- f)
  cout >r (speak-cmd) >r s" espeak -v" r@ place r@ +place
  r> count output pipe + open error? dup >r
  if drop 2drop else dup use -rot type close then r> r> use
;

[DEFINED] 4TH# [IF]
  hide (speak-cmd)
[THEN]
[THEN]