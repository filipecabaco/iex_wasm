\ 4tH library - JSON writer - Copyright 2015 J.L. Bezemer
\ You can redistribute this file and/or modify it under
\ the terms of the GNU General Public License

\ Note: Only one JSON file can be open at the time.
\       That is why no handle is returned.
\       You HAVE to close the file using JSONclose!

[UNDEFINED] JSONtype [IF]
[UNDEFINED] -leading [IF] include lib/leading.4th [THEN]

file JSON                              \ file descriptor for JSON file
variable (fmt)                         \ controls issuing , and [
                                       \ add comma's and opening brackets
: ,JSON
  (fmt) @ dup 2 and if ." ," then cr 1 and if ."   [" cr 2 (fmt) ! then
;

: (JSON!) JSON use ,JSON 4 spaces ;    ( --)
: JSONcr JSON use (fmt) @ 2 = if cr else ,JSON then ."   ]" 3 (fmt) ! ;
: JSON# (JSON!) type ;                 ( a n --)
: JSON. <# #s #> JSON# ;               ( n --)
: JSONclose JSON dup use (fmt) @ 2 = if cr ."   ]" then cr ." ]" cr close ;
                                       \ print a string
: JSONtype                             ( a n --)
  (JSON!) .| "| -leading -trailing bounds ?do
    i c@ dup [char] " = over [char] \ = or if [char] \ emit then emit
  loop .| "|                           \ inside quotes, take care of special
;                                      \ characters
                                      \ This opens a file as JSON file
: JSONopen                             ( a n -- f)
  output open dup to JSON error?
  dup >r if drop else use ." [" 1 (fmt) ! then r>
;

[DEFINED] 4TH# [IF]
  hide JSON
  hide ,JSON
  hide (JSON!)
  hide (fmt)
[THEN]
[THEN]

\ A small example
\ s" JSON4th.jsn" JSONopen 0= if
\ s" Label1" JSONtype s" \Label2\" JSONtype JSONcr 34 JSON. 4500 JSON. JSONcr
\ s" Label3" JSONtype s" Label4" JSONtype JSONcr 1 JSON.
\ 2 JSON. JSONcr 4 JSON. 5 JSON.
\ JSONclose then depth .
