\ 4tH library - XLS writer - Copyright 2004,2010 J.L. Bezemer
\ You can redistribute this file and/or modify it under
\ the terms of the GNU General Public License

\ Note: Only one XLS file can be open at the time.
\       That is why no handle is returned.
\       You HAVE to close the file using XLSclose!
\       This format may not be supported by other
\       spreadsheet applications (e.g. KOffice, OOo 2.x).

[UNDEFINED] XLStype [IF]
\ private declarations
variable XLSrow                        \ Excel row number    (starts at zero)
variable XLScol                        \ Excel column number (starts at zero)

file XLS                               \ file descriptor for XLS file

255   constant  8bit                   \  8 bit mask
65535 constant 16bit                   \ 16 bit mask
638   constant XLS_RK                  \ Excel code for RK number
516   constant XLS_STR                 \ Excel code for string
                                       \ this writes a 16bit unsigned number
: .XLSshort dup 8bit and emit 8 rshift 8bit and emit ;
: .XLSzero  0 dup emit emit ;          \ this writes a 16bit zero
                                       \ this writes a BIFF record
: .BIFF                                ( n1 n2 --)
   XLS use .XLSshort .XLSshort XLSrow @ .XLSshort XLScol @ .XLSshort .XLSzero
   1 XLScol +!                         \ move to next column
;
                                       \ this writes a signed 30bit RK number
: .RK                                  ( n --)
  dup abs 2 lshift swap 0< if negate then 2 or
  dup 16bit and .XLSshort 16 rshift 16bit and .XLSshort
;                                      \ break down RK number (little endian)

\ XLS equivalents of CR, AT-XY, . and TYPE
: XLScr 0 XLScol ! 1 XLSrow +! ;       ( --)
: XLSatxy XLScol ! XLSrow ! ;          ( row col --)
: XLS. 10 XLS_RK .BIFF .RK ;           ( n --)
: XLStype dup 8 + XLS_STR .BIFF dup .XLSshort type ;
                                       ( a n --)
\ This opens a file as XLS file
: XLSopen                              ( a n -- f)
  output open dup to XLS error? dup >r
  if                                   \ open file, if not successful
    drop                               \ drop handle
  else                                 \ else use it
    use 0 dup XLSrow ! XLScol !        \ init variables
    2057 .XLSshort 8 .XLSshort .XLSzero 16 .XLSshort .XLSzero .XLSzero
  then r>
;

\ This closes the XLS file
: XLSclose                             ( --)
  XLS dup use                          \ use XLS and write footer
  125 .XLSshort 11 .XLSshort 3 .XLSshort 4 .XLSshort
  25600 .XLSshort .XLSzero .XLSzero 2560 .XLSshort .XLSzero
  0 emit close                         \ close the file
;

[DEFINED] 4TH# [IF]
hide 8bit
hide 16bit
hide XLS_STR
hide XLS_RK
hide XLSrow
hide XLScol
hide XLS
hide .XLSshort
hide .XLSzero
hide .RK
hide .BIFF
[THEN]
[THEN]

\ A small example
\ s" msxls4th.xls" XLSopen 0= if s" Label3" XLStype s" Label4" XLStype XLScr
\ 1 XLS. 2 XLS. 3 XLS. XLScr 4 XLS. 5 XLS. 6 XLS. XLSclose then
