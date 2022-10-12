\ uBasic to .DOT converter - Copyright 2010,2020 J.L. Bezemer
\ You can redistribute this file and/or modify it under
\ the terms of the GNU General Public License

include lib/parsname.4th               \ for PARSE-NAME
include lib/row.4th                    \ for ROW

false value GOTO

create exit?
  ," GOTO"
  ," RETURN"
  NULL ,
does> 1 string-key row >r drop 2drop r> ;

: number>? parse-name number error? 0= ;
: .line swap GOTO if drop else . ." -> " dup . ." [color=blue];" cr then ;
: .goto over . ." -> " 0 .r ." ;" cr ; \ print a Graphviz line
: .gosub over . ." -> " . ." [arrowtail=normal, color=red];" cr ;
: (goto) 2drop number>? if .goto else drop then ;
: (gosub) 2drop number>? if .gosub else drop then ;
: (rem) 2drop begin parse-name while drop repeat drop ;

create jump?                           \ GOTO and GOSUB contain labels
  ," GOTO"  ' (goto) ,
  ," THEN"  ' (goto) ,
  ," GOSUB" ' (gosub) ,
  ," REM"   ' (rem) ,
  NULL ,
does> 2 string-key row if cell+ @c execute else drop 2drop then ;

: ?linenumber
  parse-name 2dup 2>r number error? 0=
  if 2r> 2drop .line parse-name else drop 2r> then exit? to GOTO 0 >in !
;                                      \ see if it's got a linenumber
                                       \ CONVERT.4TH prerequisites
: Usage abort" Usage: ub2dot infile outfile" ;
: Read-file refill ;
: Process ?linenumber begin parse-name dup while jump? repeat 2drop ;
: PostProcess drop ." }" cr ;          ( n --)
                                       \ make a new edge if node found
: PreProcess                           ( -- n)
  0 ." digraph ubasic {" cr            \ print header
  ." node [color=lightblue2, style=filled];" cr
  ." ratio=1.0;" cr
;

include lib/convert.4th
