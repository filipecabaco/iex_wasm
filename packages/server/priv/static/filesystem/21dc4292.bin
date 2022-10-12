\ Strips XML from file - Copyright 2019 J.L. Bezemer
\ You can redistribute this file and/or modify it under
\ the terms of the GNU General Public License

include lib/istype.4th                 \ for IS-WHITE
include lib/chars.4th                  \ import character constants

defer strip                            \ current parsing routine
defer white>>                          \ defer whitespace skip

2048 constant /mytib                   \ size of user defined TIB
/mytib buffer: mytib                   \ allocate user defined TIB
                                       \ get chararter from string
: char@ over c@ ;                      ( a n -- a n c)
                                       \ skip tags
: <tag>                                ( a n --)
  begin dup while char@ '>' <> while chop repeat chop
  dup if ['] white>> defer@ is strip white>> ;then 2drop
;                                      \ skip tag, then clean up spaces
                                       \ print the payload
: payload                              ( a n --)
  begin dup while char@ '<' <> while char@ emit chop repeat
  dup if cr ['] <tag> is strip <tag> ;then space 2drop
;                                      \ print payload until the next tag
                                       \ skip any whitespace
:noname                                ( a n --)
  begin dup while char@ is-white while chop repeat
                                       \ skip all whitespace
  dup if                               \ if any string left, parse it
    char@ '<' = if ['] <tag> is strip <tag> ;then ['] payload is strip payload
  ;then 2drop                          \ all parsed, drop string                          
; is white>>                           \ assign to skip whitespace

aka refill read-file                   \ standard REFILL
                                       \ assign buffer, start skip whitespace
: Preprocess mytib /mytib source! ['] white>> defer@ is strip ;
: Process 0 parse strip ;              \ parse string and strip
: usage abort" xmlstrip xml-file text-file" ;

include lib/convert.4th





