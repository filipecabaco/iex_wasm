\ 4tH library - CONVERT - Copyright 2010 J.L. Bezemer
\ You can redistribute this file and/or modify it under
\ the terms of the GNU General Public License

\ [a] Since 4tH supports both a single and a double number version of >NUMBER,
\ the required definition cannot be loaded automatically. Thus, the programmer
\ has to load the required version *before* including this file. If >NUMBER is
\ not available, compilation is aborted.

\ [b] CONVERT works with counted strings. For that reason COUNT is chosen
\ instead of the RfD LEGACY wordset definition "CHAR+ 65536". It also means
\ that CONVERT can only be used with properly terminated string variables.

\ [c] CONVERT conflicts with the CONVERT.4TH template. However, this legacy
\ definition should *never* be used for new programs. Its use is restricted to
\ the conversion of legacy programs.

[UNDEFINED] convert [IF]
[UNDEFINED] >number [IF] [ABORT] [THEN]
: convert count >number drop ;
[THEN]
