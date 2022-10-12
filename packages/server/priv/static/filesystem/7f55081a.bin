\ 4tH binary to .h file converter - Copyright 2007, 2020 J.L. Bezemer
\ You can redistribute this file and/or modify it under
\ the terms of the GNU General Public License

\ This file is geared toward the conversion of 4tH HX bytecode.
\ In order to convert other binary files, just use -t and -n options.

include lib/ulcase.4th                 \ case conversion
include lib/getopts.4th                \ for OPTION-INDEX

9 constant /line                       \ number of bytes per line
/line string line                      \ input buffer

32 string <type>                       \ holds the type
64 string <name>                       \ holds the name

defer {cr}                             \ terminate previous line

s" static unit" sconstant MyType       \ default type
s" EmbeddedHX"  sconstant MyName       \ default name

MyType <type> place                    \ initialize type
MyName <name> place                    \ initialize name

: .char ." '\x" <# [char] ' hold # # #> s>lower type ;
: PostProcess 2drop cr ." };" cr decimal ; ( a n --)
: 2nd+ [char] , emit cr ; : 1st ['] 2nd+ is {cr} ;
: Read-file line dup /line accept dup ; ( -- a n f)
: Usage abort" Usage: bin2h -t<type> -n<name> infile outfile" ;
                                       \ required by CONVERT.4TH
: Process                              ( a n --)
  {cr} space space bounds ?do          \ terminate previous line
    i c@ .char i 1+ i' < if ." , " then
  loop                                 \ terminate all chars, except the last
;
                                       \ required by CONVERT.4TH
: PreProcess                           ( --)
  ['] 1st is {cr} hex                  \ this is the first line
  <type> count type space <name> count type ."  [] = {" cr
;                                      \ write the declaration
                                       \ evaluate the options
: get-type get-argument <type> place ; ( --)
: get-name get-argument <name> place ; ( --)

create options                         \ required by CONVERT.4TH
  char t , ' get-type ,
  char n , ' get-name ,
  NULL ,

include lib/convert.4th
