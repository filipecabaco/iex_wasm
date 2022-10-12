\ 4tH library - ACCEPT-WORD - Copyright 2009 J.L. Bezemer
\ You can redistribute this file and/or modify it under
\ the terms of the GNU General Public License

[UNDEFINED] accept-word [IF]
0 enum _EOF_ enum _EOL_ constant _EOW_
                                       \ define flags
: accept-word                          ( c -- a1 n1 ior) 
  >r tib dup                           \ save delimiter, use TIB
  begin                                \ begin loop
    _EOF_ over 1 accept dup            \ save flag, get character
  while                                \ stop if we didn't get any
    drop 1+ over c@ dup                \ update flag, fetch character
    dup 10 <> swap 13 <> and           \ check whether we're on EOL
  while                                \ stop if we are
    swap 1+ swap dup r@ <>             \ check if we read the terminator
  while                                \ stop if we did
    bl >= nip if char+ then            \ increase pointer
  repeat                               \ read next character
  r> drop drop >r over - r>            \ calculate length word, restore flag
;
[THEN]
