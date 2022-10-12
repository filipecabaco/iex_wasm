\ 4tH Simple adventure player - Copyright 2015 J.L. Bezemer
\ You can redistribute this file and/or modify it under
\ the terms of the GNU General Public License

\ Inspired by the free format as described in:
\   http://choosatron.com/writing-guide/

\ Format:
\ =======
\ description
\ <space>description
\ - choice (goto label)
\ - choice (goto label)
\ [label] description
\ description
\ - choice (goto label)
\ - choice (goto label)
\ [label] description
\ description
\ <space>** text ** end


79 constant rmargin                    \ regular 80 column screen
include lib/print.4th                  \ for PRINT
include lib/enter.4th                  \ for ENTER
include lib/userpad.4th                \ for >PAD
include lib/leading.4th                \ for -LEADING
\ include lib/anstools.4th               \ for .S

4096 constant /mytib                   \ size of input buffer
/mytib buffer: mytib                   \ allocate input buffer

4 constant #choice                     \ max. no. of choices

struct                                 \ choice structure
  field: text                          \ the text to display
  field: goto                          \ the situation number
end-struct /choice
                                       \ allocate situation array
#choice /choice * array choices does> swap /choice * + ;
                                       ( h --)
: eof close ." Unexpected end of file" cr abort ;
: get-line 0 parse -leading -trailing ;
: print-line nl get-line print nl ;    ( --)
: describe? mytib c@ dup bl = over [char] [ = or swap [char] - = or 0= ;

: describe                             ( --)
  0 >r begin                           \ set up double cr flag
    refill                             \ read next line
  while                                \ if there is one
    describe?                          \ nothing special yet?
  while                                \ continue printing text
    get-line dup if print nl else 2drop r@ if nl then r> 1 xor >r then
  repeat r> drop                       \ we're ready to start
;
                                       \ start the story
: start                                ( --)
  mytib /mytib source!                 \ allocate large buffer
  begin describe mytib c@ [char] - <> while get-line print nl repeat nl
;
                                       \ read and ecode single choice
: getchoice                            ( n2 a1 n1 -- n2+1)
  chop -leading -trailing >pad drop over choices -> text !
  bl parse-word 2drop [char] ) parse -trailing number error?
  abort" GOTO not followed by a number"
  over choices -> goto ! 1+            \ cater for next choice
;
                                       \ read all choices
: getchoices                           ( -- n)
  0 dup >r                             \ set up double cr flag and #choices
  begin
    [char] ( parse -trailing dup       \ get string, is it empty?
    if r> dup xor >r getchoice         \ if not, get the choice
    else 2drop r> dup if drop exit else 1 xor >r then
    then refill 0=                     \ cater for double cr's
  until r> drop drop eof               \ continue, unless end of file
;
                                       \ print all choices
: printchoices                         ( n -- n)
  dup 0 ?do i 1+ 0 .r ." ) " i choices -> text @ count type cr loop
;
                                       \ let user enter the choice
: enterchoice                          ( n1 -- n2)
  ." Your choice: " cin >r stdin use tib /tib source!
  begin enter over over < over 1 < or while drop repeat
  mytib /mytib source! r> use nip 1- choices -> goto @
;                                      \ use system TIB for entry
                                       \ jump to next situation
: jump                                 ( h n -- h)
  begin                                \ get the next line
    refill                             \ if there is any
  while                                \ parse for a label
    [char] ] parse dup                 \ if anything is parsed
    if                                 \ check for a valid label
      over c@ [char] [ <> >r chop number error? r> or
      if drop else over = if drop exit then then
    else                               \ ok, got it, is it the right label?
      2drop                            \ if not, discard and try again
    then 
  repeat over rewind abort" Can't rewind file" recurse
;                                      \ try a backward jump
                                       ( n -- n)
: description print-line nl describe ;
                                       \ decide what to do next
: decide                               ( h -- h)
  mytib c@ dup bl = if drop close get-line print nl abort then
  [char] - <> if eof then              \ if a space, it's end of story
;                                      \ if it's not a choice, it's no good
                                       ( --)
: choose getchoices printchoices enterchoice jump description decide ;
                                       \ play the adventure
: adventure                            ( --)
  argn 2 < abort" Usage: simpladv filename"
  1 args input open error? abort" Can't open file"
  dup use start begin choose again
;                                      \ check arguments, open file and run

adventure
