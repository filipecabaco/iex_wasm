\ 4tH library - ENVIRONMENT? - Copyright 2007,2011 J.L. Bezemer
\ You can redistribute this file and/or modify it under
\ the terms of the GNU General Public License

\ This program conforms to ANS-Forth A.1.3.1, stating that 
\ "if the implementor claims to have a particular optional wordset
\ the entire required portion of that wordset must be available".
\ It also conforms to Forth200x CfV "Extension queries"

\ Load ROW when needed
[UNDEFINED] row [IF]
[needs lib/row.4th]
[THEN]

[UNDEFINED] environment? [IF]
1 string character                     \ for query-max-char

: unavailable false ;                  \ full wordset is not available 
: available true ;                     \ full wordset is available
: X-available ;                        \ full CfV is implemented  
: query-hold /hold ;                   \ size of number buffer
: query-pad /pad ;                     \ size of pad
: query-max-char character max-n over c! c@ ;
: query-max-n max-n ;                  \ maximum signed cell
: query-max-u 0 invert ;               \ maximum unsigned cell
: query-max-ud 0 invert dup ;          \ maximum unsigned double cell
: query-stack stack-cells ;            \ size of stack
: floored -10 7 / -2 = ;               \ floored division?
                                       \ memory wordset has been loaded?
[DEFINED] allocate
[IF]   aka available   memory-alloc?
[ELSE] aka unavailable memory-alloc?
[THEN]

create environment?
  ," FLOORED"            ' floored ,
  ," /HOLD"              ' query-hold ,
  ," /PAD"               ' query-pad ,
  ," MAX-CHAR"           ' query-max-char ,
  ," MAX-N"              ' query-max-n ,
  ," MAX-U"              ' query-max-u ,
  ," MAX-UD"             ' query-max-ud ,
  ," RETURN-STACK-CELLS" ' query-stack ,
  ," STACK-CELLS"        ' query-stack ,
  ," CORE"               ' unavailable ,
  ," CORE-EXT"           ' unavailable ,
  ," BLOCK"              ' unavailable ,
  ," BLOCK-EXT"          ' unavailable ,
  ," DOUBLE"             ' unavailable ,
  ," DOUBLE-EXT"         ' unavailable ,
  ," EXCEPTION"          ' available ,
  ," EXCEPTION-EXT"      ' unavailable ,
  ," FACILITY"           ' unavailable ,
  ," FACILITY-EXT"       ' unavailable ,
  ," FILE"               ' unavailable ,
  ," FILE-EXT"           ' unavailable ,
  ," FLOATING"           ' unavailable ,
  ," FLOATING-EXT"       ' unavailable ,
  ," LOCALS"             ' unavailable ,
  ," LOCALS-EXT"         ' unavailable ,
  ," MEMORY-ALLOC"       ' memory-alloc? ,
  ," MEMORY-ALLOC-EXT"   ' unavailable ,
  ," TOOLS"              ' unavailable ,
  ," TOOLS-EXT"          ' unavailable ,
  ," SEARCH-ORDER"       ' unavailable ,
  ," SEARCH-ORDER-EXT"   ' unavailable ,
  ," STRING"             ' unavailable ,
  ," STRING-EXT"         ' unavailable ,
  ," X:defined"          ' X-available ,
  ," X:extension-query"  ' X-available ,
[DEFINED] parse-name [IF]
  ," X:parse-name"       ' X-available ,
[THEN] 
  NULL ,

does>
  2 string-key row dup >r
  if nip nip cell+ @c execute else drop drop drop then r>
;

[DEFINED] 4TH# [IF]
  hide memory-alloc?
  hide character
  hide unavailable
  hide available
  hide X-available
  hide query-hold
  hide query-pad
  hide query-max-char
  hide query-max-n
  hide query-max-u
  hide query-max-ud
  hide query-stack
  hide floored
[THEN]
[THEN]
