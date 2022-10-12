\ 4tH Preprocessor - Copyright 2009, 2020 J.L. Bezemer
\ You can redistribute this file and/or modify it under
\ the terms of the GNU General Public License

 79 constant RMARGIN                   \ for PRINT
256 constant (/key)                    \ for BROW

include lib/parsname.4th               \ for PARSE-NAME
include lib/print.4th                  \ for PRINT
include lib/row.4th                    \ for ROW
include lib/ncoding.4th                \ for NELL, N!, N@
include lib/stack.4th                  \ for >A, A>
include lib/stmstack.4th               \ for >S, S>
include lib/ctos.4th                   \ for C>S
include lib/getopts.4th                \ for OPTION-INDEX
include lib/brow.4th                   \ for BROW
\ include lib/anstools.4th               \ for .S

false constant Embedded?
                                       \ We're not embedding this version
 64 constant c/l                       \ chars per line of a standard block
 32 constant #case                     \ depth of CASE stack
256 constant #macro                    \ maximum number of macros
128 constant %macro                    \ average size of a macro
  4 constant #var                      \ maximum number of variables
128 constant /var                      \ maximum size of a variable
 32 constant #include                  \ maximum number of include files
 32 constant /name                     \ maximum length of name in ANS-Forth

    256 constant /dir4th               \ maximum size of DIR4TH path
/dir4th string dir4th                  \ allocate DIR4TH buffer
      0 value cursor                   \ cursor position
                                       \ calculate size of macro buffer
#macro %macro * constant /macro-buffer
/macro-buffer buffer: macro-buffer     \ allocate macro buffer
                                       \ allocate variable buffer
#var /var * buffer: ppvar does> swap /var * + ;

struct                                 \ structure for macro
  /name +field name                    \ name of the macro
  nell  +field buf-addr                \ start in macro buffer
end-struct /macro                      \ size of macro structure
                                       \ allocate macro array
#macro /macro * buffer: macro does> swap /macro * + ;

struct                                 \ structure for include files
   128 +field sourcename               \ name of the source file
  /tib +field terminalinput            \ save contents of TIB
  nell +field in                       \ save >IN
  nell +field position                 \ save current file position
  nell +field read                     \ save file reading method
end-struct /include                    \ size of include structure
                                       \ allocate include array
#include /include * buffer: includes does> swap /include * + ;

stack-cells 2 * array macro-stack      \ macro context stack

defer macro?                           \ forward declaration
defer readline                         \ primitive to read file
variable tob                           \ top of buffer
variable macro#                        \ number of defined macros
variable include#                      \ level of included files
false value state?                     \ are we defining a macro
false value verbose?                   \ are we in verbose mode
false value names?                     \ do we resolve names

s.clear                                \ initialize string stack
                                       \ define error codes
  0 enum P.NOERRS                      \ No errors
    enum P.BADNUM                      \ Bad number
    enum P.NOOPEN                      \ Cannot open include file
    enum P.NOREAD                      \ Cannot read include file
    enum P.BADDIR                      \ Directive not allowed here
    enum P.DUPMAC                      \ Duplicate macro
    enum P.MAXFIL                      \ Include file nested too deep
    enum P.INTERR                      \ Internal error
    enum P.MAXBUF                      \ Macro space exhausted
    enum P.NOSTR                       \ Missing string
    enum P.NOSEEK                      \ Seek failed
    enum P.SEMPTY                      \ String stack empty
    enum P.SFULL                       \ String stack full
    enum P.SCLEAR                      \ String stack not empty
    enum P.LENSTR                      \ String too long
    enum P.MAXMAC                      \ Too many macros
    enum P.NOMAC                       \ Undefined macro
    enum P.ENDFIL                      \ Unexpected end of file
    enum P.BADMAC                      \ Unexpected macro
    enum F.UNKOPR                      \ Unknown operator            (FTRAN)
    enum F.PREERR                      \ Precedence error            (FTRAN)
    enum F.NOEXEC                      \ Cannot execute operator     (FTRAN)
    enum F.NOTOPD                      \ Not an operand              (FTRAN)
    enum F.MISPAR                      \ Unmatched parenthesis       (FTRAN)
    enum F.BADEXP                      \ Invalid expression          (FTRAN)
    enum F.SCLEAR                      \ FTRAN stack not empty       (FTRAN)
constant P.USAGE                       \ Bad parameters
                                       \ select proper error handler
