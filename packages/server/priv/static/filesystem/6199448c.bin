\ Copyright 2005, 2012 J.L. Bezemer
\ You can redistribute this file and/or modify it under
\ the terms of the GNU General Public License

64 constant rmargin

include lib/choose.4th
include lib/print.4th

: ., <# [char] , hold #s #> print ;
: println print nl ;
: tab bl show ;
: payload bounds do i c@ 32 - ., 256 160 - choose ., loop ;

: hidehtml
  s" <script type='text/javascript'>" println
  s" function nospam () {" println
  tab s" var mail = new Array (" print payload s" -1);" println cr
  tab s" for (x = 0; mail [x] != -1; x += 2)" println
  tab s" document.write (String.fromCharCode (mail [x] += 32 ));" println
  s" }" println
  s" </script>" println
;

[DEFINED] 4TH# [IF]
argn 2 < abort" Usage: hidehtml [string]"
1 args hidehtml
[THEN]
