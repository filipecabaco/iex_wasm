\ 4tH library - INI file manager - Copyright 2016, 2020 J.L. Bezemer
\ You can redistribute this file and/or modify it under
\ the terms of the GNU General Public License

[UNDEFINED] begin.inifile [IF]
[UNDEFINED] l.destroy     [IF] include lib/leaf.4th    [THEN]
[UNDEFINED] callocate     [IF] include lib/memchar.4th [THEN]
[UNDEFINED] compare       [IF] include lib/compare.4th [THEN]
[UNDEFINED] E.LIBERR      [IF] include lib/throw.4th   [THEN]

variable (iniroot)                     \ root of all leaves
                                       \ initialize the root
: begin.inifile NULL (iniroot) ! ;     ( --)
                                       \ create a new section
: section.inifile                      ( a n --)
  NULL -rot dup 1+ callocate E.LIBERR throw" Cannot allocate section"
  dup >r place r> (iniroot) l.append   \ add section
;
                                       \ allocate keypair strings
: (allockeypair)                       ( a1 n1 a2 n2 -- a3 a4)
  dup 1+ callocate E.LIBERR throw" Cannot allocate key"   dup >r place
  dup 1+ callocate E.LIBERR throw" Cannot allocate value" dup >r place r> r>
;
                                       \ free a keypair
: (freekeypair)                        ( leaf -- leaf)
  dup l.key cfree E.LIBERR throw" Cannot free key"
  dup l.get cfree E.LIBERR throw" Cannot free value"
;
                                       \ create a new keypair in last section
: keypair.inifile                      ( a1 n1 a2 n2 --)
  dup 0> if                            \ if key length > 0
    (allockeypair) (iniroot) l.last dup (iniroot) =
    if dup NULL dup rot l.append @ then l.value l.append
  else                                 \ add keypair to current section
    2drop 2drop                        \ drop keypair if key length is zero
  then
;
                                       ( --)
: (getsection) 1 >in +! [char] ] parse section.inifile ;
: (getkeypair) [char] = parse 0 parse 2swap keypair.inifile ;
                                       \ get the first character
: (firstchar)                          ( c --)
  dup [char] [ = if                    \ sections begin with a [
    drop (getsection)                  \ drop character and get section
  else                                 \ ignore comments
    dup [char] # = swap [char] ; = or 0= if (getkeypair) then
  then                                 \ no section or comment? It is a key
;
                                       \ read an entire ini-file
: get.inifile                          ( a n -- f)
  input open error? if drop true exit then dup use
  begin.inifile begin                  \ cannot open file, abort
    refill                             \ get the next line
  while                                \ get the first character
    bl omit >in @ >r 0 parse r> >in !  \ and evaluate it, restore string
    0> if c@ (firstchar) else drop then
  repeat close false                   \ drop table address and close file
;
                                       \ write an ini-file
: put.inifile                          ( a n -- f)
  output open error? if drop true exit then dup use
  (iniroot) begin                      \ start at the root
    @ dup NULL <>                      \ is there another section?
  while                                \ if there is, write section
    dup l.key error? if drop else ." [" count type ." ]" cr then
    dup l.value begin                  \ begin with root of section
      @ dup NULL <>                    \ is there another keypair?
    while                              \ if there is, write keypair
      dup l.key count type ." =" dup l.get count type cr l.link
    repeat drop l.link                 \ get next section
  repeat drop close false              \ close the file, signal ok
;
                                       \ free strings of keypair
: (freekeypairs)                       ( link -- link)
  dup begin @ dup NULL <> while (freekeypair) l.link repeat drop
;
                                       \ destroy an entire ini-file
: destroy.inifile                      ( --)
  (iniroot) dup                        \ start at the root
  begin
    @ dup NULL <>                      \ is there another section?
  while                                \ if so, free the section string
    dup l.key error? 
    if drop else cfree E.LIBERR throw" Cannot free section" then
    dup l.value (freekeypairs) l.destroy l.link
  repeat drop l.destroy                \ free all keypairs and
;                                      \ destroy the entire chain
                                       \ find a string key in a chain
: (findbefore)                         ( a n link1 -- link2)
  begin
    dup @ NULL <>                      \ is there another leaf?
  while                                \ if so, compare the string stored
    >r 2dup r@ @ l.key count compare r> swap
  while                                \ if it isn't equal, get the next leaf
    @ l.link
  repeat nip nip                       \ return true if not found
;
                                       ( a n link -- leaf f)
: (findstring) (findbefore) @ dup NULL = ;
                                       \ find a key in a section
: (findkey)                            ( a1 n1 a2 n2 -- leaf f)
  (iniroot) (findstring) if 2drop true else l.value (findstring) then
;                                      \ order is: key, section
                                       ( a1 n1 a2 n2 -- a3 n3)
: value.inifile (findkey) if 0 else l.get count then ;
                                       \ order is: value, key, section
: set.inifile                          ( a1 n1 a2 n2 a3 n3 -- f)
  (findkey) dup >r if                  \ find the key, section
    drop 2drop                         \ if not found, drop the leaf + value
  else                                 \ if found, free original key
    dup >r l.get cfree E.LIBERR throw" Cannot free value"
    dup 1+ callocate E.LIBERR throw" Cannot allocate value" dup >r place
    r> r> l.put
  then r>                              \ allocate the new one and assign it
;
                                       \ add a keypair to a named section
: addkeypair.inifile                   ( a1 n1 a2 n2 a3 n3 -- f)
  (iniroot) (findstring) dup >r if     \ find the section
    drop 2drop 2drop                   \ not found, drop leaf and strings
  else                                 \ otherwise, allocate strings and
    >r (allockeypair) r> l.value l.append
  then r>                              \ append the leaf
;
                                       \ delete a key in section
: delkeypair.inifile                   ( a1 n1 a2 n2 -- f)
  (iniroot) (findstring) if            \ find the section
    drop 2drop true                    \ drop the link and the string
  else                                 \ section doesn't exist, so exit
    l.value (findbefore)               \ now search the keys
    dup @ NULL = if                    \ we've reached the end of the line
      drop true                        \ so drop the link and exit
    else                               \ if we found the key
      dup @ (freekeypair) dup l.next   \ we free the keypair and entry
      swap free E.LIBERR throw" Cannot free key/value" swap ! false
    then                               \ relink the next entry
  then
;

[DEFINED] 4TH# [IF]
  hide (iniroot)
  hide (allockeypair)
  hide (getsection)
  hide (getkeypair)
  hide (firstchar)
  hide (freekeypair)
  hide (freekeypairs)
  hide (findbefore)
  hide (findstring)
  hide (findkey)
[THEN]
[THEN]
