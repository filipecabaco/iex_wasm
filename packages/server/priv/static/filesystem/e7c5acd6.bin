\ 4tH binary to .4th file converter - Copyright 2007 J.L. Bezemer
\ You can redistribute this file and/or modify it under
\ the terms of the GNU General Public License

include lib/argopen.4th                \ use ARG-OPEN word
include lib/ulcase.4th                 \ case conversion

10 constant /line                      \ number of bytes per line
/line string line                      \ input buffer

: .char space <# # # #> s>lower type ."  c," ;
: .header ." [hex]" cr ." offset " 1 args type cr ;
: .footer ." [decimal]" cr ;           ( --)
: read 2dup accept tuck <> -rot ;      ( a n1 -- f a n2)
: .line space bounds ?do i c@ .char loop cr ;
: .lines hex begin line /line read .line until ;
: Usage argn 4 < abort" Usage: bin24th offset file 4th-file" ;
: OpenFiles Usage input 2 arg-open output 3 arg-open ;
: Convert Openfiles .header .lines .footer close close ;

Convert
