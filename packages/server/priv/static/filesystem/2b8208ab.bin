\ 4tH - Haystack - Copyright 2012 J.L. Bezemer
\ You can redistribute this file and/or modify it under
\ the terms of the GNU General Public License

\ Find the index of a string (needle) in an indexable, ordered collection of
\ strings (haystack). Raise an exception if the needle is missing. If there
\ is more than one occurrence then return the smallest index to the needle.

include lib/row.4th

create haystack
  ," Zig"  ," Zag" ," Wally" ," Ronald" ," Bush" ," Krusty" ," Charlie"
  ," Bush" ," Boz" ," Zag" NULL ,
does>
  dup >r 1 string-key row 2>r type 2r> ."  is "
  if r> - ." at " . else r> drop drop ." not found" then cr
;

s" Washington" haystack s" Bush" haystack