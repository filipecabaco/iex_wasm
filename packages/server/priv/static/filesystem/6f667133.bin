\ Copyright 2007,2012 - J.L. Bezemer
\ Converts GCC generated .s files to Graphviz DOT sourcefiles
\ http://www.graphviz.org

\ -- INPUT FORMAT --
\ o Plain text files
\ -- INPUT FORMAT --

\ -- TYPICAL USE --
\ $ gcc -S hello.c
\ $ 4th cxq asm2dot.4th hello.s hello.dot
\ -- TYPICAL USE --

true  constant casesensitive           \ C is case sensitive
false constant MINGW                   \ use Linux syntax by default

include lib/row.4th
include lib/anscore.4th

        9 constant tab                 \ TAB character
      256 constant #node               \ max. number of nodes
       33 constant /node               \ size per nodes
      512 constant #edge               \ max. number of edges
/node 3 * constant /edge               \ size per edge

        /node string this-node         \ current node buffer
        /edge string this-edge         \ current edge buffer
#node /node * string nodes             \ array for nodes
#edge /edge * string edges             \ array for edges

variable top-node                      \ top of node buffer
variable top-edge                      \ top of edge buffer

s| "| sconstant quote                  \ a double quote
                                       \ general definitions
: >edge /edge * edges + ;              ( n -- a)
: colon? this-node count dup 0> ;      ( -- a n f)
                                       \ is edge unique?
: unique?                              ( -- f)
  true top-edge @ 0 ?do                \ loop till top of edge array
    drop this-edge count i >edge count compare
    dup 0= if leave then               \ if not unique return false
  loop
;
                                       \ edge definitions
: +edge! this-edge count 2dup top-edge @ >edge place 1 top-edge +! type cr ;
: edge! 0 this-edge c! ;               ( --)
: +edge this-edge +place ;             ( a n --)
: "> quote +edge ;                     ( --)
: ;> s" ;" +edge ;                     ( --)
: node> "> MINGW [IF] chop [THEN] +edge "> ;
: +edge? edge! node> s"  -> " +edge node> ;> unique? if +edge! then ;
                                       \ node definitions
: >node /node * nodes + ;              ( n -- a)
: node@ >node count ;                  ( n1 -- a n2)
: +node! 2dup top-node @ >node place 1 top-node +! ;

MINGW [IF]
: colon! [char] ; parse-word +node! this-node place ;
: label? over c@ [char] _ = ;          ( a n -- a n f)
[ELSE]
: colon! [char] , parse-word +node! this-node place ;
true constant label?                   ( -- f)
[THEN]

: defined?
  top-node @
  0 ?do 2dup i node@ compare 0= if 2over 2over 2swap +edge? leave then loop
;
                                       \ is this a node?
: node? 2swap label? if defined? then ; 
: edge-detect tab parse-word colon? if node? then 2drop 2drop ;
                                       ( --)
create parsing                         \ keywords and actions
                 ," call"  ' edge-detect ,
MINGW [IF]       ," .def"  ' colon! ,
      [ELSE]     ," .type" ' colon! ,
      [THEN]     NULL ,

does> 2 string-key row if nip nip cell+ @c execute else drop 2drop then ;

: PreProcess
  0 dup dup top-node ! top-edge ! this-node c!
  ." digraph asm {" cr
  ." node [color=lightblue2, style=filled];" cr
  ." ratio=1.0;" cr
;
                                       \ required by 'convert.4th'
: Read-file refill ;
: PostProcess [char] } emit cr ;
: Usage abort" Usage: asm2dot asm-source dot-source" ;
: Process tab parse-word parsing ;

include lib/convert.4th
