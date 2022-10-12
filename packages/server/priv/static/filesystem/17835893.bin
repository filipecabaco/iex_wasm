\ 4tH library - FILES - Copyright 2006,2015 J.L. Bezemer
\ You can redistribute this file and/or modify it under
\ the terms of the GNU General Public License

[UNDEFINED] exist? [IF]                ( a n -- f)
: exist? input open error? tuck if drop else close then 0= ;
: used? cin >r cout >r [: use ;] catch r> r> use use 0= ;
                                       \ size of a file
: size                                 ( a n1 -- n2)
  input open error?                    ( h f)
  if drop (error)                      ( err)
  else (error) over seek if (error) else dup tell then swap close
  then                                 ( n)
;
[THEN]
