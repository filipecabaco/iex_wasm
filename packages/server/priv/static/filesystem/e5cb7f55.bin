\ 4tH library - GETENV - Copyright 2005, 2012 J.L. Bezemer
\ You can redistribute this file and/or modify it under
\ the terms of the GNU General Public License

[UNDEFINED] GETENV [IF]
\ ============
\ Typical use:
\ ============
\     1024 constant /buffer
\     /buffer string buffer
\     s" HOME" buffer /buffer getenv
\     type cr
\ ======
\ Notes:
\ ======
\     - Does not work on MS-DOS
\     - Returns null string on error
\     - Note Win32 may echo the variable name

: |accept|                             ( a1 n1 a2 n2 -- a3 n3)
  cin >r source 2>r source!            \ save current input buffer
  input pipe + open error?             \ open pipe
  if dup xor dup                       \ if ok, return parsed string
  else dup use 0 refill if parse else dup then rot close 
  then 2r> source! r> use              \ clean up and restore input buffer
;

: (%win32%)                            \ Win32 version of getenv
  >r >r s" echo %" r@ place r@ +place s" %" r@ +place r@ count r> r> |accept|
  over c@ [char] % = if dup xor then   \ dirty check to see if it returned 
;                                      \ the variable name
                                       \ Unix version of getenv
: ($unix) >r >r s" echo $" r@ place r@ +place r@ count r> r> |accept| ;

s" echo" pad 32 |accept|               \ see if echo returns anything
if ' (%win32%) else ' ($unix) then alias getenv drop
                                       \ if so, it is Win32
[DEFINED] 4TH# [IF]
  hide (%win32%)                       \ hide both versions
  hide ($unix)                         \ just export getenv
[THEN]
[THEN]
