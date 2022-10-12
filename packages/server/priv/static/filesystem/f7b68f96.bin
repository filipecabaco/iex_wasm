\ 4tH library - Database index - Copyright 2015, 2017 J.L. Bezemer
\ You can redistribute this file and/or modify it under
\ the terms of the GNU General Public License

[UNDEFINED] idx.init [IF]
[UNDEFINED] db.error [IF] include lib/dbm.4th      [THEN]
[UNDEFINED] allocate [IF] include lib/memcell.4th  [THEN]
[UNDEFINED] bsearch  [IF] include lib/bsearch.4th  [THEN]

aka free idx.close

' compare constant {char}              ( a1 n1 a2 n2 -- -1|0|1)
:token {cell} number >r number r> over over < negate -rot > + ;

256 string (content)                   \ temporary buffer for field value
  0 value  (field)                     \ temp. address of current field
    defer  (compare)                   \ temp. execution token comparison

create idx.message                     \ print a database error message
  ," No errors"                        \ No errors
  ," Index full"                       \ No more index entries left
  ," I/O error"                        \ Some I/O error occurred
  ," Bad index"                        \ Corrupt index
  ," At first record"                  \ At first record
  ," At last record"                   \ End of index reached
does> swap cells + @c count ;          ( n1 -- a1 n2)
                                       \ error codes
  0 enum EIDX.NOERRS                   \ No errors
    enum EIDX.IDXFULL                  \ Index full
    enum EIDX.IOERR                    \ I/O error
    enum EIDX.BADIDX                   \ Bad index
    enum EIDX.FIRST                    \ At first record
constant EIDX.LAST                     \ At last record

struct                                 \ index structure
  field: (isiz)                        \ total size of netto index in memory
  field: (icmp)                        \ comparison execution token
  field: (ilen)                        \ current length of index in memory
  field: (irow)                        \ current index record
  field: (ierr)                        \ last error of this index
  field: (ikey)                        \ offset of indexed key in database
end-struct (ihead)
                                       \ create index and initialize
: idx.init                             ( n xt a -- ix f)
  rot dup cells (ihead) + allocate dup ( xt a n ix f f)
  if                                   \ if allocation failed
    2>r drop drop drop 2r>             \ signal failure
  else                                 \ otherwise initialize index
    >r >r r@ -> (isiz) ! r@ -> (ikey) ! r@ -> (icmp) ! 0 dup dup
    r@ -> (ilen) ! r@ -> (irow) ! r@ -> (ierr) ! r> r>
  then                                 \ return address and flag
;

[DEFINED] sort [IF]                    \ rebuild an index
: idx.rebuild                          ( ix --)
  dup >r (ihead) + dup dup r@ -> (isiz) @ cells + >r db.first
  begin                                \ still room and no errors?
    dup r@ < db.error 0= and
  while                                \ get rowid and save it, next record
    db.rowid over ! cell+ db.next
  repeat                               \ calculate number of cells read
  r> drop swap - 1 cells / r@ -> (ilen) !
  db.error EDB.EOF = if EIDX.NOERRS else EIDX.IDXFULL then r> -> (ierr) !
;                                      \ figure out the current index status
                                       \ sort an index
