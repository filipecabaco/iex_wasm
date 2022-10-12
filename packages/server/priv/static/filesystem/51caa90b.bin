\ 4tH - Text to HTML - Copyright 1997,2012 J.L. Bezemer
\ You can redistribute this file and/or modify it under
\ the terms of the GNU General Public License

include lib/istype.4th
include lib/asciixml.4th

: Usage abort" Usage: ASC2HTML [ascii file] [HTML file]" ;

: PreProcess
  ." <HTML>" cr                        \ write heading
  ." <BODY>" cr
  ." <PRE>" cr
;

: Read-file refill ;

: Process
  0 parse bounds ?do i c@ dup is-xml if ascii>xml type else emit then loop cr
;

: PostProcess 
  ." </PRE>" cr
  ." </BODY>" cr
  ." </HTML>" cr                       \ write footer
;

[needs lib/convert.4th]
