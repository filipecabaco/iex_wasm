\ 4tH ASCII cleaning utility
\ Copyright 2003,2004 - Hansoft & Partners

[needs lib/istype.4th]

  9 constant tab
 10 constant lf

/char string buffer
                                       \ emit char if c1 = c2
: ?emit over = if dup emit then ;      ( c1 c2 -- c1)
                                       \ duplicate char if char is printable
: char? dup is-print                   ( c -- c -n | c c )
  if dup else -1 then ;

: Usage abort" Usage: bin2txt infile outfile" ;

: Read-file buffer /char accept ;      \ read a character

: Process
    buffer c@                          \ put it on the stack
    lf    ?emit                        \ emit if it is a LF
    tab   ?emit                        \ emit if it is a TAB
    char? ?emit                        \ emit if it is printable
    drop                               \ now drop it
;

[needs lib/convert.4th]
