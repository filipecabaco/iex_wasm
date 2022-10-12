\ 4tH library - Database management - Copyright 2011,2016 J.L. Bezemer
\ You can redistribute this file and/or modify it under
\ the terms of the GNU General Public License

[UNDEFINED] db.key  [IF]
[UNDEFINED] n@      [IF] include lib/ncoding.4th [THEN]
[UNDEFINED] compare [IF] include lib/compare.4th [THEN]
[UNDEFINED] #table  [IF] 16 constant #table      [THEN]

 0 constant db.key                     \ declare key with db.find
-1 constant N/A                        \ "Not applicable"

struct
  nell +field (bufadr)                 \ address of the buffer
  nell +field (bufsiz)                 \ size of the buffer
  nell +field (rowid)                  \ last used rowid
   255 +field (fname)                  \ related database file
end-struct /table                      \ dictionary entry
                                       \ calculate address of entry
#table /table * string (dictionary) does> swap /table * + ;

  0 value db.error                     \ last error
  0 value db.rowid                     \ current row
  0 value db.rsize                     \ size of current table
  0 value db.used                      \ no. of dictionary entries used
N/A value db.table                     \ current table
N/A value db.buffer                    \ current buffer

N/A value (handle)                     \ current file handle

create db.message                      \ print a database error message
  ," System failure"                   \ All 4tH signals
  ," No errors"                        \ No errors
  ," Dictionary full"                  \ No more dictionary entries left
  ," I/O error"                        \ Some I/O error occurred
  ," Bad table"                        \ No such entry in the dictionary
  ," End of file"                      \ End of database file reached
                                       ( n1 -- a1 n2)
does> swap -1 max 1+ cells + @c count ;

  0 enum EDB.NOERRS                    \ No errors
    enum EDB.DICTFULL                  \ Dictionary full
    enum EDB.IOERR                     \ I/O error
    enum EDB.BADTABLE                  \ Bad table
constant EDB.EOF                       \ End of file

: (raise) swap if dup to db.error throw else drop then ;
: (random) (handle) seek EDB.IOERR (raise) ;
: (seek) db.rowid db.rsize * (random) ;
: (write) db.buffer db.rsize type ;
: (update) (seek) (write) ;
: (insert) (error) (random) (write) (handle) tell db.rsize / 1- to db.rowid ;
: (delete) db.buffer db.rsize 255 fill (update) ;
                                       \ perform an I/O operation
: (io)                                 ( xt --)
  cin >r cout >r                       \ save current streams
  (handle) dup 0< if drop drop else use catch to db.error then
  r> use r> use                        \ perform action and
;                                      \ restore previous streams
                                       \ read next row
: (read)                               ( --)
  begin
    db.rsize db.buffer over accept dup \ fill buffer
    0= EDB.EOF (raise) <> EDB.IOERR (raise) db.buffer c@ 255 =
  while                                \ was the record deleted?
    db.rowid 1+ to db.rowid            \ read next undeleted record
  repeat
;

: (next) (read) db.rowid 1+ to db.rowid ;
: (goto) (seek) (read) ;               \ goto a random record

: db.close                             \ close the current table
  db.rowid db.table dup 0<             \ current open table valid?
  if drop drop else (dictionary) -> (rowid) n! then 
  (handle) dup 0< if drop else close then
  N/A dup to (handle) to db.table      \ close file, make not current
;                                      \ and do not open another
                                       \ use a database file
: (use)                                ( n --)
  dup 0< EDB.BADTABLE (raise) dup db.used >= EDB.BADTABLE (raise) >r db.close
  r@ (dictionary) -> (fname) count output input + open
  error? EDB.IOERR (raise) to (handle)
  r@ (dictionary) -> (bufsiz) n@ to db.rsize
  r@ (dictionary) -> (bufadr) n@ to db.buffer
  r> to db.table                       \ make table current
;
                                       \ declare a database table
: (declare)                            ( a1 n1 a2 n2 -- n3)
  db.used dup >r #table >=  EDB.DICTFULL (raise)
  r@ (dictionary) -> (fname) place
  r@ (dictionary) -> (bufsiz) n!
  r@ (dictionary) -> (bufadr) n!
  0 r@ (dictionary) -> (rowid) n! r>   \ return the declared table id
;
                                       \ declare a database table
: db.declare                           ( a1 n1 a2 n2 -- n3)
  ['] (declare) catch if 2drop 2drop N/A else db.used 1+ to db.used then
;                                      \ exception: clear values, return N/A

: db.next ['] (next) (io) ;            \ sequential access
: db.goto to db.rowid ['] (goto) (io) ;
: db.update ['] (update) (io) ;        \ update current record
: db.delete ['] (delete) (io) ;        \ delete current record
: db.insert ['] (insert) (io) ;        \ insert current record
: db.first 0 db.goto ;                 \ goto first record
: db.clear db.buffer db.rsize erase 0 dup to db.error to db.rowid ;
                                       \ create a database file
: db.create output open error?         ( a n --)
  if drop EDB.IOERR else close EDB.NOERRS then to db.error
;
                                       \ reopen a database file
: db.use                               ( n --)
  ['] (use) catch
  if drop else db.table (dictionary) -> (rowid) n@ db.goto then
;

: db.find                              ( n1 a2 n2 --)
  2>r db.buffer +                      \ calculate buffer address
  begin dup count 2r@ compare while db.next db.error until
  drop 2r> 2drop                       \ drop all temporary values
;

[DEFINED] 4TH# [IF]
  hide /table
  hide (bufadr)
  hide (bufsiz)
  hide (rowid)
  hide (fname)
  hide (dictionary)
  hide (handle)
  hide (raise)
  hide (random)
  hide (seek)
  hide (write)
  hide (update)
  hide (insert)
  hide (delete)
  hide (io)
  hide (read)
  hide (next)
  hide (goto)
  hide (use)
  hide (declare)
[THEN]
[THEN]