Embedded? [IF]
P.NOERRS out !                         \ preset "no errors"
: handler out ! ;                      \ for the embedded version
[ELSE]
create handler
  ," No errors"
  ," Bad number"
  ," Cannot open include file"
  ," Cannot read include file"
  ," Directive not allowed here"
  ," Duplicate macro"
  ," Include file nested too deep"
  ," Internal error"
  ," Macro space exhausted"
  ," Missing string"
  ," Seek failed"
  ," String stack empty"
  ," String stack full"
  ," String stack not empty"
  ," String too long"
  ," Too many macros"
  ," Undefined macro"
  ," Unexpected end of file"
  ," Unexpected macro"
  ," Unknown operator"
  ," Precedence error"
  ," Cannot execute operator"
  ," Not an operand"
  ," Unmatched parenthesis"
  ," Invalid expression"
  ," Formula stack not empty"
  ," Usage: pp4th [-v -n -D symbol] infile outfile"
does> swap cells + @c count stdout use type cr ;
[THEN]
                                       \ main error handler
: fatal? swap 0<> over * if handler abort then drop ;

include lib/opgftran.4th               \ patch in the FTRAN code

: read-seq refill ;                    ( -- f)
: read-blk c/l tib over accept = 0 dup >in ! tib c/l chars + c! ;
                                       \ the reading primitives
create mode                            \ how to read the file
  ," 4th" ' read-seq ,
  ," seq" ' read-seq ,
  ," .fs" ' read-seq ,
  ," frt" ' read-seq ,
  ," fth" ' read-seq ,
  ," scr" ' read-blk ,
  ," blk" ' read-blk ,
  NULL ,
does>
  >r 2dup dup 3 - /string r> 2 string-key row 
  if cell+ @c else drop ['] read-seq then >r 2drop r> dup is readline
;                                      \ add a word to macro space

: >macro                               ( a n --)
  tob @ over over over >r + macro-buffer /macro-buffer chars + < 0=
  P.MAXBUF fatal? place r> 1+ tob +!
;                                      \ check if it fits in macro space
                                       \ a few helper words
: n>s dup abs <# #s sign #> ;          ( n1 -- a n2)
: cursor@ >in @ to cursor ;            \ save cursor of TIB
: eol? >in @ cursor = dup if nl then ; \ end of line? if so, newline
: +macro -1 tob +! >macro ;            ( a n --)
: .char state? if c>s +macro else show then ;
: ?char dup bl < if drop else .char then ;
: (+write) state? if +macro else (print) then ;
: +write dup if bl .char (+write) else 2drop then ;
: write state? if >macro else print-word then ;
: (delimiter) >r write r@ parse +write r> ?char ;
: delimiter| parse 2drop ;             ( c --)
: EOL| 2drop 0 delimiter| ;            \ delete until end of line
: )| 2drop [char] ) delimiter| ;       \ delete until )
                                       \ parse and discard comments
create comment?
  ," \" ' EOL| ,
  ," (" ' )|   ,
  NULL ,
does> 2 string-key row dup >r if cell+ @c execute else drop then r> ;
                                       \ is a macro defined?
: defined?                             ( a n1 -- n2 a n1 f)
  2>r macro# @ 0                       \ find macro and print it, set flag
  begin over over > while dup macro -> name count 2r@ compare while 1+ repeat
  tuck > 2r> rot
;
                                       \ get next token
: read-token                           ( -- a n)
  begin                                \ read next token
    parse-name dup 0=                  \ if it has zero length
  while                                \ try to read the next line
    2drop readline 0= P.ENDFIL fatal?
  repeat                               \ try to parse again
;
                                       ( -- a n)
: next-token begin read-token comment? 0= until ;
: empty? s.error P.SEMPTY fatal? ;
: >context macro-stack >a macro-stack >a ;
: context> macro-stack a> macro-stack a> ;
: >p >s s.error P.SFULL fatal? ;
: p> s> empty? ;                       ( -- a n)
: p@ s@ empty? ;                       ( -- a n)
: n> p> number error? P.BADNUM fatal? ;
: >n n>s >p ;                          ( n --)
: macro> 1+ chars + count ;            ( a1 n1 -- a1+n1+1 n2)
: macro>? macro> 2dup dup 0= P.NOSTR fatal? ;
: ?abort if >r begin 2dup macro> dup while 2nip repeat 2drop r> then ;
: ppvar! >r dup /var 1- > P.LENSTR fatal? r> ppvar place ;
: var! next-token rot ppvar! ;         ( n --)
: var> p> rot ppvar! ;
: >var ppvar count >p ;
: .var ppvar count print-word ;        ( n --)
: parse-var! >r macro>? drop c@ parse r> ppvar! ;
                                       \ PP variable words
