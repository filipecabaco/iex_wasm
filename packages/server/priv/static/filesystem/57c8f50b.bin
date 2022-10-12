\ Copyright 2009 - J.L. Bezemer
\ Converts MS-DOS textfiles to Unix textfiles

: Usage abort" Usage: duc infile outfile" ;
: Read-file pad 1 accept ;
: Process pad c@ dup 13 - if emit else drop then ;

[needs lib/convert.4th]
