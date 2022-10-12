\ 4tH library - 4tH CREATE writer - Copyright 2015 J.L. Bezemer
\ You can redistribute this file and/or modify it under
\ the terms of the GNU General Public License

\ Note: Only one CREATE file can be open at the time.
\       That is why no handle is returned.
\       You HAVE to close the file using CREATEclose!

[UNDEFINED] CREATtype [IF]
[UNDEFINED] 2over     [IF] include lib/anscore.4th  [THEN]
[UNDEFINED] -leading  [IF] include lib/leading.4th  [THEN]
[UNDEFINED] break?    [IF] include lib/breakq.4th   [THEN]

file CREAT                             \ file descriptor for CREATE file

: >CREAT CREAT use ;                   ( --)

: (.string)                            ( a n --)
  [char] " false 2over bounds break?
  if ." ,| " type [char] | else .| ," | type [char] " then emit
;
                                       \ print a cell
: CREATtype                            ( a n --)
  >CREAT -leading -trailing            \ strip leading and trailing spaces
  dup if                               \ is not a NULL string
    space 2dup number error? nip if (.string) else type .|  ,| then
  else                                 \ type the string
    2drop .|  ,""|                     \ otherwise a null string
  then                                 \ close the tag
;

aka CREATtype CREAT#                   \ These are equivalent
                                       \ CREATE equivalents of CR, . and TYPE
: CREATcr cr space ;                   ( --)
: CREAT. <# #s #> CREAT# ;             ( n --)
                                       \ close a CREATE file
: CREATclose
  CREAT dup use .|  NULL ,| cr close
;
                                       \ This opens a file as CREATE file
: CREATopen                            ( a n -- f)
  2dup output open dup to CREAT error? dup >r
  if                                   \ open file, if not successful
    drop 2drop                         \ discard parameters
  else                                 \ else use it
    use .| create | type CREATcr
  then r>
;

[DEFINED] 4TH# [IF]
  hide CREAT
  hide >CREAT
  hide (.string)
[THEN]
[THEN]

\ A small example
\ s" CREATE4th.4th" CREATopen 0= if
\ s| "Label1"| CREATtype s| "Label2"| CREATtype CREATcr 34 CREAT. 4500 CREAT. CREATcr
\ s" Label3" CREATtype s" Label4" CREATtype CREATcr 1 CREAT.
\ 2 CREAT. CREATcr 4 CREAT. 5 CREAT. CREATclose then depth .
