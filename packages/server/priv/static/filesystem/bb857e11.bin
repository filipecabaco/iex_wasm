\ 4tH KJots export file converter - Copyright 2014 J.L. Bezemer
\ You can redistribute this file and/or modify it under
\ the terms of the GNU General Public License

include lib/argopen.4th                \ for ARG-OPEN
include lib/identify.4th               \ for >IDENTIFIER

2048 constant /line-buffer             \ size of line buffer
/line-buffer buffer: line-buffer       \ allocate the line buffer
255 buffer: filename                   \ alocate the filename buffer

: header?                              ( a n -- a n f)
  2dup begin dup while over c@ [char] # = while chop repeat nip 0=
;
                                       \ parse a line
: parse-line 0 parse -leading -trailing ;
: refill? refill 0= abort" Unexpected end of file" ;
                                       \ refill the line buffer
: process-header                       ( h1 h2 t a n -- h1 h3 t)
  2drop dup >r if close else drop then r> refill?
  parse-line 2 /string >identifier filename >r
  r@ place s" ." r@ +place dup <# # # # #> r@ +place
  r> count output open error? abort" Cannot open output file"
  tuck use 1+ refill?                  \ compose filename
;                                      \ open file, incremente topic
                                       \ main program
: jots2txt                             ( --)
  argn 2 < abort" Usage: jots2txt infile"
  input 1 arg-open 0 dup               \ open KJots export file
  line-buffer /line-buffer source!     \ assign large line buffer

  begin                                \ begin the main loop
    refill                             \ read a line
  while                                \ if successful, parse a line
    parse-line dup                     \ check if it is a header
    if header? if process-header else type cr then else 2drop cr then
  repeat drop close close              \ close both input and output file
;

jots2txt