\ 4tH library - FASIN FACOS FATAN - Copyright 2008,2012 J.L. Bezemer
\ You can redistribute this file and/or modify it under
\ the terms of the GNU General Public License

[UNDEFINED] fasin   [IF]
[UNDEFINED] pi      [IF] include lib/fpconst.4th [THEN]
[UNDEFINED] +taylor [IF] include lib/taylor.4th  [THEN]

: 2degrees 1+ 1+ dup -taylor 1+ 1+ dup +taylor ;
: (taylor) 1 2degrees 2degrees 2degrees 2degrees 2degrees drop fdrop fdrop ;
: (fatan) fdup >taylor (taylor) ;
: dom2 1 s>f fover fdup f* fover f+ fsqrt f+ f/ (fatan) fdup f+ ;
: dom3 1 s>f fswap f/ pi f2/ fover f0< if fnegate then fswap dom2 f- ;
: dom2|3 1 s>f fover fabs f< if dom3 else dom2 then ;
: fatan 1 s>f f2/ f2/ fover fabs f< if dom2|3 else (fatan) then ;
: (fasin) 1 s>f fover fdup f* fover fswap f- fsqrt f+ f/ fatan fdup f+ ;
: fasin fdup fabs 1 s>f f= if pi f2/ f* else (fasin) then ;
: facos fasin pi f2/ fswap f- ;

[DEFINED] 4TH# [IF]
  hide 2degrees
  hide (taylor)
  hide (fatan)
  hide (fasin)
  hide dom3
  hide dom2
  hide dom2|3
[THEN]
[THEN]
