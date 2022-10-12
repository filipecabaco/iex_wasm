( Copyright 1995,2003 - HanSoft & Partners - 4th I/O demonstration )

[needs lib/enter.4th]

: select_base decimal ." Select base : " enter dup base ! ;
: get_number ." Input number: " enter ;

: show_base                            ( shows base without affecting base )
  dup
  decimal
  [char] [ emit 0 .r [char] ] emit space
  base !
;

: show_number                          ( shows conversion output )
  rot
  show_base
  swap dup . ." => " swap
  show_base .
;

: convert                              ( converts a number )
  cr
  select_base
  get_number
  select_base
  cr
  show_number
  cr
;

convert cr
