\ 4tH MySQL KEY to DOT - Copyright 2010,2012 J.L. Bezemer
\ You can redistribute this file and/or modify it under
\ the terms of the GNU General Public License

\ Converts information_schema.key_column_usage .CSV to Graphviz DOT source
\ http://www.graphviz.org

include lib/parsing.4th                \ for "PARSE"
include lib/ncoding.4th                \ for N!
include lib/compare.4th                \ for COMPARE

struct                                 \ copy of key_column usage
  512 +field cons_catalog              \ constraint catalog
   64 +field cons_schema               \ constraint schema
   64 +field cons_name                 \ constraint name
  512 +field table_cat                 \ table catalog
   64 +field table_schema              \ source table schema
   64 +field table_name                \ source table name
   64 +field col_name                  \ source table column name
 nell +field ord_position              \ ord. position
 nell +field pos_in_cons               \ position in constraint
   64 +field ref_schema                \ ref. table schema
   64 +field ref_table                 \ ref. table name
   64 +field ref_col                   \ ref. table column name
end-struct /key                        \ size of structure

/key string key                        \ allocate space for record

/key 64 + constant /mytib              \ req. space for Terminal Input Buffer
/mytib string mytib                    \ allocate space for TIB
                                       \ store field
: field! [char] ; "parse" rot place ;  ( a --)
: nfield! [char] ; "parse" number swap n! ;
                                       \ parse TIB and fill record
: ?convert                             ( f --)
  dup if                               \ if REFILL was succesful
    key -> cons_catalog field!         \ parse and fill record
    key -> cons_schema field!
    key -> cons_name field!
    key -> table_cat field!
    key -> table_schema field!
    key -> table_name field!
    key -> col_name field!
    key -> ord_position nfield!
    key -> pos_in_cons nfield!
    key -> ref_schema field!
    key -> ref_table field!
    key -> ref_col field!
  then
;
                                       \ required for CONVERT.4TH
: Read-file refill ?convert ;          \ process a record
: Usage abort" Usage: key2dot csv-file dot-file" ;
: PostProcess [char] } emit cr ;       \ write closing brace
                                       \ field contains NULL?
: =NULL count s" NULL" compare 0= ;    ( a -- f)
: reference? =NULL >r =NULL r> or 0= ; ( a1 a2 -- f)
: "type" [char] " emit count type char " emit ;
                                       \ write a label
: .label                               ( --)
  key -> col_name count 2dup type key -> ref_col count compare
  if ."  >> " key -> ref_col count type then
;                                      \ if both fields contain not NULL
                                       \ write a reference
: .reference                           ( --)
  key -> table_name "type" ."  -> " key -> ref_table "type"
  .|  [arrowtail=crow, arrowhead=none, label="| .label .| "];| cr
;                                      \ write edge and label

: PreProcess                           \ make a new edge if node found
  ." digraph mysql {" cr
  ." node [shape=box, color=lightblue2, style=filled];" cr
  ." ratio=0.5;" cr
  mytib /mytib source!                 \ initialize TIB
;
                                       \ process a single line
: Process key -> ref_table key -> ref_col reference? if .reference then ;
                                       \ if both fields are a reference
include lib/convert.4th                \ write out the reference
