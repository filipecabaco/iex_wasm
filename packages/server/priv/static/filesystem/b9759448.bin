\ Copyright 2003 - J.L. Bezemer
\ Converts Forth blockfiles to sequential files

64 string buffer

: Usage abort" Usage: blk2txt blockfile textfile" ;
: Read-file buffer 64 accept ;
: Process buffer 64 -trailing type cr ;

[needs lib/convert.4th]