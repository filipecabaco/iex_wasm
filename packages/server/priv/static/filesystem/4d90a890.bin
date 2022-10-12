\ 4tH ANS "CASE" to 4tH Converter - Copyright 2009,2020 J.L. Bezemer
\ You can redistribute this file and/or modify it under
\ the terms of the GNU General Public License

\ N.B. This program is no longer required, since 4tH v3.64.0
\      and later support the CASE..ENDCASE construct.

include lib/parsname.4th               \ for PARSE-NAME
include lib/row.4th                    \ for ROW
include lib/stack.4th                  \ for >A A>

 32 constant #case                     \ depth of CASE stack
 #case array case-stack                \ CASE control stack
                                       \ a few helper words
: cursor@ >in @ ;                      \ save cursor of TIB
: eol? >in @ = dup if cr else space then ;
: ?emit dup bl < if drop else emit then ;
: >delimiter >r type space r@ parse type r> ?emit ;
: case? case-stack adepth 0= abort" Missing CASE" ;
                                       \ associated behavior
: >EOL 0 >delimiter ;                  \ with listed delimiters
: >) [char] ) >delimiter ;
: >" [char] " >delimiter ;
: >| [char] | >delimiter ;
: >] [char] | >delimiter ;
: >WHITE type space parse-name type ;  \ set ELSE counter to zero
: >OF 2drop ." OVER = IF DROP" ;       \ convert "OF" to "OVER = IF DROP"
: >ENDOF 2drop case? ." ELSE" case-stack a> 1+ case-stack >a ;
: >ENDCASE 2drop case? ." DROP" case-stack a> 0 ?do ."  THEN" loop ;

: >CASE                                \ abort when nesting is too deep
  2drop case-stack adepth #case 1- = abort" Nesting too deep"
  ." ( CASE statement)" 0 case-stack >a
;                                      \ put new counter on the stack
                                       \ keywords with associated behaviors
create keyword
  ," \"            ' >EOL ,
  ," ("            ' >) ,
  ," #!"           ' >EOL ,
  ,| ,"|           ' >" ,
  ," ,|"           ' >| ,
  ,| ."|           ' >" ,
  ," .("           ' >) ,
  ," .|"           ' >| ,
  ,| S"|           ' >" ,
  ," S|"           ' >| ,
  ,| C"|           ' >" ,
  ," C|"           ' >| ,
  ," CHAR"         ' >WHITE ,
  ," @GOTO"        ' >EOL ,
  ," [NEEDS"       ' >] ,
  ,| ABORT"|       ' >" ,
  ,| THROW"|       ' >" ,
  ," [CHAR]"       ' >WHITE ,
  ," INCLUDE"      ' >WHITE ,
  ," [DEFINED]"    ' >WHITE ,
  ," [UNDEFINED]"  ' >WHITE ,
  ," CASE"         ' >CASE ,
  ," OF"           ' >OF ,
  ," ENDOF"        ' >ENDOF ,
  ," ENDCASE"      ' >ENDCASE ,
  NULL ,                               \ standard behavior of keyword
does> 2 string-key row if cell+ @c execute else drop type then ;
                                       \ prerequisites of CONVERT.4TH
: Usage abort" Usage: case24th Forth-file 4tH-file" ;
: Read-file refill ;
: PreProcess case-stack stack ;
: PostProcess case-stack adepth abort" Unmatched CASE" ;
: Process begin cursor@ >r bl parse keyword r> eol? until ;

include lib/convert.4th
