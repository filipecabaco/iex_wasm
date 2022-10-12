\ 4tH Simple Generator - Copyright 2005,2019 J.L. Bezemer
\ You can redistribute this file and/or modify it under
\ the terms of the GNU General Public License

include lib/scanfile.4th
include lib/filter.4th
include lib/row.4th
include lib/argopen.4th
include lib/parsname.4th
include lib/scanskip.4th
include lib/startend.4th
include lib/leading.4th

0 constant _TEXT                       \ metatype text
1 constant _NUMERIC                    \ metatype numeric
2 constant _BOOL                       \ metatype boolean
3 constant _MEMO                       \ metatype memo

TRUE  constant QUOTED                  \ yes, must be quoted
FALSE constant UNQUOTED                \ no, should be unquoted
                                       \ filter out of CREATE TABLE
create mssql-filter char [ , char ] , NULL ,
create mysql-filter char ` , NULL ,
                                       \ fix any table prefixes
: mssql-table parse-name [char] . scan chop ;
: mysql-table parse-name 2dup [char] . scan dup if chop 2swap then 2drop ;
                                       \ end of CREATE TABLE declaration
: mssql-eof tib count s" ) on" starts? >r 2drop r> 0= ;
: mysql-eof tib count -leading drop c@ [char] ` = ; 
                                       \ parse field definitions
: mssql-field parse-name parse-name ;

