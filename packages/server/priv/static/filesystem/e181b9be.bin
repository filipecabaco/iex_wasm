( Code derived from the X3J14 dpANS-6 document, June 30, 1993)

[needs lib/enter.4th]

: could-fail       ( -- n)
  enter dup 0=
  if 1 throw then
;

: do-it            ( --)
  drop drop could-fail
;

: try-it           ( --)
  1 2 ['] do-it catch
  if drop drop ." There was an exception" cr
  else ." The number was" . cr
  then
;

: retry-it         ( --)
  begin
    1 2 ['] do-it catch
  while
    drop drop ." Exception, keep trying" cr
  repeat
  ." The number was " . cr
;

retry-it