: @1@ 0 var! ;                         \ parse and save a variable
: @2@ 1 var! ;
: @3@ 2 var! ;
: @4@ 3 var! ;
: #1# 0 .var ;                         \ print a variable
: #2# 1 .var ;
: #3# 2 .var ;
: #4# 3 .var ;
: >1> 0 >var ;                         \ put a variable on the string stack
: >2> 1 >var ;
: >3> 2 >var ;
: >4> 3 >var ;
: <1< 0 var> ;                         \ get a variable on the string stack
: <2< 1 var> ;
: <3< 2 var> ;
: <4< 3 var> ;
: $1$ 0 parse-var! ;                   \ custom parse and save in variable
: $2$ 1 parse-var! ;
: $3$ 2 parse-var! ;
: $4$ 3 parse-var! ;
: $#$ macro>? drop c@ parse >p ;
: >#> next-token >p ;                  \ phoney variables
: <#< p> 2drop ;
: |#| p> (print) ;
: _#_ p> print-word ;
: >>> macro>? >p ;
: @cr nl ;
: @if n> dup 0= ?abort >n ;
: @dup p@ >p ;
: @nip p> p> 2drop >p ;
: @add n> n> + >n ;
: @mul n> n> * >n ;
: @divrm n> n> swap /mod >n >n ;
: @over p> p@ 2swap >p >p ;
: @else n> dup ?abort 0= >n ;
: @exist p> defined? >r 2drop drop r> >n ;
: @minus n> negate >n ;
: @eval >context p> macro? context> ;
: @cell p> number (error) <> >n ;
: @sign n> dup 0> swap 0< - >n ;
: @match p> p> compare >n ;
: @until @match @if ;
: @while @match @else ;
                                       \ how to treat a PP4tH variable
create ppvar?                          \ this table MUST be sorted in
  ," #1#" ' #1# ,                      \ lower case order!
  ," #2#" ' #2# ,
  ," #3#" ' #3# ,
  ," #4#" ' #4# ,
  ," $#$" ' $#$ ,
  ," $1$" ' $1$ ,
  ," $2$" ' $2$ ,
  ," $3$" ' $3$ ,
  ," $4$" ' $4$ ,
  ," <#<" ' <#< ,
  ," <1<" ' <1< ,
  ," <2<" ' <2< ,
  ," <3<" ' <3< ,
  ," <4<" ' <4< ,
  ," >#>" ' >#> ,
  ," >1>" ' >1> ,
  ," >2>" ' >2> ,
  ," >3>" ' >3> ,
  ," >4>" ' >4> ,
  ," >>>" ' >>> ,
  ," @1@" ' @1@ ,
  ," @2@" ' @2@ ,
  ," @3@" ' @3@ ,
  ," @4@" ' @4@ ,
  ," @add"    ' @add ,
  ," @cell"   ' @cell ,
  ," @cr"     ' @cr ,
  ," @divrm"  ' @divrm ,
  ," @drop"   ' <#< ,
  ," @dup"    ' @dup ,
  ," @else"   ' @else ,
  ," @eval"   ' @eval ,
  ," @exist"  ' @exist ,
  ," @if"     ' @if ,
  ," @ifnot"  ' @else ,
  ," @match"  ' @match ,
  ," @minus"  ' @minus ,
  ," @mul"    ' @mul ,
  ," @nip"    ' @nip ,
  ," @over"   ' @over ,
  ," @sign"   ' @sign ,
  ," @until"  ' @until ,
  ," @while"  ' @while ,
  ," _#_" ' _#_ ,
  ," |#|" ' |#| ,
  here ppvar? - 2 / constant /ppvar?
                                       \ prints out an entire macro
:noname                                ( a n --)
  defined?                             \ is the macro defined?
  if
    2drop macro -> buf-addr n@ count   \ if so, get its address
    begin
      dup                              \ print it out until null string
    while                              \ save context to preserve stack space
      2dup ppvar? /ppvar? 2 bstring-key brow
      if                               \ binary search on ppvar
        2* 1+ cells + @c execute       \ if found execute it
      else                             \ find out if it is a macro itself
        drop drop 2dup >context recurse context>
      then macro>                      \ get the next part of the macro
    repeat drop
  else
    print-word                         \ if not a macro, print word
  then drop
