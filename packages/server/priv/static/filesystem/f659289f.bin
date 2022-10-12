\ 4tH CSV to XLS converter - Copyright 2004, 2015 J.L. Bezemer
\ You can redistribute this file and/or modify it under
\ the terms of the GNU General Public License

include lib/msxls2-w.4th               \ for XLSopen
include lib/msxmls-w.4th               \ for XMLSopen
include lib/koksp-w.4th                \ for KSPopen
include lib/oofods-w.4th               \ for FODSopen
include lib/html-w.4th                 \ for HTMLopen
include lib/create-w.4th               \ for CREATopen
include lib/json-w.4th                 \ for JSONopen
include lib/argopen.4th                \ for ARG-OPEN
include lib/parsing.4th                \ for "PARSE"
include lib/getopts.4th                \ for GET-OPTIONS
include lib/csvfrom.4th                \ for CSV>

[hex] 1FFFFFFF constant max-xls [decimal]

4096 constant /mytib                   \ define extra large TIB
/mytib buffer: mytib                   \ for long records

char ; value delimiter                 \ delimiter ASCII value
                                       \ enumerate supported formats
  0 enum XLS                           \ MS-Excel 2.1
    enum XLSX                          \ MS-Excel 2003
    enum HTML                          \ HTML 4.01 Transitional
    enum KSP                           \ KOffice 1.6
    enum 4TH                           \ 4tH table
    enum JSON                          \ JSON ECMA-404
constant FODS                          \ OpenOffice 2.3

XLS value format                       \ default output format
                                       \ map formats to enumerations
create format?                         ( -- a1 n1 n2 f)
  ," xls"  XLS ,                       \ MS-Excel 2.1
  ," xlsx" XLSX ,                      \ MS-Excel 2003
  ," html" HTML ,                      \ HTML 4.01 Transitional
  ," fods" FODS ,                      \ OpenOffice 2.3
  ," 4th"  4TH ,                       \ 4tH table
  ," json" JSON ,                      \ JSON ECMA-404
  ," ksp"  KSP ,                       \ KOffice 1.6
  NULL ,
does> 2 string-key row 0= ;

: (an--) 2drop ; : (--) ;              \ dummy commands for RUN mapping
                                       \ enumerate spreadsheet words
  0 enum openS                         \ open spreadsheet file
    enum sheetS                        \ create worksheet
    enum .S                            \ write a number
    enum typeS                         \ write a string
    enum crS                           \ start new row
    enum endS                          \ finish worksheet
    enum closeS                        \ close file
constant -o0o-                         \ ** end marker **

create run                             ( n --)
  ' XLSopen   , ' (an--)    , ' XLS.   , ' XLStype   , ' XLScr   , ' (--)    , ' XLSclose   ,
  ' XMLSopen  , ' XMLSsheet , ' XMLS.  , ' XMLStype  , ' XMLScr  , ' XMLSend , ' XMLSclose  ,
  ' HTMLopen  , ' (an--)    , ' HTML.  , ' HTMLtype  , ' HTMLcr  , ' (--)    , ' HTMLclose  ,
  ' KSPopen   , ' KSPsheet  , ' KSP.   , ' KSPtype   , ' KSPcr   , ' KSPend  , ' KSPclose   ,
  ' CREATopen , ' (an--)    , ' CREAT. , ' CREATtype , ' CREATcr , ' (--)    , ' CREATclose ,
  ' JSONopen  , ' (an--)    , ' JSON.  , ' JSONtype  , ' JSONcr  , ' (--)    , ' JSONclose  ,
  ' FODSopen  , ' FODSsheet , ' FODS.  , ' FODStype  , ' FODScr  , ' FODSend , ' FODSclose  ,
does> swap format -o0o- * + cells + @c execute ;

: isRF? error? over abs max-xls > or 0= ;
: >XLS 2dup number isRF? if .S run 2drop else drop -trailing typeS run then ;
: WriteLine dup 0 do delimiter parse-csv csv> >XLS loop crS run ;
: ReadLine refill mytib count nip /mytib 1- = abort" Line too long" ;
: ProcessFile begin ReadLine while WriteLine repeat ;
: CloseFiles drop endS run closeS run close ;
                                       \ determine the number of fields
: ScanFile                             ( -- n)
  ReadLine 0= abort" Read error"
  0 begin delimiter parse-csv while drop 1+ repeat drop 0 >in ! WriteLine
;
                                       \ get ASCII delimiter
: get-delimiter                        ( --)
  get-argument drop c@ to delimiter    \ use first character
;
                                       \ get ASCII code delimiter
: get-code                             ( --)
  get-argument number error? abort" Invalid ASCII code" to delimiter
;
                                       \ get spreadsheet format
: get-format                           ( --)
  get-argument format? abort" Unsupported format" cell+ @c to format 2drop
;

create options
  char d , ' get-delimiter ,
  char c , ' get-code ,
  char f , ' get-format ,
  NULL ,
                                       \ open all files
: OpenFiles                            ( -- h)
  options get-options option-index input over 1+ 1+ argn >
  abort" Usage: csv2xls -d delimiter -c code -f format csv-file xls-file"
  over arg-open swap 1+ args openS run abort" Can't open spreadsheet file"
  s" CSVtoXLS" sheetS run mytib /mytib source!
;                                      \ initialize large input buffer

: Convert OpenFiles ScanFile ProcessFile CloseFiles ;

Convert