: mysql-field 
  parse-name parse-name >r 0
  begin 
    over over chars + c@ dup [char] ( <> swap [char] , <> and over r@ < and
  while 1+ repeat r> min
;
                                       \ map metatype on Simple routines
create behavior                        \ and on quotation in variables
  _TEXT    , ," CellText" QUOTED ,
  _NUMERIC , ," CellText" UNQUOTED ,
  _BOOL    , ," CellBool" UNQUOTED ,
  _MEMO    , ," CellMemo" QUOTED ,
  NULL ,                               \ change table behavior behavior
does>                                  ( n1 n2 -- n3)
  3 rot >r num-key row
  if nip r> cells + @c
  else r> drop drop ." Fieldtype '" . ." ' not found!" cr abort
  then
;
                                       \ map MSSQL datatypes to metatypes
create mysql-datatype                  \ (add if you want to)
  ," varchar"       _TEXT ,
  ," char"          _TEXT ,
  ," float"         _NUMERIC ,
  ," numeric"       _NUMERIC ,
  ," int"           _NUMERIC ,
  ," datetime"      _TEXT ,
  ," smallint"      _BOOL ,
  ," text"          _MEMO ,
  NULL ,
                                       \ map MySQL datatypes to metatypes
create mssql-datatype                  \ (add if you want to)
  ," varchar"       _TEXT ,
  ," char"          _TEXT ,
  ," float"         _NUMERIC ,
  ," currency"      _NUMERIC ,
  ," int"           _NUMERIC ,
  ," datetime"      _TEXT ,
  ," smalldatetime" _TEXT ,
  ," smallint"      _BOOL ,
  ," text"          _MEMO ,
  NULL ,
                                       \ database specifics (filters, types,
create database                        \ fields, eof, etc.)
  ," mssql" mssql-filter , mssql-datatype ,
   ' mssql-table , ' mssql-eof , ' mssql-field ,
  ," mysql" mysql-filter , mysql-datatype ,
   ' mysql-table , ' mysql-eof , ' mysql-field ,
  NULL ,                               \ change database table behavior
does>                                  ( a1 n1 n2 -- xt )
  6 rot >r string-key row 
  if nip nip r> cells + @c 
  else r> drop drop ." Database '" type ." ' not supported" cr abort
  then
;

variable quoting                       \ mapped filters table
variable datatype                      \ mapped datatypes table
variable fp                            \ field pointer in 'fields'
defer get-table                        \ mapped table scanner
defer get-field                        \ mapped field scanner
defer eof?                             \ mapped eof scanner

32 string tablename                    \ tablename
1024 string fieldz                     \ buffer for fields
                                       ( f --)
: Usage abort" Usage: SimpleGen database dsn #records infile outfile" ;
: reset-fp 0 fp ! ;                    ( --)
                                       \ get all parameters and do mapping
: Startup                              ( -- h1 h2)
  argn 6 < Usage                       \ too few args: usage
  1 args 2dup 2dup 2dup 2dup           \ get database type and duplicate
  1 database quoting ! 2 database datatype !
  3 database is get-table 4 database is eof? 5 database is get-field
  3 args number (error) = abort" Number needed for #records"
  input  4 arg-open                    \ open inputfile
  output 5 arg-open                    \ open output file
;
                                       \ close all files
: Shutdown close close ;               ( h1 h2 --)
                                       \ get/put character/string in 'fieldz'
: c>fields fieldz fp @ chars + c! 1 fp +! ;                  ( c --)
: s>fields dup >r fieldz fp @ chars + place r> 1+ fp +! ;    ( a n --)
: fields>c fieldz fp @ chars + c@ 1 fp +! ;                  ( -- c)
: fields>s fieldz fp @ chars + count dup 1+ fp +! ;          ( -- a n)
                                       \ change table datatype behavior
:redo datatype                         ( a1 n1 -- n2)
  @ 2 string-key row
  if nip nip cell+ @c
  else drop ." Datatype '" type ." ' not supported" cr abort
  then
;
                                       \ change table quoting behavior
:redo quoting                          ( a1 n1 -- a1 n2)
  @ begin                              \ get the table address
    dup @c dup NULL <>                 \ is it NULL?
  while                                \ then terminate
    tib count rot filter tib place     \ filter tib
    cell+                              \ next entry
  repeat drop drop                     \ clean up
;
                                       \ skip fields
: Fields>> 0 do parse-name 2drop loop ;
                                       \ find 'CREATE TABLE' line
: FindCreateTable                      ( --)
  s" create table" scan-file 0= abort" No 'CREATE TABLE' line" 2drop
  quoting 2 Fields>> get-table tablename place 
;
                                       \ parse all field declarations
: ParseFields                          ( --)
  reset-fp                             \ reset fieldpointer
  begin
    refill                             \ get next line
  while                                \ filter out all quoting and
    eof? >r quoting r>                 \ exit when eof
  while
    TRUE c>fields                      \ yes, there will be another field
    get-field 2swap                    \ get fieldname and datatype
    s>fields                           \ write fieldname to fields
    datatype c>fields                  \ write metatype to fields
  repeat
  FALSE c>fields                       \ no more fields, we're done
;
                                       \ several field printing utilities
: .arg args type ;                     ( n --)
: .' [char] ' emit ;                   ( --)
: .$ [char] $ emit ;                   ( --)
: .field fields>s type ;               ( --)
: typeln type cr ;                     ( a n --)
: margin 5 spaces ;                    ( --)
: indent 2 spaces ;                    ( --)
: break margin ." break;" cr ;         ( --)
: end-function [char] } emit cr cr ;   ( --)
: comma? fields>c dup if ." , " then 0= ;
: fields-drop fields>c drop ;          ( --)
: fields-skip fields>s 2drop fields-drop fields-drop ;
: fields-reset reset-fp fields-drop ;  ( --)
: field-id fields-reset fields>s ;     ( -- a n)
: .comma? fields-drop comma? ;         ( --)
: PrintQFields begin .' .field .' .comma? until ;
: PrintVars begin .$ .field .comma? until ;
: PrintPVars begin ." $_POST['" .field ." ']" .comma? until ;
: PrintFields begin .field .comma? until ;
: PrintVarsList fields-reset PrintVars ;
: PrintPVarsList fields-reset PrintPVars ;
: PrintQFieldList fields-reset PrintQFields ;
: PrintVarsNoID fields-reset fields-skip PrintVars ;
: PrintPVarsNoID fields-reset fields-skip PrintPVars ;
: PrintFieldsNoID fields-reset fields-skip PrintFields ;
                                       \ should field be quoted?
