include lib/enter.4th
include lib/easter.4th

: PROMPT                               ( ask for parameters )
  ." Enter year: " enter
  easterSunday swap rot 
  ." Easter will take place on "
  2 .r [char] / emit 1 .r [char] / emit . cr

;

prompt