; is macro?                            \ horribly long word, but efficient
                                       \ save filename in NEW record
: filename!                            ( c -- a n)
  dup bl = if drop next-token else parse then 2dup
  include# @ dup #include < 0= P.MAXFIL fatal?
  includes >r mode r@ -> read n! r> -> sourcename place 1 include# +!
;                                      \ abort if includes nested too deep
                                       \ save position info in prev. record
: position!                            ( h -- h)
  include# @ 1- 1- includes >r         \ get pointer to PREVIOUS record
  dup tell r@ -> position n! tib r@ -> terminalinput /tib cmove
  >in @ r> -> in n! (error) to cursor  \ save contents of TIB and >IN
;                                      \ and increment include pointer
                                       \ handle verbose mode
: ?verbose                             ( a n -- a n)
  verbose?                             \ is verbose mode on?
  if cout >r stdout use include# @ 1- 2* spaces 2dup type cr r> use then
;                                      \ if so, show include file
                                       \ open an INCLUDE file 
: open-include                         ( a n -- h)
  ?verbose 2dup input open error?      \ try to open it normally
  if                                   \ did that work?
    s" DIR4TH" environ@ dir4th place   \ initialize DIR4TH buffer
    drop dir4th +place                 \ if not, add DIR4TH path
    dir4th count input open error?     \ and try again
    P.NOOPEN fatal?                    \ abort on error
  else                                 \ if it did work
    >r 2drop r>                        \ get rid of the filename copy
  then dup use                         \ use the open file immediately
;
                                       \ process an INCLUDE or [NEEDS
: >include                             ( hi ho c -- hi ho)
  state? P.BADDIR fatal?               \ no include allowed here
  filename! 2>r swap position! close 2r> open-include swap 
  readline 0= P.NOREAD fatal?
;                                      \ close previous file and open include
                                       \ behavior of several delimiters
: (EOL) 0 (delimiter) ;                ( a n --)
: (") [char] " (delimiter) ;           ( a n --)
: (|) [char] | (delimiter) ;           ( a n --)
: ()) [char] ) (delimiter) ;           ( a n --)
                                       \ behavior of ;
: (;) state? if dup xor >macro false to state? else print-word then ;
: (`) state? if 2drop [char] ` parse >macro else print-word then ;
: (WHITE) write next-token +write ;    \ resolve whitespace behavior
: (INCLUDE) 2drop bl >include ;        \ resolve INCLUDE behavior
: (NEEDS) 2drop [char] ] >include ;    \ resolve [NEEDS behavior
: (CHAR) 2drop read-token drop c@ n>s write ;
: (LET) 2drop state? P.BADDIR fatal? [char] ; parse ftran print ;
: ([BINARY]) write 2 base ! ;          \ set radix to binary
: ([OCTAL]) write octal ;              \ set radix to octal
: ([DECIMAL]) write decimal ;          \ set radix to decimal
: ([HEX]) write hex ;                  \ set radix to hexadecimal
: ([FLOAT])  2drop  float-math ;       \ set FTRAN support to floating point
: ([DOUBLE]) 2drop double-math ;       \ set FTRAN support to double numbers
: ([SINGLE]) 2drop single-math ;       \ set FTRAN support to single numbers
                                       \ undefine a macro
: (SCRAP:)                             \ check if macro was defined
  2drop state? P.BADDIR fatal?         \ no SCRAP: allowed here
  next-token defined? 0= P.NOMAC fatal?
  2drop macro# @ 1- over over <        \ move top macro if required
  if macro swap macro /macro cmove else drop drop then -1 macro# +!
;                                      \ decrement number of macros
                                       \ resolve behavior :MACRO keyword
: (:MACRO)                             \ forget the keyword and check
  2drop state? P.BADMAC fatal?         \ no :MACRO allowed here
  macro# @ #macro = P.MAXMAC fatal?    \ too many macros
  next-token defined? P.DUPMAC fatal?  \ macro already defined
  rot dup >r macro -> name place       \ save the macro name
  tob @ r> macro -> buf-addr n!        \ save the current macro buffer address
  1 macro# +! true to state?           \ increment number of macros and set 
;                                      \ defining state accordingly
                                       \ keywords with associated behaviors
create keyword                         \ this table MUST be sorted
  ," #!"              ' (EOL) ,        \ in lower case order!
  ," ("               ' )| ,
  ,| ,"|              ' (") ,
  ," ,|"              ' (|) ,
  ,| ."|              ' (") ,
  ," .("              ' ()) ,
  ," .|"              ' (|) ,
  ," :MACRO"          ' (:MACRO) ,
  ," ;"               ' (;) ,
  ," @GOTO"           ' (EOL) ,
  ," [BINARY]"        ' ([BINARY]) ,
  ," [CHAR]"          ' (CHAR) ,
  ," [DECIMAL]"       ' ([DECIMAL]) ,
  ," [DEFINED]"       ' (WHITE) ,
  ," [DOUBLE]"        ' ([DOUBLE]) ,
  ," [FLOAT]"         ' ([FLOAT]) ,
  ," [HEX]"           ' ([HEX]) ,
  ," [NEEDS"          ' (NEEDS) ,
  ," [OCTAL]"         ' ([OCTAL]) ,
  ," [SINGLE]"        ' ([SINGLE]) ,
  ," [UNDEFINED]"     ' (WHITE) ,
  ," \"               ' EOL| ,
  ," `"               ' (`) ,
  ,| ABORT"|          ' (") ,
  ,| C"|              ' (") ,
  ," CHAR"            ' (CHAR) ,
  ," C|"              ' (|) ,
  ," INCLUDE"         ' (INCLUDE) ,
  ," LET"             ' (LET) ,
  ,| S"|              ' (") ,
  ," SCRAP:"          ' (SCRAP:) ,
  ," S|"              ' (|) ,
  ,| THROW"|          ' (") ,
  here keyword - 2 / constant /keyword

