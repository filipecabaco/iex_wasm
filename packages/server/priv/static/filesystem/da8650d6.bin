\ 4tH - Rename files - Copyright 2010,2012 J.L. Bezemer
\ You can redistribute this file and/or modify it under
\ the terms of the GNU General Public License

\ This utility normalizes filenames. Handy if you want to rename a whole
\ bunch of MS-Windows or MS-DOS files or those MP3 files that come with
\ embedded spaces. Requires a POSIX environment, e.g. MinGW.

[pragma] casesensitive

include lib/translat.4th
include lib/ansren.4th
include lib/yesorno.4th
include lib/compare.4th

256 constant /filename
/filename string filename

: "type" [char] " emit type [char] " emit ;

: ?rename                              ( a1 n1 a2 n2 f --)
  if                                   \ if filenames differ
    ." Renaming " 2dup "type" 2swap ."  to " 2dup "type" cr rename-file
    abort" Renaming failed"            \ try to rename the file
  else                                 \ if they're the same
    ." Skipping " "type" cr 2drop      \ skip it
  then
;

: rename                               ( --)
  0 parse 2dup filename place          \ parse the name
  s" ABCDEFGHIJKLMNOPQRSTUVWXYZ " s" abcdefghijklmnopqrstuvwxyz_" translate
  2dup filename count 2dup 2>r compare 2r> rot ?rename
;                                      \ compare names and rename if different

: rename-all                           ( --)
  s" ls" input pipe + open error? abort" Cannot open pipe" dup use
  begin refill while rename repeat close ." Done.." cr
;                                      \ rename the files accordingly

: rename-files                         ( --)
  s" All files in this directory will be renamed. Continue" yes/no?
  if rename-all else ." Aborting.." cr then
;                                      \ get confirmation or abort

rename-files