: quoted?                              ( a n -- f)
  fields>c 2 behavior quoted = if .' .$ type .' else .$ type then comma?
;
                                       \ print the INSERT list
: PrintInsertList                      ( --)
  fields-reset fields-skip
  begin fields>s quoted? until
;
                                       \ print the UPDATE list
: PrintUpdateList                      ( --)
  fields-reset fields-skip
  begin fields>s 2dup type ." =" quoted? until
;
                                       \ print the vars list in the body
: PrintGetFields                       ( --)
  fields-reset
  1 begin                              \ we start with field 1
    margin .$ fields>s type            \ print the variable
    ."  = SQLColumn ($cur, " dup . 1+ ." );" cr
    fields-drop fields>c 0=            \ print the SQL statement
  until drop                           \ drop the field
;
                                       \ create <FORM> fields
: PrintFormFields
  fields-reset fields-skip             \ skip the ID
  1 begin                              \ two colums per row
    margin indent                      \ print the label
    ." CellLabel ('<b>" fields>s 2dup 2dup type ." </b>');" cr
    margin indent                      \ create the <FORM> field
    fields>c 1 behavior count type ."  ('" type ." ', $" type ." );" cr
    1+ dup 2 mod fields>c tuck and     \ should we start a new row?
    if margin ." CellNewRow ();" cr then 0=
  until drop                           \ drop the column counter
;
                                       \ change tablename behavior
:redo tablename count type ;           \ print the tablename
                                       \ print all preliminaries
: BeginProgram                         ( --)
  s| <?php| typeln
  s| // Dit file is gegenereerd door SimpleGen, Copyright 2005,2019 - Hans Bezemer| typeln cr
  s| require ("StdEnv.lib.php");| typeln
  s| require ("SQL.lib.php");| typeln
  s| require ("Button.lib.php");| typeln
  s| require ("Cells.lib.php");| typeln
  s| require ("Simple.lib.php");| typeln cr
;
                                       \ create the Update() function
