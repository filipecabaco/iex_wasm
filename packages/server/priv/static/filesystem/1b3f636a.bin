\ 4tH library - KSP writer - Copyright 2010,2012 J.L. Bezemer
\ You can redistribute this file and/or modify it under
\ the terms of the GNU General Public License

\ Note: Only one KSP file can be open at the time.
\       That is why no handle is returned.
\       You HAVE to close the file using KSPclose!

[UNDEFINED] KSPtype      [IF]
[UNDEFINED] forcerawutf8 [IF] include lib/utf8type.4th [THEN]

variable KSProw                        \ Kspread row number    (starts at one)
variable KSPcol                        \ Kspread column number (starts at one)

/hold string KSPhold                   \ temporary buffer for numbers
file KSP                               \ file descriptor for KSP file
                                       \ open a KSpread file
: KSPopen                              ( a n -- f)
  output open dup to KSP error? dup >r
  if                                   \ open file, if not successful
    drop
  else                                 \ else use it
    use .| <?xml version="1.0" encoding="UTF-8"?>| cr
    .| <!DOCTYPE spreadsheet PUBLIC "-//KDE//DTD kspread 1.2//EN" "http://www.koffice.org/DTD/kspread-1.2.dtd">| cr
    .| <spreadsheet xmlns="http://www.koffice.org/DTD/kspread" mime="application/x-kspread" syntaxVersion="1" editor="KSpread" >| cr
    .| <map>| cr
  then r>
;
                                       \ format a cell
: <Cell>                               ( a n -- a n)
  KSP use 2dup .| <cell row="| KSProw @ 0 .r
  .| " column="|  KSPcol @ 0 .r .| " >| cr .| <text outStr="|
  [DEFINED] forcerawutf8 [IF] type [ELSE] utf8type [THEN]
  .| " dataType=|
;
                                       \ KSP equivalents of CR, . and TYPE
: </Cell>
  .| >| [DEFINED] forcerawutf8 [IF] type [ELSE] utf8type [THEN]
  .| </text>| cr .| </cell>| cr 1 KSPcol +!
;

: KSPend KSP use .| </table>| cr ;     ( --)
: KSPcr 1 KSPcol ! 1 KSProw +! ;       ( --)
: KSPatxy KSPcol ! KSProw ! ;          ( row col --)
: KSPclose KSP dup use .| </map>| cr .| </spreadsheet>| cr close ;
: KSPtype dup if <Cell> .| "Str"| </Cell> else 2drop 1 KSPcol +! then ;
: KSP# KSPhold place KSPhold count <Cell> .| "Num"| </Cell> ;
: KSP. <# #s #> KSP# ;
: KSPsheet KSP use 1 dup KSProw ! KSPcol ! .| <table name="| type .| ">| cr ;

[DEFINED] 4TH# [IF]
  hide KSP
  hide KSProw
  hide KSPcol
  hide KSPhold
  hide <Cell>
  hide </Cell>
[THEN]
[THEN]

\ A small example with two workbooks
\ s" koksp4th.ksp" KSPopen 0= if s" Sheet1" KSPsheet
\ s" Label1" KSPtype s" Label2" KSPtype KSPcr 34 KSP. 4500 KSP. KSPend
\ s" Sheet2" KSPsheet s" Label3" KSPtype s" Label4" KSPtype KSPcr 1 KSP.
\ 2 KSP. 3 KSP. KSPcr 4 KSP. 5 KSP. 6 KSP. KSPend KSPclose then depth .
