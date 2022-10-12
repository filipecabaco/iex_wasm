\ 4tH Poem HTML Generator - Copyright 2005 J.L. Bezemer
\ You can redistribute this file and/or modify it under
\ the terms of the GNU General Public License

include lib/argopen.4th

: ReadError ." Cannot read source file" cr abort ;

: Preprocess
  ." <!DOCTYPE HTML PUBLIC '-//W3C//DTD HTML 4.01 Transitional//EN'>" cr
  ." <html>" cr
  ." <head>" cr
  ." <title>"
  refill if                            \ read first line
    0 parse 2dup type                  \ this is the title
    ." </title>" cr
    ." </head>" cr                     \ write color and background
    ." <body style='color: " 1 args type
    ." ; background-image: url(" 2 args type
    ." );'>" cr                        \ write initial headers
    ." <h1>" type ." </h1>" cr
    ." <blockquote><b>" cr
    refill 0= if ReadError then        \ line after title should be empty
  else                                 \ give a read error when failing
    ReadError                          \ to read source file
  then
;
                                       \ read all lines and terminate them
: Process begin refill while 0 parse type ." <br>" cr repeat ;
                                       \ write lead out with button
: Postprocess
  ." </b></blockquote>" cr
  ." <center>" cr
  ." <form><input value='Back' onclick='history.go(-1)' type='button'></form>"
  cr
  ." </center>" cr
  ." </body>" cr
  ." </html>" cr
;

: Poem                                 ( --)
  argn 5 < abort" Usage: poem2html color background infile.txt outfile.html"
  input  3 arg-open                    \ open input file
  output 4 arg-open                    \ open output file
  Preprocess                           \ write HEAD
  Process                              \ write BODY
  Postprocess                          \ closing statements
  close close                          \ close all files
;

Poem
