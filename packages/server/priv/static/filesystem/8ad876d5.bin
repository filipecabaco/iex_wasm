\ 4tH library - RAMDISK - Copyright 2011 J.L. Bezemer
\ You can redistribute this file and/or modify it under
\ the terms of the GNU General Public License

[UNDEFINED] ram.ls  [IF]
[UNDEFINED] n!      [IF] include lib/ncoding.4th [THEN]
[UNDEFINED] compare [IF] include lib/compare.4th [THEN]

64 constant /filename                  \ maximum length of filename

struct                                 \ disk keeping
  nell +field d.begins                 \ current start of free space
  nell +field d.ends                   \ absolute end of ram disk
  nell +field d.files                  \ maximum number of files
  nell +field d.current                \ current start of directory
end-struct /ram.disk

struct                                 \ file keeping
  /filename +field f.name              \ name of file
       nell +field f.start             \ start of file
       nell +field f.size              \ size of file
end-struct /ram.file

0 value ram.disk                       \ address of ram disk
                                       ( n -- a)
: (dir) /ram.file * /ram.disk + ram.disk + ;
                                       \ check if payload fits on disk
: (free?)                              ( n1 -- n1 ab ab' f)
  ram.disk -> d.begins n@              ( n1 ab)
  over chars over + dup                ( n1 ab ab' ab')
  ram.disk -> d.ends n@ <              ( n1 ab ab' f)
;
                                       \ "format" a ram disk
: ram.format                           ( a1 n1 n2 -- f)
  rot >r over over /ram.file * /ram.disk + tuck >
  if                                   \ space enough for everything?
    r@ + r@ -> d.begins  n!            \ calculate start of free space
         r@ -> d.files   n!            \ store maximum number of files
    0    r@ -> d.current n!            \ no files stored yet
    r@ + r@ -> d.ends    n!            \ calculate end of ram disk
    r> to ram.disk false               \ store address and return success
  else                                 \ if not enough room
    r> drop drop drop drop true        \ discard all values and return failure
  then
;
                                       \ does a file exist?
: ram.exists                           ( a1 n1 -- a1 n1 n2 f)
  ram.disk -> d.files n@ >r 0          \ set up all parameters
  begin
    dup r@ <                           \ less than max. number of files?
  while                                \ do filenames match?
    >r 2dup r@ (dir) -> f.name count compare r> swap
  while                                \ if so, exit
    1+                                 \ try next file
  repeat dup r> <                      \ all files checked then not found
;
                                       \ write a buffer to disk
: ram.write                            ( a1 n1 a2 n2 -- f)
  ram.exists nip 0=                    ( a1 n1 a2 n2 f)
  if                                   ( a2 n2 a1 n1)
    2swap (free?)                      ( a1 n1 a2 n2 ac an f)
    if                                 ( a1 n1 a2 n2 ac an)
      ram.disk >r                      ( a1 n1 a2 n2 ac an)
      r@  -> d.begins n!               ( a1 n1 a2 n2 ac)
      r@  -> d.current dup n@ dup      ( a1 n1 a2 n2 ac ad nf nf)
      r>  -> d.files n@ <              ( a1 n1 a2 n2 ac ad nf f)
      if                               ( a1 n1 a2 n2 ac ad nf)
        dup 1+ rot n!                  ( a1 n1 a2 n2 ac nf)
        (dir) >r swap                  ( a1 n1 a2 ac n2)
        over r@ -> f.start n!          ( a1 n1 a2 ac n2)
        dup  r@ -> f.size  n!          ( a1 n1 a2 ac n2)
        cmove                          ( a1 n1)
        r> -> f.name place false exit  ( -f)
      then drop                        ( a1 n1 a2 n2 ac ad)
    then drop drop                     ( a1 n1 a2 n2)
  then 2drop 2drop true                ( +f)
;
                                       \ find file and return buffer
: ram.read                             ( a1 n1 -- a2 n2 f)
  ram.exists dup >r                    \ does the file exist?
  if (dir) >r 2drop r@ -> f.start n@ r> -> f.size n@ then r> 0=
;                                      \ if so, return buffer
                                       \ print a directory
: ram.ls                               ( --)
  0 dup ram.disk -> d.current n@ over  \ for all current files
  ?do                                  \ get the filename
     i (dir) dup -> f.name count dup
     if                                \ if non-zero
       rot dup -> f.size n@ 10 .r ."  bytes "
       f.start n@ 10 .r space type cr 1+
     else                              \ otherwise skip it
       2drop drop >r 1+ r>
     then
  loop . ." file(s), " . ." deleted file(s)" cr
;
                                       \ remove a file
: ram.rm                               ( a n -- f)
  ram.exists dup >r                    \ if the file exists
  if pad 0 rot (dir) -> f.name place else drop then
  2drop r> 0=                          \ zero the filename
;
                                       \ calculate start of free space
: (#free)                              ( d.current n1 -- d.current n1 n2)
  over n@ dup                          \ if directory not empty
  if                                   \ calculate free space
    1- (dir) dup -> f.start n@ swap -> f.size n@
  else                                 \ otherwise default to empty disk
    drop ram.disk dup -> d.files n@ /ram.file * /ram.disk +
  then chars +
;
                                       \ move all files downwards
: (squeeze)                            ( d.current n1 -- d.current n1)
  dup (dir) -> f.size n@               \ calculate slack
  >r over over r> rot dup n@ 1- dup rot n! rot
  ?do                                  \ for all files above
     i dup (dir) >r 1+ (dir)           \ get addresses, update data
     dup  -> f.name  count  r@ -> f.name place
     dup  -> f.size  n@ dup r@ -> f.size n!
     swap -> f.start n@ >r over r@ swap - r> over
     r>   -> f.start n! swap rot cmove \ and move content
  loop drop
;
                                       \ reorganize a ram disk
: ram.pack                             ( --)
  ram.disk -> d.current 0              \ set up loop
  begin
     over n@ over >                    \ for all current files
  while                                \ check for non-zero filenames
    dup (dir) -> f.name count nip 0=
    if (squeeze) (#free) ram.disk -> d.begins n! then 1+
  repeat drop drop                     \ drop loop parameters
;
                                       \ append to the last file
: ram.append                           ( a n -- f)
  ram.disk dup -> d.current n@ dup     ( a n ad ac f)
  if                                   ( a n ad ac)
    1- (dir) >r over (free?)           ( a n ad n ab ab' f - r: af)
    if                                 ( a n ad n ab ab' - r: af)
      rot >r rot -> d.begins n!        ( a n ab - r: af n)
      swap cmove                       ( r: af n)
      r> r@ -> f.size n@ +             ( n' - r: af)
      r> -> f.size n! false exit       ( -f)
    else                               ( a n ad n ab ab' - r: af)
      r> drop                          ( a n ad n ab ab')
    then drop drop                     ( a n ad n)
  then drop drop 2drop true            ( +f)
;
                                       \ get disk parameters
: ram.du                               ( -- n1 n2)
  ram.disk                             \ get disk address
  dup -> d.files n@ over -> d.current n@ - swap
  dup -> d.ends  n@ swap -> d.begins  n@ -
;                                      \ calculate space free

[DEFINED] 4TH# [IF]
  hide /filename
  hide d.begins
  hide d.ends
  hide d.files
  hide d.current
  hide f.name
  hide f.start
  hide f.size
  hide ram.disk
  hide /ram.disk
  hide /ram.file
  hide (dir)
  hide (squeeze)
  hide (#free)
  hide (free?)
[THEN]
[THEN]
