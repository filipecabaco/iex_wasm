\ 4tH library - INTERPRET - Copyright 2003,2011 J.L. Bezemer
\ You can redistribute this file and/or modify it under
\ the terms of the GNU General Public License

\ Note: remove [UNDEFINED] interpret [IF] .. [THEN]
\       when compiling under ANS-Forth!!
[UNDEFINED] interpret [IF]

\ Load ROW when needed
[UNDEFINED] row [IF]
[NEEDS lib/row.4th]
[THEN]

\ Define ABORT routine, simply print offending word
defer NotFound
:noname type [char] ? emit space ; is NotFound

\ Define dictionary
(error) value dictionary
                                       \ this routine interprets a string
: interpret                            ( --)
  begin                                ( --)
    bl parse-word dup                  ( a n f)
  while
    dictionary 2 string-key row        ( a n x f)
    if                                 ( a n x)
      nip nip cell+ @c execute         ( --)
    else                               ( a n)
[DEFINED] ignorenumbers [IF]           \ Default don't ignore numbers
      drop NotFound                    ( --)
[ELSE]                                 \ Default don't ignore numbers
[DEFINED] >float [IF]
      drop 2dup >float                 ( a n fm fe f)
      if 2swap 2drop else NotFound then
[ELSE]
      drop 2dup number error?          ( a n n2 f)
      if drop NotFound else -rot 2drop then
[THEN]                                 ( --)
[THEN]
    then
  repeat                               ( --)
  drop drop                            ( --)
;
[THEN]
