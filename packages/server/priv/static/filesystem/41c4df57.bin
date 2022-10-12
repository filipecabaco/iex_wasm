\ 4tH library - Integrated message handler - Copyright 2013 J.L. Bezemer
\ You can redistribute this file and/or modify it under
\ the terms of the GNU General Public License

\ Derived from SourceForge (http://forth.sourceforge.net/):
\ R.9 Exception reserved extension words

[UNDEFINED] exception    [IF]
[UNDEFINED] throw-string [IF] include lib/throwstr.4th [THEN]
[UNDEFINED] >str-buffer  [IF] include lib/strbuf.4th   [THEN]

[UNDEFINED] #_sysmsg [IF]
128 constant #_sysmsg                  \ maximum number of user defined errors
[THEN]

[UNDEFINED] /_sysmsg [IF]
 64 constant /_sysmsg                  \ average size of an error message
[THEN]

#_sysmsg /_sysmsg * buffer: _sysmsgbuf \ allocate a message buffer
#_sysmsg array _sysmsgs                \ allocate an array of string pointers
0 value _sysmsg#                       \ initialize the message number counter
                                       \ initialize the message buffer
_sysmsgbuf #_sysmsg /_sysmsg * str-buffer
                                       \ create a new exception
: exception                            ( a1 n1 -- n2)
  _sysmsgbuf >str-buffer _sysmsg# 1+ dup to _sysmsg# tuck 1- cells _sysmsgs + !
;
                                       \ find the message for an error#
: >message                             ( n1 -- a2 n2)
  _sysmsg# @ min dup 0> if 1- cells _sysmsgs + @ count else throw-string then
;
                                       \ issue a message to the default device
: .message >message type cr ;          ( n1 --)
: message exception drop ;             ( a n --)

[DEFINED] 4TH# [IF]
  hide #_sysmsg
  hide /_sysmsg
  hide _sysmsgbuf
  hide _sysmsgs
[THEN]
[THEN]

\ s" 1st exception" exception value ONE
\ s" 2nd exception" exception value TWO
\ ONE .message TWO .message -10 .message depth .