: idx.sort                             ( ix --)
  ['] precedes defer@ >r               \ save current execution semantics
  [: db.goto (field) count (content) place
     db.goto (field) count (content) count (compare) 0<
  ;] is precedes                       \ set new execution semantics
  dup -> (icmp) @ is (compare)         \ set comparison semantics
  db.buffer over -> (ikey) @ + to (field)
  dup (ihead) + swap -> (ilen) @ sort r> is precedes
;                                      \ get addresses and sort
                                       ( n xt a -- ix f)
: idx.create idx.init dup 0= if over idx.rebuild over idx.sort then ;
[THEN]
                                       \ extend index with n cells
: idx.extend                           ( n ix1 -- ix2 f)
  over over -> (isiz) @ + cells (ihead) + resize >r swap r@
  if drop else over -> (isiz) +! then r>
;                                      \ try to resize, return index
                                       \ fill buffer with current index id
: idx.current                          ( ix --)
  dup -> (ilen) @ over -> (irow) @ dup rot <
  if dup 0< if EIDX.FIRST else cells (ihead) + + @ db.goto exit then
  else EIDX.LAST
  then rot -> (ierr) ! drop
;
                                       ( ix n --)
: idx.goto over -> (irow) ! idx.current ;
: idx.first 0 idx.goto ;               ( ix --)
: idx.last dup -> (ilen) @ 1- idx.goto ;
: idx.move over -> (irow) +! idx.current ;
: idx.next 1 idx.move ;                ( ix --)
: idx.previous -1 idx.move ;           ( ix --)
: idx.error -> (ierr) @ ;              ( ix -- n)
: idx.size -> (isiz) @ ;               ( ix -- n)
: idx.used -> (ilen) @ ;               ( ix -- n)
: idx.field -> (ikey) @ ;              ( ix -- n)
: idx.here -> (irow) @ ;               ( ix -- n)
: idx.key idx.field db.buffer + ;      ( ix -- a)
: idx.clear EIDX.NOERRS swap -> (ierr) ! ;
: (?,) @ 0 .r [char] , emit ;          ( x --)
: (?cr) @ 0 .r cr ;                    ( x --)
: (number?) [char] , parse number dup 0< ;
                                       \ delete a record by rowid
: idx.delete                           ( ix --)
  dup -> (ilen) @ over (ihead) + over 0 ?do
    dup i th @ db.rowid =              \ index equals current rowid?
    if                                 \ if so, delete it by moving
      i th swap i 1+ - dup if over cell+ -rot smove else drop drop then
      -1 swap -> (ilen) +! unloop exit \ the rest of the index
    then                               \ probably a corrupted index
  loop drop drop EIDX.BADIDX swap -> (ierr) !
;
                                       \ sync index with current rowid
: idx.follow                           ( ix -- )
  dup (ihead) + over -> (ilen) @ 0 ?do
    dup i th @ db.rowid = if drop i swap -> (irow) ! unloop exit then
  loop drop EIDX.BADIDX swap -> (ierr) !
;
                                       \ low level find 
: (find)                               ( a1 n1 ix -- ix n2 f)
  ['] b-compare defer@ >r ['] get-key defer@ >r
  [: swap cells + @ db.goto (field) ;] is get-key
  [: >r count r> count (compare) ;] is b-compare
  >r r@ -> (icmp) @ is (compare) db.buffer r@ -> (ikey) @ + to (field)
  (content) place r@ (content) over (ihead) + r> -> (ilen) @ bsearch
  r> is get-key r> is b-compare        \ perform a binary search
;                                      \ reset semantics
                                       \ -1 = nearest, 0 = found, 1 = EOF
: idx.search                           ( a1 n1 ix -- -1|0|1)
  (find) if                            \ perform a low level (find)
    idx.goto 0 else over -> (ilen) @ over >
    if idx.goto -1 else drop drop 1 then
  then                                 \ if "insert location" inside index
;                                      \ then go there
                                       ( a1 n1 ix -- f)
: idx.find (find) dup >r if idx.goto else drop drop then r> ;
                                       \ insert a record
: idx.insert                           ( ix -- f)
  dup -> (ilen) @ over -> (isiz) @ =   \ room in index?
  if                                   \ if not, set error and abort
    EIDX.IDXFULL swap -> (ierr) ! (error)
  else                                 \ otherwise find the record
    db.rowid >r db.buffer over -> (ikey) @ + count rot
    (find) r@ db.goto >r over -> (ilen) @ over >
    if                                 \ if inside index, make room
      over -> (ilen) @ over - >r over (ihead) + over cells +
      dup cell+ r> smove
    then                               \ save rowid and increment size
    cells over (ihead) + + r> r> rot ! 1 rot -> (ilen) +!
  then                                 \ return the "found" flag
;
                                       ( ix -- f)
: idx.update dup idx.delete idx.insert ;
                                       \ save index to disk
: idx.save                             ( ix a n --)
  cout >r output open error?           ( ix h f)
  if                                   \ save message on error
    drop EIDX.IOERR swap -> (ierr) !
  else                                 \ otherwise, punch out header
    dup use over -> (isiz) (?,) over -> (ikey) (?,)
    over -> (ilen) dup (?cr) @ cells rot (ihead) + swap bounds
    ?do i (?cr) 1 cells +loop close    \ punch out entire index
  then r> use                          \ and close the file
;
                                       \ reload entire index
: (reload)                             ( h ix -- h ix n)
  dup -> (isiz) @ cells over + (ihead) + >r dup (ihead) +
  begin                                ( h ix ix-body r: ix-top)
    refill                             \ get the next line
  while                                \ if successful
    dup r@ <                           \ check limit
  while                                \ if successful
    (number?) 0= >r over ! r>          \ save index value
  while                                \ if a positive number
    cell+                              \ move to next cell
  repeat                               \ until some kind of error occurs
  r> drop over (ihead) + -             \ leave size ( h ix n)
;
                                       \ load a saved index
: idx.load                             ( xt a n -- ix f)
  cin >r input open error?             ( xt h f)
  if                                   \ cannot open index file?
    drop                               \ drop handle and signal error
  else                                 \ if file successfully opened?
    dup use refill                     \ read the first line
    if                                 \ if first line is read, get header
      (number?) (number?) rot or       ( xt h n1 n2 f)
      if                               \ if one is a negative number
        drop drop                      \ drop both, close file and abort
      else                             \ if both are positive numbers
        >r rot r> idx.init             \ initialise the index ( h ix f)
        if                             \ when an error occurs ( h ix)
          swap                         \ close the file and signal error
        else                           \ otherwise read next number
          (number?)                    ( h ix n f)
          if                           \ if not a positive number
            drop                       \ close the index and abort
          else                         \ if not, save the current size
            over -> (ilen) ! (reload)  ( h ix n)
            over -> (ilen) @ = if swap close false r> use exit then
          then idx.close swap          \ if size is as expected, then return
        then                           \ otherwise drop index and signal error
      then
    then close                         \ close the file
  then true r> use                     \ some error occurred
;

[DEFINED] 4TH# [IF]
  hide (content)
  hide (field)
  hide (compare)
  hide (isiz)
  hide (icmp)
  hide (ilen)
  hide (irow)
  hide (ierr)
  hide (ikey)
  hide (ihead)
  hide (find)
  hide (?,)
  hide (?cr)
  hide (number?)
  hide (reload)
[THEN]
[THEN]
