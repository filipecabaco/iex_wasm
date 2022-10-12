true [IF]
  include lib/ansfloat.4th
[ELSE]
  include lib/zenfloat.4th
  include lib/zenans.4th
[THEN]

include lib/expout.4th

\ ------------------------------------

fclear

CR .( Testing... )

: R  -123456789 S>F -123456 S>F 10000000 S>F F/ F+ ;

: TEST1 ( -- )
  CR
  -1 7 DO  CR  R I 0 FE.R  -1 +LOOP
  ;

: TEST2 ( -- )
  CR
  R  -3 7 DO
    CR  FDUP I 0 FE.R  10 S>F F/
  -1 +LOOP  FDROP
  ;

: TEST3 ( -- )
  CR
  -1 7 DO  CR  R I 0 FS.R  -1 +LOOP
  ;

: TEST4 ( -- )
  CR
  R  -3 7 DO
    CR  FDUP I 0 FS.R  10 S>F F/
  -1 +LOOP  FDROP
  ;

test1 cr
test2 cr
test3 cr
test4 cr