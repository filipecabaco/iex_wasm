\ GCC goto table generation - Copyright 2012 J.L. Bezemer
\ You can redistribute this file and/or modify it under
\ the terms of the GNU General Public License

include lib/parsname.4th               \ for PARSE-NAME
include lib/padding.4th                \ for .PADDING
include lib/compare.4th                \ for COMPARE
include lib/argopen.4th                \ for ARG-OPEN

 4 constant labels/line                \ number of labels per line
80 1- labels/line / constant c/label
32 string temp                         \ number of characters per label
                                       \ is this a token?
: token?                               ( a1 n1 -- a2 n2 n3 f1)
  s" #define" compare 0<> >r           \ does it start with #define?
  parse-name dup 0= >r                 \ is the label non-zero length?
  parse-name number error? r> r> or or \ is the value a number?
;
                                       \ get the next token
: nextToken                            (  -- a2 n2 n3 f1)
  begin                                \ end of file detected?
    refill 0= abort" Unexpected end of file"
    parse-name dup 0=                  \ does it have a non-zero length?
  while                                \ if it doesn't
    2drop                              \ then drop the token
  repeat token?                        \ found, but is it a token?
;
                                       \ get the first token
: firstToken                           ( -- a n)
  begin nextToken while drop 2drop repeat drop 2drop
  nextToken abort" Token expected"     \ fast forward to the first token
  abort" Token out of sequence"        \ must be token 0
;                                      \ print a token
                                       ( a1 n1 n2 --)
: .token labels/line mod if c/label .padding else type cr 4 spaces then ;
                                       \ generate pointers to labels
: token>label:                         ( a1 n1 -- n2)
  ."   static void *commands [] = {" cr
  over rewind abort" Cannot rewind file"
  firstToken 4 spaces s" &&L_" temp place temp +place 1
  begin                                \ form first label
    nextToken 0=                       \ get the next token
  while                                \ if it is a token, print previous
    >r 2>r >r s" ," temp +place temp count r@ .token
    r> 2r> s" &&L_" temp place temp +place
    r> over <> abort" Token out of sequence" 1+
  repeat                               \ prepare next label and check sequence
  drop 2drop                           \ clean up the mess
;
                                       \ generate #UNDEF statements
: token>#undef                         ( --)
  firstToken ." #undef " type cr       \ goto first token
  begin nextToken 0= while drop ." #undef " type cr repeat drop 2drop cr
;                                      \ now for the rest of the tokens
                                       \ generate UNKNOWN labels
: unknown>label:                       ( n --)
  256 swap ?do                         \ for all empty spaces
    s" ," temp +place temp count i .token s" &&L_UNKNOWN" temp place
  loop temp count type cr ."   };" cr  \ print error tokens
;
                                       ( -- h h)
: OpenFiles                            \ open input and output files
  argn 3 < abort" Usage: makegcch 4tH-header-file c-include-file"
  input  1 arg-open                    \ open the input file
  output 2 arg-open                    \ open the output file
;

: CloseFiles close close ;             ( h h --)
: Convert OpenFiles token>#undef token>label: unknown>label: CloseFiles ;

Convert