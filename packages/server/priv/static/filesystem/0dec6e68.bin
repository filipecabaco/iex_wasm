\ 4tH - PARSING DEMO - Copyright 2013 J.L. Bezemer
\ You can redistribute this file and/or modify it under
\ the terms of the GNU General Public License

include lib/parsing.4th

0 >in !

s| 123,,"123",""123"",""123,123"",123| tib place

char , "parse" ." [" type ." ]" cr
char , "parse" ." [" type ." ]" cr
char , "parse" ." [" type ." ]" cr
char , "parse" ." [" type ." ]" cr
char , "parse" ." [" type ." ]" cr
char , "parse" ." [" type ." ]" cr
depth .

0 >in !

s| 123,,"123","""123""","""123"",""123""",123| tib place

char , parse-csv ." [" type ." ]" cr
char , parse-csv ." [" type ." ]" cr
char , parse-csv ." [" type ." ]" cr
char , parse-csv ." [" type ." ]" cr
char , parse-csv ." [" type ." ]" cr
char , parse-csv ." [" type ." ]" cr
depth .

0 >in !

s| 123,,"123","\"123\"","\"123\",\"123\"",123| tib place

char , "parse\" ." [" type ." ]" cr
char , "parse\" ." [" type ." ]" cr
char , "parse\" ." [" type ." ]" cr
char , "parse\" ." [" type ." ]" cr
char , "parse\" ." [" type ." ]" cr
char , "parse\" ." [" type ." ]" cr
depth .