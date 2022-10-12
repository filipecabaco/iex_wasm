\ 4tH library - Spreadsheet writer - Copyright 2013, 2015 J.L. Bezemer
\ You can redistribute this file and/or modify it under
\ the terms of the GNU General Public License

[UNDEFINED] TKformat [IF]
[UNDEFINED] CSVopen  [IF] include lib/csv-w.4th    [THEN]
[UNDEFINED] HTMLopen [IF] include lib/html-w.4th   [THEN]
[UNDEFINED] XLSopen  [IF] include lib/msxls2-w.4th [THEN]
[UNDEFINED] XMLSopen [IF] include lib/msxmls-w.4th [THEN]
[UNDEFINED] KSPopen  [IF] include lib/koksp-w.4th  [THEN]
[UNDEFINED] FODSopen [IF] include lib/oofods-w.4th [THEN]

defer TKcr                             \ sheet go to next row
defer TKatxy                           \ sheet go to X,Y
defer TKtype                           \ sheet print string
defer TK#                              \ sheet print preformatted number
defer TK.                              \ sheet print number
defer TKsheet                          \ sheet open new worksheet
defer TKend                            \ sheet close worksheet
defer TKopen                           \ sheet open file for writing
defer TKclose                          \ sheet close file

9 constant /TKcmd                      \ total number of commands supported

  0 enum CSV!                          \ set CSV format
    enum XLS!                          \ set XLS v2.1 format
    enum XML!                          \ set XML 2003 format
    enum KSP!                          \ set Koffice v1.6 format
    enum HTML!                         \ set HTML 4.01 Transitional format
constant FODS!                         \ set OpenOffice 2.0 format

: TKdummy ;                            \ ignore unsupported features
: TKdummy2 2drop ;                     \ clear stack as well
                                       \ set spreadsheet format
create TKformat                        ( n -- n)
  ' CSVcr  , ' TKdummy2  , ' CSVtype  , ' CSV#     , 
  ' CSV.   , ' TKdummy2  , ' TKdummy  , ' CSVopen  , ' CSVclose  ,

  ' XLScr  , ' XLSatxy   , ' XLStype  , ' TKdummy2 ,
  ' XLS.   , ' TKdummy2  , ' TKdummy  , ' XLSopen  , ' XLSclose  ,

  ' XMLScr , ' TKdummy2  , ' XMLStype , ' XMLS#    ,
  ' XMLS.  , ' XMLSsheet , ' XMLSend  , ' XMLSopen , ' XMLSclose ,

  ' KSPcr  , ' KSPatxy   , ' KSPtype  , ' KSP#     ,
  ' KSP.   , ' KSPsheet  , ' KSPend   , ' KSPopen  , ' KSPclose  ,

  ' HTMLcr , ' TKdummy2  , ' HTMLtype , ' HTML#    ,
  ' HTML.  , ' TKdummy2  , ' TKdummy  , ' HTMLopen , ' HTMLclose  ,

  ' FODScr , ' TKdummy2  , ' FODStype , ' FODS#    ,
  ' FODS.  , ' FODSsheet , ' FODSend  , ' FODSopen , ' FODSclose ,
does>                                  \ get address of row
  over /TKcmd * cells +                \ set all DEFERs
     dup @c is TKcr  1+ dup @c is TKatxy 1+ dup @c is TKtype
  1+ dup @c is TK#   1+ dup @c is TK.    1+ dup @c is TKsheet
  1+ dup @c is TKend 1+ dup @c is TKopen 1+     @c is TKclose
;

[DEFINED] 4TH# [IF]
  hide /TKcmd
  hide TKdummy
  hide TKdummy2
[THEN]
[THEN]
