\ 4tH CSV splitter - Copyright 2012,2015 J.L. Bezemer
\ You can redistribute this file and/or modify it under
\ the terms of the GNU General Public License

\ WARNING: this program does not check for hash collissions or
\          duplicate filenames which result from filename cleaning!!

include lib/parsing.4th                \ for PARSE-CSV
include lib/leading.4th                \ for -LEADING
include lib/getopts.4th                \ for GET-OPTIONS
include lib/ansmem.4th                 \ for ALLOCATE
include lib/hash.4th                   \ for SDBM
include lib/identify.4th               \ for >IDENTIFIER
include lib/argopen.4th                \ for ARG-OPEN
include lib/breakq.4th                 \ for BREAK?
include lib/chars.4th                  \ for '?'
include lib/csvfrom.4th                \ for CSV>

  255 constant max-fields              \ maximum number of fields
  128 constant max-values              \ maximum number of values
   32 constant max-length              \ maximum length of field

 char ; value delimiter                \ delimiter ASCII value
      0 value selector                 \ field that splits CSV
(error) value lasthash                 \ last hash number found
      0 value value#                   \ number of selector values
      0 value #fields                  \ number of fields
                                       \ alternate TIB
max-fields max-length * constant /bigTIB
                /bigTIB string   bigTIB
struct                                 \ define values structure
  field: hash#                         \ associated hash
  field: address                       \ address of filename
end-struct /value                      \ size of structure

max-values /value * array values     \ values table
  does> over max-values >= abort" Too many values" swap /value * + ;

: .; delimiter emit ;                  ( --)
: (found?) false 2swap bounds break? ;
: (special?) 2dup 2dup '"' (found?) >r ';' (found?) r> or ;
: (CSVtype) bounds ?do i c@ dup '"' = if dup emit then emit loop ;
: Field> delimiter parse-csv -leading -trailing csv> ;
                                       \ get and print a field
: (.Field)                             ( --)
  Field> (special?) if '"' emit (CSVtype) '"' emit else (CSVtype) then
;

: Fields>> 0 ?do Field> 2drop loop ;   ( n --)
: .Field (.Field) .; ;
: .Fields 0 ?do .Field loop ;          ( n --)
: reset 0 >in ! ;                      ( --)
: read-header refill 0= abort" Cannot read header" ;
: print-record reset #fields 1- .Fields (.Field) cr ;
: get-selector selector Fields>> Field> ;
: output-error? error? abort" Cannot open output file" dup use ;
                                       \ returns an index in the value table
: FindHash                             ( n1 -- n2 f)
  0 begin                              \ setup loop
    dup value# <                       \ passed limit?
  while                                \ if not,
    over over values -> hash# @ <>     \ have we found the hash?
  while                                \ if not, try next record
    1+
  repeat nip dup value# <              \ construct flag
;

: AddValue                             ( --)
  get-selector 2dup sdbm dup FindHash 
  if                                   \ search in value tables, if found
    drop drop 2drop                    \ drop index, hash and string
  else                                 \ if missing, add it
    drop value# values -> hash# !      \ drop index, add hash 
    dup s" .csv" rot over + 1+         \ calculate space required
    allocate abort" Out of heap space" >r
    2swap r@ place r@ count >identifier dup 0= if 2drop s" Errors" then
    r@ place r@ +place r>              \ normalize filename
    value# values -> address !         \ save allocated string address
    value# 1+ to value#                \ increment table index
  then
;

: Preprocess                           ( --)
  bigTIB /bigTIB source!               \ initialize big TIB
  read-header begin Field> while drop #fields 1+ to #fields repeat drop
  begin refill while AddValue repeat   \ scan for values, read header again
  dup rewind abort" Cannot rewind input file" read-header
  value# 0 ?do                         \ for all values, write header
    i values -> address @ count output open output-error?
    print-record close                 \ close value associated file
  loop 0                               \ set up dummy file handle
;

: Process                              \ get selected value
  get-selector sdbm dup lasthash =
  if                                   \ if file already open,
    drop                               \ drop the hash
  else                                 \ otherwise close current file
    to lasthash dup if close else drop then
    lasthash FindHash 0= abort" Unknown value found"
    values -> address @ count output append + open output-error?
  then print-record                    \ write the current record
;
                                       \ get a delimiter
: get-delimiter                        ( --)
  get-argument drop c@ to delimiter    \ use first character
;
                                       \ get ASCII code delimiter
: get-code                             ( --)
  get-argument number error? abort" Invalid ASCII code" to delimiter
;
                                       \ get ASCII code delimiter
: get-field                            ( --)
  get-argument number error? abort" Invalid field number"
  dup 0< abort" Field number must be positive" to selector
;

create options
  char d , ' get-delimiter ,
  char c , ' get-code ,
  char f , ' get-field ,
  NULL ,

: OpenFile                             ( --)
  options get-options input option-index dup 1+ argn >
  abort" Usage: csvsplit -d delimiter -c code -f field csv-file"
  arg-open
;                                      \ initialize string buffer

: splitter OpenFile PreProcess begin refill while Process repeat close close ;

splitter
