\ 4tH library - RENAME-FILE - Copyright 2010 J.L. Bezemer
\ You can redistribute this file and/or modify it under
\ the terms of the GNU General Public License

[UNDEFINED] rename-file [IF]
4096 constant /buffer
/buffer buffer: buffer

: copy-file                            ( a1 n1 a2 n2 -- f)
  cin >r cout >r 2swap input open error? dup >r
  if                                   \ open input file
    drop 2drop                         \ drop handle and filename on error
  else                                 \ if successful open output file
    -rot output open error? dup r> or >r
    if                                 \ if not successful
      drop                             \ drop the handle
    else                               \ if successful
      over over use use                \ use both files and copy contents
      begin buffer dup /buffer accept tuck type /buffer < until close
    then close                         \ close the file
  then r> r> r> use use                \ reset channels, return flag
;

: rename-file                          ( a1 n1 a2 n2 -- f)
  2>r 2dup 2r> copy-file dup >r        \ first copy the file
  if 2drop r> else delete-file r> or then
;                                      \ if ok, delete original file
[DEFINED] 4TH# [IF]
  hide buffer
  hide /buffer
[THEN]
[THEN]