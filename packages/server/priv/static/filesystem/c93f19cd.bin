\ Quotations - Forth 2012 Compliance Tests 

include lib/locals.4th
include lib/anstools.4th
include lib/ttester.4th

T{ : q1 [: 1 ;] ;  q1 execute => 1 }T 
T{ : q2 [: [: 2 ;] ;] ;  q2 execute execute => 2 }T 
T{ : q3 1 locals [: 2 locals :b @ :a @ end-locals ;] end-locals ;  1 2 3 q3 execute => 2 1 }T 
T{ : q4 [: dup if dup 1- recurse then ;] ;  3 q4 execute .s => 3 2 1 0 }T 