: UpdateFunction                       ( --)
  s| // Deze functie update een bestaand record. De SQL statement wordt hier samengesteld.| typeln
  s| function Update| type tablename
  s|  (| type PrintVarsList s| , $uid, $pwd) {| typeln
  s|   $MySQL = "UPDATE | type tablename
  s|  SET | type PrintUpdateList s|  WHERE | type
  field-id 2dup 2dup type ." =$" type s| ";| typeln
  s|   if (! empty ($| type type s| )) SQLExec (| type
  2 .arg s| , $MySQL, $uid, $pwd);| typeln
  end-function
;
                                       \ create the Insert() function
: InsertFunction                       ( --)
  s| // Deze functie insert een nieuw record. De SQL statement wordt hier samengesteld.| typeln
  s| function Insert| type tablename
  s|  (| type PrintVarsNoID s| , $uid, $pwd) {| typeln
  s|   $MySQL = "INSERT INTO | type tablename
  s|  (| type PrintFieldsNoID s| ) VALUES (| type
  PrintInsertList s| )";| typeln
  s|   SQLExec (| type 2 .arg s| , $MySQL, $uid, $pwd);| typeln
  end-function
;
                                       \ create the Search() function
: SearchFunction                       ( --)
  s| // Deze functie zoekt een bestaand record. De SQL statement wordt hier samengesteld.| typeln
  s| function Search| type tablename s|  ($search, $id, $uid, $pwd) {| typeln
  s|   $MySQL = "SELECT | type field-id 2dup 2dup type
  s|  FROM | type tablename s|  WHERE | type
  type s| =$search AND | type type s| >$id";| typeln
  s|   $ret = SQLookup (| type 2 .arg s| , $MySQL, $uid, $pwd); return $ret;|
  typeln end-function
;
                                       \ create the dispatcher
: ActionSelect                         ( --)
  s| session_start();| typeln
  s| if (!isset ($_POST['navigate'])) $_POST['navigate'] = 'FIRST';|
  typeln cr
  s| if (isset ($_POST['mode']))| typeln
  s|    switch ($_POST['mode']) {| typeln
  s|    case 'EDIT': Update| type tablename ."  ("
  PrintPVarsList  s| , $_SESSION['username'], $_SESSION['password']);|
  typeln break
  s|    case 'INSERT': Insert| type tablename ."  ("
  PrintPVarsNoID  s| , $_SESSION['username'], $_SESSION['password']);|
  typeln break
  s|    case 'DELETE': SQLExec (| type 
  2 .arg s| , "DELETE FROM | type tablename s|  WHERE | type
  field-id 2dup 2dup 2dup 2dup type ."  = ${_POST['" type
  s| ']}", $_SESSION['username'], $_SESSION['password']);| typeln break
  s|    case 'SEARCH': | type s| $_POST['| type type s| '] = Search| type tablename
  s|  ($_POST['search'], $_POST['| type type 
  s| '], $_SESSION['username'], $_SESSION['password']);| type cr
  s|      $_POST['navigate'] = (empty ($_POST['| type type
  s| ']) ? 'FIRST' : 'HERE');| typeln
  break end-function
;
                                       \ create fieldlist statements
: FieldList                            ( --)
  s| $fields = array (| type PrintQFieldList ." );" cr
  s| $SQLstr = SimpleSQL ('| type tablename s| ', $fields, '| type 
  field-id 2dup type ." ', $_POST['navigate'], $_POST['" type ." '], " 3 .arg ." );" cr cr
  s| CellNewPage ('| type tablename  ."  overzicht');" cr
  s| InitImageButtons ();| type cr cr
;
                                       \ create the main body
: Body                                 ( --)
  s| $cur = SQLConnect (| type 2 .arg
  s| , $SQLstr, $_SESSION['username'], $_SESSION['password']);| typeln
  s| $next = (SQLFetch ($cur));| typeln cr
  s| do {| typeln
  margin s| $_POST['navigate'] = $next ? $_POST['navigate'] : 'NEW';|
  typeln PrintGetFields cr
  margin s| CellElements ($| type field-id type s| );| typeln
  PrintFormFields
;
                                       \ print all closing statements
: EndProgram                           ( --)
  margin s| CellHiddenElements ();| typeln field-id 2dup 2dup 2dup
  margin indent s| CellHidden ('| type type ." ', $" type ." );" cr 
  margin indent s| SimpleHidden ();| typeln
  margin s| CellEndElements ();| typeln cr 
  margin s| SimpleBar ($| type type ." , $_POST['navigate']);" cr
  margin s| SimpleEndBar ();| typeln cr
  margin s| $next = (SQLFetch ($cur));| typeln
  s| } while ($next);| typeln cr
  s| SQLDisconnect ($cur);| typeln
  s| SimpleNavigate ($| type type ." , $_POST['navigate']);" cr
  s| CellEndPage ();| typeln
  s| ?>| typeln
;

: CreateSimple                         ( --)
  Startup                              \ get parms, setup and open files
  FindCreateTable                      \ get 'CREATE TABLE' line and parse
  ParseFields                          \ parse all fields
  BeginProgram                         \ print all preliminaries
  UpdateFunction                       \ create the Update() function
  InsertFunction                       \ create the Insert() function
  SearchFunction                       \ create the Search() function
  ActionSelect                         \ create the dispatcher
  FieldList                            \ create fieldlist statements
  Body                                 \ create the main body
  EndProgram                           \ print all closing statements
  Shutdown                             \ close all files
;

CreateSimple
