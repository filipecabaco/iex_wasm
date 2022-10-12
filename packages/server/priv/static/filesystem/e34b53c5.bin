\ Copyright 2004 - J.L. Bezemer
\ Converts multiline textfiles, delimited by a blank line,
\ to 4tH readable textfiles

variable written

: Usage abort" Usage: line2txt infile outfile" ;
: Read-file refill ;
: Preprocess 0 written ! ;

: reset Preprocess drop drop cr ;
: ?space dup if space then ;
: write /tib written @ ?space - min 0 max dup written +! type ;

: Process
  0 parse -trailing dup 0=
  if reset
  else write
  then
;

[needs lib/convert.4th]

