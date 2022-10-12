\ 4tH library - REFILL> - Copyright 2016, 2020 J.L. Bezemer
\ You can redistribute this file and/or modify it under
\ the terms of the GNU General Public License

\ Typical use:
\   !refill
\   begin refill> while 0 parse type cr repeat
\   <refill abort" Cannot putback line"

\ The MARK! wordset will put filemarkers on the stack on demand. The REFILL!
\ wordset will do it with each invocation of REFILL>.

\ Note the filepos stack will fill up pretty quickly using REFILL>, so it is
\ wise to either clear the marks regularly or reset it at certain points in
\ your program. BTW, filepos stack overflow is ugly!

[UNDEFINED] !refill  [IF]
[UNDEFINED] #putback [IF] 64 constant #putback [THEN]
[UNDEFINED] adepth   [IF] include lib/stack.4th  [THEN]

#putback array (tellstack)             \ define filepos stack
                                       \ reset filepos buffer
: !mark (tellstack) stack ;            ( --)
: mark@ cin tell ;                     ( -- n)
: mark! (tellstack) >a ;               ( n --)
: mark- (tellstack) dup adepth if a> then drop ;
: >mark mark@ mark! ;                  ( --)
: mark> (tellstack) dup adepth if a> cin seek ;then drop true ;
: refill> >mark refill ;               ( --f)

aka !mark !refill                      ( --)
aka mark> <refill                      ( -- f)

[DEFINED] 4TH# [IF]
  hide #putback
  hide (tellstack)
[THEN]
[THEN]
