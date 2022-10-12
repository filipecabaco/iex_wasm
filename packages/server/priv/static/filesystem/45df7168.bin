true [IF]
  include lib/ansfloat.4th
[ELSE]
  include lib/zenfloat.4th
  include lib/zenans.4th
[THEN]

include lib/fracout.4th

\ ------------------------------------

fclear

CR .( Testing... )

: R  -123456789 S>F -123456 S>F 10000000 S>F F/ F+ ;

: TEST1 ( -- )
  COMMAS  0 TO COMMAS CR
  -1 7 DO  CR  R I 0 F.R  -1 +LOOP
  TO COMMAS ;

: TEST2 ( -- )
  COMMAS  1 TO COMMAS  CR
  R  -3 7 DO
    CR  FDUP I 0 F.R  10 S>F F/
  -1 +LOOP  FDROP
  TO COMMAS ;

TEST1 TEST2 CR