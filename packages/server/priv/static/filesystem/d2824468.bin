\ 4tH library - Key/value leaves - Copyright 2015, 2020 J.L. Bezemer
\ You can redistribute this file and/or modify it under
\ the terms of the GNU General Public License

[UNDEFINED] l.new    [IF]
[UNDEFINED] allocate [IF] include lib/memcell.4th  [THEN]
[UNDEFINED] NULL     [IF] include lib/constant.4th [THEN]
[UNDEFINED] E.LIBERR [IF] include lib/throw.4th    [THEN]
\ include lib/anstools.4th
                                       \ (lnk) MUST BE first field!
struct                                 \ structure of a key/value pair
  field: (lnk)                         \ link to the next key/value pair
  field: (key)                         \ the key
  field: (val)                         \ the value
end-struct (/leaf)                     \ size of a leaf structure

aka (lnk) l.link                       ( leaf -- link)
aka (val) l.value                      ( leaf -- value)
                                       ( -- leaf)
: l.new (/leaf) allocate E.LIBERR throw" Cannot create key/value" ;
: l.next -> (lnk) @ ;                  ( leaf1 -- leaf2)
: l.key -> (key) @ ;                   ( leaf -- key)
: l.get -> (val) @ ;                   ( leaf -- value)
: l.put -> (val) ! ;                   ( value leaf --)
: l.last begin dup @ NULL <> while @ l.link repeat ;
                                       ( link1 -- link2|leaf)
: l.append                             ( value key link --)
  l.new >r l.last r@ swap ! r@ -> (key) ! r@ l.put NULL r> l.link !
;                                      \ find the last entry and append
                                       \ destroy chain from link onwards
: l.destroy                            ( link --)
  NULL over                            \ prepare NULL value, copy link
  begin
    @ dup NULL <>                      \ if it doesn't end here, continue
  while                                \ get next leaf and destroy this one
    dup l.link swap free E.LIBERR throw" Cannot free key/value"
  repeat drop swap !                   \ set original pointer to NULL
;
                                       \ find the link pointing to key leaf
: l.before                             ( key link1 -- link2)
  begin dup @ NULL <> while over over @ l.key <> while @ l.link repeat nip
;
                                       \ find a key, true if found
: l.find l.before @ dup NULL <> ;      ( key link -- leaf f)
                                       \ delete a key, true if not found
: l.delete                             ( key link -- f)
  l.before dup @ NULL = dup >r
  if drop 
  else dup @ dup l.next rot ! free E.LIBERR throw" Cannot free key/value"
  then r>
;                                      \ insert a leaf at this link
                                       ( value key link --)
: l.insert dup >r @ l.new dup >r l.link ! r@ -> (key) ! r@ l.put r> r> ! ;

[DEFINED] 4TH# [IF]
  hide (key)
  hide (val)
  hide (lnk)
  hide (/leaf)
[THEN]
[THEN]
