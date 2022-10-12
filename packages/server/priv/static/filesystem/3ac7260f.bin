\ 4tH library - FODS writer - Copyright 2010,2012 J.L. Bezemer
\ You can redistribute this file and/or modify it under
\ the terms of the GNU General Public License

\ Note: Only one FODS file can be open at the time.
\       That is why no handle is returned.
\       You HAVE to close the file using FODSclose!

[UNDEFINED] FODStype     [IF]
[UNDEFINED] forcerawutf8 [IF] include lib/utf8type.4th [THEN]

file FODS                              \ file descriptor for FODS file
                                       \ FODS equivalents of CR, . and TYPE
: >FODS FODS use ;                     ( --)
: <Cell> .| <table:table-cell office:value-type=| ;
: </Cell> .| </text:p>| cr .| </table:table-cell>| cr ;
: FODScr >FODS .| </table:table-row>| cr  .| <table:table-row>| cr ;
: FODSend >FODS .| </table:table-row>| cr .| </table:table>| cr ;

: FODStype                             ( a n --)
  >FODS <Cell> .| "string">| cr .| <text:p>|
  [DEFINED] forcerawutf8 [IF] type [ELSE] utf8type [THEN]
  </Cell>
;
                                       \ print a numeric string
: FODS#                                ( a n --)
  2dup >FODS <Cell> .| "float" office:value="| type .| ">| cr
  .| <text:p>| type </Cell>
;
                                       \ print a number
: FODS. <# #s #> FODS# ;               ( n --)
                                       \ close a .fods file
: FODSclose
  FODS dup use .| </office:spreadsheet>| cr
  .| </office:body>| cr  .| </office:document>| cr close
;
                                       \ This opens a new worksheet
: FODSsheet                            ( a n --)
  >FODS .| <table:table table:name="| type .| ">| cr  .| <table:table-row>| cr
;
                                       \ This opens a file as FODS file
: FODSopen                             ( a n -- f)
  output open dup to FODS error? dup >r
  if                                   \ open file, if not successful
    drop
  else                                 \ else use it
    use .| <?xml version="1.0" encoding="UTF-8"?>| cr
    .| <office:document xmlns:office="urn:oasis:names:tc:opendocument:xmlns:office:1.0"| cr
    .| xmlns:text="urn:oasis:names:tc:opendocument:xmlns:text:1.0"| cr
    .| xmlns:table="urn:oasis:names:tc:opendocument:xmlns:table:1.0"| cr
    .| office:mimetype="application/vnd.oasis.opendocument.spreadsheet">| cr
    .| <office:body>| cr
    .| <office:spreadsheet>| cr
  then r>
;

[DEFINED] 4TH# [IF]
  hide FODS
  hide >FODS
  hide <Cell>
  hide </Cell>
[THEN]
[THEN]

\ A small example with two workbooks
\ s" oofods4th.fods" FODSopen 0= if s" Sheet1" FODSsheet
\ s" Label1" FODStype s" Label2" FODStype FODScr 34 FODS. 4500 FODS. FODSend
\ s" Sheet2" FODSsheet s" Label3" FODStype s" Label4" FODStype FODScr 1 FODS.
\ 2 FODS. 3 FODS. FODScr 4 FODS. 5 FODS. 6 FODS. FODSend FODSclose then depth .
