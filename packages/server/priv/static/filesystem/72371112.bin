\ 4tH library - MS-DOS TIME&DATE - Copyright 2021 J.L. Bezemer
\ You can redistribute this file and/or modify it under
\ the terms of the GNU General Public License

\ Int 21/AX=5700h - DOS 2+ - GET FILE'S LAST-WRITTEN DATE AND TIME

\ Parameter:
\ BX = file handle

\ Return:
\ CX = file's time
\ DX = file's date

\ ** NOT VALID BEFORE 1980-1-1 **

[UNDEFINED] time>dos [IF]
: time>dos 11 lshift swap 5 lshift or swap 2/ or ;
: date>dos 1980 - 9 lshift swap 1+ 5 lshift or or ;
: dos>time dup 31 and 2* over 5 rshift 63 and rot 11 rshift ;
: dos>date dup 31 and over 5 rshift 15 and 1- rot 9 rshift 1980 + ;
[THEN]

