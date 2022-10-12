\ 4tH library - i18n Internationalization - Copyright 2021 J.L. Bezemer
\ You can redistribute this file and/or modify it under
\ the terms of the GNU General Public License

[UNDEFINED] i18n.support [IF]
[UNDEFINED] substitute   [IF]
  include lib/substit.4th
[THEN]

0 constant i18n.default                \ default language constant

0 value i18n.lang                      \ currently selected language
0 value i18n.status                    \ error of last number of replaces
0 value (i18n.scope)                   \ array of supported languages
0 value (i18n.width)                   \ number of supported languages

[UNDEFINED] i18n.msglen [IF]
  256 constant i18n.msglen             \ length of internal buffer
[THEN]

i18n.msglen string (i18n.buffer)       \ internal substitute buffer

aka replaces i18n.set                  \ an alias for REPLACES
aka substitute.clear i18n.reset        \ an alias for SUBSTITUTE.CLEAR
                                       \ is this language supported?
: i18n.support                         ( a1 n1 -- idx f)
  2 < if >zero dup ;then               \ too short: NO!
  0 dup (i18n.width) over ?do          \ try all supported languages
    drop drop dup c@ (i18n.scope) i th @c c@ =
    over char+ c@ (i18n.scope) i th @c char+ c@ = and
    i over if leave then               \ if both characters match, yes
  loop rot drop swap                   \ otherwise, no..
;
                                       \ select preferred language
: i18n.select                          ( a1 n1 -- idx f)
  begin                                \ nothing to check, that's it!
    [char] : split dup                 ( a1 n1 a2 n2 f)
  while                                \ exit when support has been found
    i18n.support dup                   ( a1 n1 idx f f)
  except                               \ otherwise: clean up, chop delimiter
    drop drop dup if chop then         \ drop the string and cleanup
  repeat 2nip tuck unless >zero then swap
;                                      \ if not found, set to default language
                                       ( n1 a2 n2 --)
: i18n.let 2>r dup abs <# #s sign #> 2r> i18n.set ;
: i18n.languages to (i18n.width) to (i18n.scope) substitute.init ;
                                       \ set variables and initialize
: i18n.msg                             ( n1 -- a2 n2)
  i18n.lang th @c count (i18n.buffer) i18n.msglen substitute to i18n.status
;                                      \ compose i18n message

[DEFINED] 4TH# [IF]
  hide (i18n.scope)
  hide (i18n.width)
  hide (i18n.buffer)
[THEN]
[THEN]

