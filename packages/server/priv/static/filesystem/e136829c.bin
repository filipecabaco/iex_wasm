\ 4tH library - HTML writer - Copyright 2013 J.L. Bezemer
\ You can redistribute this file and/or modify it under
\ the terms of the GNU General Public License

\ Note: Only one HTML file can be open at the time.
\       That is why no handle is returned.
\       You HAVE to close the file using HTMLclose!

[UNDEFINED] HTMLtype     [IF]
[UNDEFINED] forcerawutf8 [IF] include lib/utf8type.4th [THEN]
[UNDEFINED] -leading     [IF] include lib/leading.4th  [THEN]

file HTML                              \ file descriptor for HTML file

: >HTML HTML use ;                     ( --)
                                       \ print a cell
: (.HTML)                              ( a1 n1 a2 n2 --)
  >HTML .| <td align="| type .| ">|    \ align according to data type
  -leading -trailing                   \ strip leading and trailing spaces
  dup if                               \ is not a NULL string
    [DEFINED] forcerawutf8 [IF] type [ELSE] utf8type [THEN]
  else                                 \ type the string
    2drop ." &nbsp;"                   \ otherwise a space
  then .| </td>| cr                    \ close the tag
;
                                       \ HTML equivalents of CR, . and TYPE
: HTMLcr >HTML .| </tr>| cr  .| <tr>| cr ;
: HTMLtype s" left" (.HTML) ;          ( a n --)
: HTML# s" right" (.HTML) ;            ( a n --)
: HTML. <# #s #> HTML# ;               ( n --)
                                       \ close a .HTML file
: HTMLclose
  HTML dup use .| </tr></table>| cr .| </body>| cr .| </html>| cr close
;
                                       \ This opens a file as HTML file
: HTMLopen                             ( a n -- f)
  2dup output open dup to HTML error? dup >r
  if                                   \ open file, if not successful
    drop 2drop                         \ discard parameters
  else                                 \ else use it
    use .| <!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">| cr
    .| <html>| cr
    .| <head><title>| 2dup type .| </title>| cr
[UNDEFINED] forcerawutf8 [IF]
    .| <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />| cr
[THEN]
    .| <style type="text/css" media="screen">| cr
    .|   BODY {| cr
    .|     margin-left: 25px;| cr
    .|     margin-right: 25px;| cr
    .|     margin-top: 25px;| cr
    .|     margin-bottom: 25px;| cr
    .|     background-color:#ffffff;| cr
    .|   }| cr
    .|   TABLE, TD, TH {| cr
    .|     border:1px solid black;| cr
    .|     border-collapse:collapse;| cr
    .|   }| cr .| </style>| cr .| </head>| cr .| <body>| cr
    .| <table summary="| type .| "><tr>| cr
  then r>
;

[DEFINED] 4TH# [IF]
  hide HTML
  hide >HTML
  hide (.HTML)
[THEN]
[THEN]

\ A small example
\ s" HTML4th.html" HTMLopen 0= if
\ s" Label1" HTMLtype s" Label2" HTMLtype HTMLcr 34 HTML. 4500 HTML. HTMLcr
\ s" Label3" HTMLtype s" Label4" HTMLtype HTMLcr 1 HTML.
\ 2 HTML. HTMLcr 4 HTML. 5 HTML. HTMLclose then depth .
