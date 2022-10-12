\ Copyright 2001, Kristopher D. Johnson
\ Copyright 2007, Hans Bezemer, 4tH version
\ CLOCK 

: .clock ( seconds. -- )
  cr
  <# [char] ) hold #s [char] ( hold #>
  type cr ;
  
: clock ( secsOld. -- secsNew.)
  time
  dup rot ( new. new. old. )
  <> if dup .clock then ;

: clock-loop ( -- )
  0 begin clock pause again ;

clock-loop