:redo keyword                          \ standard behavior of keyword
  /keyword 2 bstring-key brow
  if 2* 1+ cells + @c execute          \ if found, execute the keyword
  else drop drop state? if >macro else macro? then
  then                                 \ if not, is it a macro?
;
                                       \ prerequisites of CONVERT.4TH
: Read-file                            ( h1 -- h2 f)
  readline dup 0=                      \ get a line
  if                                   \ if we didn't get it..
    drop include# -1 over +! @ dup     \ decrement the include stack
    if                                 \ if we're not at the original source
      1- includes >r swap close        \ get the previous include file
      r@ -> sourcename count open-include
      r@ -> position n@ over seek P.NOSEEK fatal?
      r@ -> terminalinput tib /tib cmove
      r@ -> in n@ >in !                \ open it and restore everything
      r> -> read n@ is readline        \ initialize required reading method
      swap true                        \ signal we're ready for business
    then                               \ let CONVERT.4TH handle the rest
  then
;
                                       \ split a symbol defined by -D
: split-symbol                         ( a1 n1 -- a1 n2 a2 n3)
  char = split 2swap dup               \ split at the '=' sign
  if chop 2dup number (error) <> if exit then then 2drop s" 1"
;                                      \ if it's not a number, return "1"
                                       \ print all symbols entered
: .symbols                             ( --)
  begin                                \ pop a symbol from the string-stack
    s> dup                             \ empty string quits printing
  while                                \ if still a symbol on stack
    split-symbol print-word s" CONSTANT" print-word print-word nl
  repeat 2drop s.clear                 \ split up sysmbol and print CONSTANT
;                                      \ reset the string stack
                                       \ insert a NAMES directive
: .names names? if s" [NAMES]" print-word nl then ;
                                       \ get symbol, throw it on the stack
: get-define get-argument >p ;         ( --)
: get-verbose true to verbose? ;       ( --)
: get-names true to names? ;           ( --)
                                       \ map options to words
create options
  char D , ' get-define ,
  char v , ' get-verbose ,
  char n , ' get-names ,
  NULL ,
                                       \ interface words to CONVERT.4TH
: PreProcess                           \ initialize all variables
  macro-buffer tob ! 0 macro# ! 1 include# ! option-index args
  ?verbose mode 0 includes dup >r -> read n! r> -> sourcename place
  .names .symbols macro-stack stack    \ initialize stack and
;                                      \ the include file entry
                                       \ of the original source file
: Usage P.USAGE fatal? ;               \ show usage on incomplete invocation
: PostProcess s.used P.SCLEAR fatal? ; \ check the string stack for items

: Process
  begin
    cursor@ parse-name dup
    if 2dup ['] keyword catch P.INTERR fatal? else 2drop then eol?
  until
;

include lib/convert.4th
