\ 4tH LZ77 compressor - Copyright 2012 J.L. Bezemer
\ You can redistribute this file and/or modify it under
\ the terms of the GNU General Public License

include lib/argopen.4th                \ for ARG-OPEN
include lib/basename.4th               \ for -EXT
include lib/getopts.4th                \ for GET-OPTIONS
include lib/lz77.4th                   \ for COMPRESS

 255 string OutputName                 \ output filename
true value compress?                   \ to compress or to decompress ?
                                       ( --)
: set-decompress false to compress? ;  \ set to decompress
                                       \ command line options
create options
  char d , ' set-decompress ,
  NULL ,
                                       ( h1 h2 --)
: CloseFiles close close compress? if statistics then ;
: Process compress? if compress else decompress then ;
                                       \ open output file
: OpenOutput                           ( index -- h)
  OutputName >r args r@ place          \ copy filename
  compress? if s" .lz1" r@ +place r> count else r> count -ext then
  output open error? abort" Cannot open output file" dup use
;                                      \ strip or add extension and open file
                                       \ open input file
: OpenInput                            ( -- h index)
  options get-options option-index input over 1+ argn >
  abort" Usage: 4lz77 [-d] file"       \ check arguments, show usage if need
  over arg-open swap                   \ be and open file
;
                                       \ main routine
: 4lz77 OpenInput OpenOutput Process CloseFiles ;

4lz77