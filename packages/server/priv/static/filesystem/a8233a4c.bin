\ 4tH library - Database system - Copyright 2016, 2020 J.L. Bezemer
\ You can redistribute this file and/or modify it under
\ the terms of the GNU General Public License

\ dbs.insert                           ( --)
\ dbs.delete                           ( --)
\ dbs.update                           ( --)
\ dbs.release                          ( -- f)
\ dbs.binder                           ( xt -- xt)
\ xt                                   ( a --)

[UNDEFINED] dbs.bind [IF]
[UNDEFINED] idx.init [IF] include lib/dbmidx.4th [THEN]
                                       \ create DBS aliases for DB words
aka db.key dbs.key
aka db.error dbs.error
aka db.rowid dbs.rowid
aka db.rsize dbs.rsize
aka db.used dbs.used
aka db.table dbs.table
aka db.buffer dbs.buffer
aka db.message dbs.message
aka db.close dbs.close
aka db.declare dbs.declare
aka db.next dbs.next
aka db.goto dbs.goto
aka db.first dbs.first
aka db.clear dbs.clear
aka db.create dbs.create
aka db.use dbs.use
                                       \ create index binder
#table array (binder) does> swap cells + ;
                                       ( -- x x+n)
: ('idx) dbs.table (binder) @ dup >r cell+ r> @ cells over + ;
: (index!) ('idx) swap ?do i @ over execute loop drop ;

: dbs.find                             ( n1 a2 n2  -- ix f)
  rot ('idx) >r                        ( a2 n2 n1 x1 r: x2)
  begin                                \ end of indexes reached?
    dup r@ <                           \ if not, continue
  while                                \ if field holds index, use it
    over over @ idx.field =            \ otherwise do full table scan
    if r> drop @ >r drop r@ idx.find r> swap exit then cell+
  repeat r> drop drop -rot dbs.first db.find N/A dbs.error 0=
;                                      \ otherwise use normal routine
                                       \ bind indexes to table
: dbs.bind                             ( n1 ni i -- f)
  dup 1+ cells allocate dup >r         \ allocate i+1 cells
  if                                   \ if allocation is unsuccessful
    drop 0 ?do drop loop               \ drop all the indexes
  else                                 \ if successful
    dup dbs.table (binder) !           \ init all indexes
    over over ! cell+ swap bounds ?do i ! loop
  then r>                              \ retrieve flag
;
                                       \ standard dml commands
: dbs.delete db.delete ['] idx.delete (index!) ;
: dbs.insert db.insert [: idx.insert drop ;] (index!) ;
: dbs.update db.update [: idx.update drop ;] (index!) ;
: dbs.binder dbs.used 0 ?do i (binder) @ over execute loop ;
: dbs.release false [: free rot or swap ;] dbs.binder drop ;
: dbs.unbind (binder) @ free ;         ( n -- f)

[DEFINED] 4TH# [IF]
  hide (binder)
  hide ('idx)
  hide (index!)
[THEN]
[THEN]
