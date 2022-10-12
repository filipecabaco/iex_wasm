\ 4tH CSV to SQL converter - Copyright 2020 J.L. Bezemer
\ You can redistribute this file and/or modify it under
\ the terms of the GNU General Public License

[PRAGMA] ZenFP                         \ dirty, but we need it

include lib/parsing.4th                \ for PARSE-CSV?
include lib/leading.4th                \ for -LEADING
include lib/dstringt.4th               \ for DS.PLACE
include lib/getopts.4th                \ for GET-OPTIONS
include lib/csvfrom.4th                \ for CSV>
include lib/scanskip.4th               \ for SPLIT
include lib/zenfpio.4th                \ for >FLOAT
\ include lib/anstools.4th               \ for .S

 15 constant {string}                  \ field contains a STRING
240 constant {number}                  \ field contains a NUMBER
(error) constant {fixed}               \ do not change this entry

 1 constant {+str}                     \ add to the count for strings
16 constant {+num}                     \ add to the count for numbers

struct                                 \ structure of a field
  field: name                          \ name of field
  field: data                          \ datatype of field
end-struct (/field)                    \ total size of structure

256 constant #field                    \ maximum number of fields
  0 value    #fields                   \ number of fields read

char ; value delimiter                 \ CSV delimiter

64 constant /tblname                   \ table name
/tblname string tblname s" noname" latest place
                                       \ intialize table name
#field (/field) * array fields does> swap (/field) * cells + ;
                                       \ allocate field structures
2048 constant /mytib                   \ define TIB size
/mytib buffer: mytib                   \ allocate a larger TIB

aka refill read-file                   \ ** required by CONVERT **
                                       ( n-- f)
: num>str? max-n and dup 4 rshift swap {string} and > ;
: field> delimiter parse-csv? >r csv> -leading -trailing r> ;
: dummy num>str? if ." 0" else .| ""| then ;
: mysql.format ." `" type ." `" ;      ( a n --)
: mssql.format ." [" type ." ]" ;      ( a n --)
: oracle.format .| "| type .| "| ;     ( a n --)
: ?"type" num>str? if type else .| "| type .| "| then ;
: float? >float dup if nip nip then ;

: adjust                               ( n1 v -- n2)
  dup >r @ over {+str} = if {string} else {number} then
  tuck and = if drop else r@ +! then r> @
;
                                       ( a n type --)
defer field.format ' mysql.format is latest
                                       \ format a field read
: type.format                          ( a n1 f n2 --) 
  fields -> data swap if               \ did we retrieve a field?
    dup @ {fixed} and
    if @ else >r 2dup float? if {+num} else {+str} then r> adjust then ?"type"
  else 
    @ dummy 2drop                      \ if we did not retrieve a field
  then                                 \ compose a dummy value
;

: Preprocess                           \ ** required by CONVERT **
  mytib /mytib source! #field 0 ?do i fields -> name ds.init loop
  refill if                            \ set up TIB and read the header
    begin field> while #fields fields -> name ds.place 1 +to #fields repeat
    2drop                              \ store them in the field structure
  else                                 \ if header can't be read it's an error
    ." Cannot read CSV" abort
  then
;

: Process                              \ ** required by CONVERT **
  ." INSERT INTO " tblname count type ."  ("
  0 fields -> name ds.count field.format
  #fields 1 ?do ." , " i fields -> name ds.count field.format loop
  ." ) VALUES (" field> 0 type.format  \ write fields, then write values
  #fields 1 ?do ." , " field> i type.format loop ." );" cr
;
                                       \ ** required by CONVERT **
: Postprocess   #field 0 ?do i fields -> name ds.free loop ;
                                       \ ** required by CONVERT **
: Usage abort" csv2sql -d <delimiter> -c <code> -n <f0,f1..fn> -s <f0,f1..fn> -T <table> -t <dbtype> infile.csv outfile.sql" ;
                                       \ set type in selected fields
: split-fields                         ( a n1 n2 --)
  >r begin
    [char] , split number error?       \ split and convert to number
    if                                 \ if it's not a number, ignore it
      drop ." Illegal field ignored" cr
    else                               \ enter a sane value in structure
      0 max #field 1- min fields -> data r@ {fixed} or swap !
    then                               \ if it's a number, set the type
    chop dup 0> 0=                     \ until everything is parsed
  until 2drop rdrop                    \ cleanup stacks
;
                                       \ evaluate the options
: get-strings get-argument {string} split-fields ;
: get-numbers get-argument {number} split-fields ;
: get-delimiter get-argument drop c@ to delimiter ;
: get-name get-argument tblname place ;
                                       \ get ASCII code delimiter
: get-code                             ( --)
  get-argument number error? abort" Invalid ASCII code" to delimiter
;
  
create dbtype                          \ set the column formatting mode
  ," mssql"  ' mssql.format ,          \ SQL server
  ," mysql"  ' mysql.format ,          \ MySQL
  ," oracle" ' oracle.format ,         \ Oracle
  NULL ,
does>                                  \ dismiss invalid values and set mode
  2 string-key row 0= abort" Unknown database" cell+ @c is field.format 2drop
;

: get-dbtype get-argument dbtype ;     \ get database type and set mode
                                       \ ** required by CONVERT **
create options                         \ command line options
  char d , ' get-delimiter ,
  char c , ' get-code ,
  char t , ' get-dbtype ,
  char n , ' get-numbers ,
  char s , ' get-strings ,
  char T , ' get-name ,
  NULL  ,

include lib/convert.4th

