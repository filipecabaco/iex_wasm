\ 4tH library - XMLS writer - Copyright 2010,2012 J.L. Bezemer
\ You can redistribute this file and/or modify it under
\ the terms of the GNU General Public License

\ Note: Only one XMLS file can be open at the time.
\       That is why no handle is returned.
\       You HAVE to close the file using XMLSclose!

[UNDEFINED] XMLStype     [IF]
[UNDEFINED] forcerawutf8 [IF] include lib/utf8type.4th [THEN]

file XMLS                               \ file descriptor for XMLS file
                                        \ XMLS equivalents of CR, . and TYPE
: >XMLS XMLS use ;
: <Cell> .| <Cell><Data ss:Type=| ;
: </Cell> .| </Data></Cell>| cr ;
: XMLScr >XMLS .| </Row>| cr  .| <Row>| cr ;
: XMLS# >XMLS <Cell> .| "Number">| type </Cell> ;
: XMLS. <# #s #> XMLS# ;               ( n --)
: XMLSend >XMLS .| </Row>| cr .| </Table>| cr .| </Worksheet>| cr ;
: XMLSclose XMLS dup use .| </Workbook>| cr close ;

: XMLStype                             ( a n --)
  >XMLS <Cell> .| "String">|
 [DEFINED] forcerawutf8 [IF] type [ELSE] utf8type [THEN]
  </Cell>
;
                                       \ This opens a new worksheet
: XMLSsheet                            ( a n --)
  >XMLS .| <Worksheet ss:Name="| type .| ">| cr .| <Table>| cr .| <Row>| cr
;
                                       \ This opens a file as XMLS file
: XMLSopen                             ( a n -- f)
  output open dup to XMLS error? dup >r
  if                                   \ open file, if not successful
    drop
  else                                 \ else use it
    use .| <?xml version="1.0" encoding="UTF-8"?>| cr
    .| <Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet"| cr
    .| xmlns:o="urn:schemas-microsoft-com:office:office"| cr
    .| xmlns:x="urn:schemas-microsoft-com:office:excel"| cr
    .| xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet"| cr
    .| xmlns:html="http://www.w3.org/TR/REC-html40">| cr
  then r>
;

[DEFINED] 4TH# [IF]
  hide XMLS
  hide >XMLS
  hide <Cell>
  hide </Cell>
[THEN]
[THEN]

\ A small example with two workbooks
\ s" msxmls4th.xlsx" XMLSopen 0= if s" Sheet1" XMLSsheet
\ s" Label1" XMLStype s" Label2" XMLStype XMLScr 34 XMLS. 4500 XMLS. XMLSend
\ s" Sheet2" XMLSsheet s" Label3" XMLStype s" Label4" XMLStype XMLScr
\ 1 XMLS. 2 XMLS. 3 XMLS. XMLScr 4 XMLS. 5 XMLS. 6 XMLS. XMLSend XMLSclose then
\ depth .
