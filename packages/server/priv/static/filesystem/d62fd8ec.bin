\ 4tH CSV to XML converter - Copyright 2012,2014 J.L. Bezemer
\ You can redistribute this file and/or modify it under
\ the terms of the GNU General Public License

include lib/argopen.4th                \ for ARG-OPEN
include lib/parsing.4th                \ for PARSE-CSV, PARSE-CSV?
include lib/identify.4th               \ for >IDENTIFIER
include lib/strbuf.4th                 \ for STR-BUFFER?, >STR-BUFFER
include lib/basename.4th               \ for -EXT
include lib/getopts.4th                \ for GET-OPTIONS
include lib/utf8type.4th               \ for UTF8TYPE
include lib/csvfrom.4th                \ for CSV>

   2048 constant /mytib                \ size of input buffer
 /mytib buffer:  mytib                 \ allocate input buffer
  10240 constant /buffer               \ size of field buffer
/buffer buffer:  buffer                \ allocate field buffer
    256 constant #fields               \ number of fields
#fields array    fields                \ allocate fields
    256 string   temp-path             \ buffer for filename assembly
     32 string   xmlname               \ name of XML item
 char ; value    delimiter             \ CSV file delimiter

: .name xmlname count s>lower type ;   \ display the name
                                       \ add a fields to the table
: add-field                            ( n --) 
  fields dup @ dup #fields = abort" Too many fields" cells + ! 1 fields +!
;                                      \ abort if too many fields
                                       \ save an XML tag
: >tag                                 ( a n --)
  buffer str-buffer? abort" Duplicate field" buffer >str-buffer add-field
;                                      \ add the name to field buffer
                                       ( -- f)
: ReadLine? refill mytib count nip /mytib 1- = abort" Line too long" ;
: CloseFile drop drop close ;          ( h n1 n2 --)
: WriteHeaderXML .| <?xml version="1.0" encoding="UTF-8"?>| cr ;
: WriteFooterXML .| </| .name .| List>| cr ;
: .OpenTag 4 spaces ." <" count type ." >" ;
: .CloseTag ." </" count type ." >" cr ;
                                       \ write a value
: Taggify                              ( a n1 n2 --)
  over                                 \ check length
  if                                   \ not not empty, write it
    cells fields + @ dup >r .OpenTag utf8type r> .CloseTag
  else                                 \ if empty, drop it
    drop 2drop
  then
;
                                       \ write an entire row of values
: ParseLine                            ( n c -- n c)
  over 1+ 1 ?do dup parse-csv -leading -trailing csv> i Taggify loop
;
                                       \ write the XSD header
: WriteHeaderXSD                       ( --)
  WriteHeaderXML                       \ use the standard XML header
  .| <xs:schema xmlns:xs="http://www.w3.org/2001/XMLSchema" targetNamespace="http://xsd/|
  .name .| " elementFormDefault="qualified">| cr cr
  .| <xs:complexType name="| .name .| ListType">| cr
  2 spaces .| <xs:all>| cr
  4 spaces .| <xs:element name="| .name 
  .| " type="| .name .| Type" minOccurs="1" maxOccurs="unbounded"/>| cr
  2 spaces .| </xs:all>| cr .| </xs:complexType>| cr cr
  .| <xs:complexType name="| .name .| Type">| cr
  2 spaces .| <xs:all>| cr
;
                                       \ write the list of fields
: WriteBodyXSD                         ( -- c n)
  ReadLine? 0= abort" Cannot read CSV" \ first line must be field names
  delimiter 0
  begin                                \ get the ASCII code 
    over parse-csv?                    \ is there more to parse?
  while                                \ if so, get name, normalize it
    >identifier dup 0= abort" No fieldname"
    2dup >tag 4 spaces                 \ save it and write it
    .| <xs:element name="| type
    .| " type="xs:string" minOccurs="0" maxOccurs = "1"/>| cr 1+
  repeat 2drop                         \ drop null string
;
                                       \ write the XSD footer
: WriteFooterXSD                       ( --)
  2 spaces ." </xs:all>" cr
  ." </xs:complexType>" cr
  ." </xs:schema>" cr
;
                                       \ Determine ASCII and number of fields
: WriteXSD                             ( -- c n)
  option-index 1+ args -ext temp-path place s" .xsd" temp-path +place
  temp-path count output open error? abort" Cannot open .XSD file" dup use
  WriteHeaderXSD WriteBodyXSD WriteFooterXSD rot close
;
                                       \ write a complete row of data
: WriteBodyXML                         ( n c -- n c)
  begin 
    ReadLine?                          \ can a line be read?
  while
    2 spaces ." <" .name ." >" cr      \ write start of row
    ParseLine                          \ parse line and write fields
    2 spaces ." </" .name ." >" cr     \ write end of row
  repeat
;
                                       \ write the XML data
: WriteXML                             ( c n -- c n)
  option-index 1+ args output open error? abort" Cannot open .XML file" dup use
  WriteHeaderXML ." <" .name ." List>" cr swap rot
  WriteBodyXML WriteFooterXML swap rot close
;
                                       \ get ASCII code delimiter
: get-code                             ( --)
  get-argument number error? abort" Invalid ASCII code" to delimiter
;
                                       \ get a delimiter
: get-delimiter                        ( --)
  get-argument drop c@ to delimiter    \ use first character
;
                                       \ get the XML item name
: get-xmlname                          ( --)
  get-argument xmlname place           \ set the XML name
;
                                       \ options list
create options
  char c , ' get-code ,
  char d , ' get-delimiter ,
  char n , ' get-xmlname ,
  NULL ,
                                       \ Open input file and initialize
: OpenFile                             ( --)
  mytib /mytib source! s" Item" xmlname place 1 fields !
  options get-options input option-index dup 2 + argn >
  abort" Usage: csv2xml -c ascii -d delimiter -n name csv-file xml-file"
  arg-open buffer /buffer str-buffer   \ open CSV file
;                                      \ initialize string buffer
                                       \ main entry
: Convert OpenFile WriteXSD WriteXML CloseFile ;

Convert