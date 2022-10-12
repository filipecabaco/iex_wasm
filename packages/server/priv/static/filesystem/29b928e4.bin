\ 4tH library - TIMER - Copyright 2003,2004 J.L. Bezemer
\ You can redistribute this file and/or modify it under
\ the terms of the GNU General Public License

[UNDEFINED] timer-stop [IF]
defer timer-stop

\ default word if user did not define his own
:noname . ." seconds " ; is timer-stop

\ these words expect a clean stack when called
\ call this word at the very beginning
: timer-reset time ;

\ call this word at the very end
: .elapsed time swap - timer-stop ;
[THEN]
