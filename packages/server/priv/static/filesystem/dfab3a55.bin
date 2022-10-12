\ 4tH - INI file manager demo - Copyright 2017 J.L. Bezemer
\ You can redistribute this file and/or modify it under
\ the terms of the GNU General Public License

include lib/inimanag.4th               \ load the .INI manager

s" myfile.ini" sconstant inifile       \ string constant of filename
                                       \ show contents of inifile
: show-inifile                         ( a n --)
  input open error? abort" Cannot open .INI file"
  dup use begin refill while 0 parse type cr repeat cr close
;                                      \ read all lines and type them

begin.inifile                          \ open a new .INI file
  s" Compiler" section.inifile         \ add a section
  s" 4tH" s" Name" keypair.inifile     \ add a key and value
  s" 3.62.5" s" Version" keypair.inifile
  s" Forth" s" Language" keypair.inifile
                                       \ add a few more keys
  s" Platform" section.inifile         \ add another section
  s" Linux" s" Name" keypair.inifile   \ add a key and value
  s" 4.1" s" Version" keypair.inifile  \ add some more keys
  s" Architecture" s" x86_64" keypair.inifile
                                       \ add a key to a named section
  s" J.L. Bezemer" s" Author" s" Compiler" addkeypair.inifile
  abort" Cannot add key to section"    \ error if section doesn't exist
                                       \ now write it to disk
inifile put.inifile abort" Cannot write .INI file" 
destroy.inifile                        \ and remove it from memory

inifile show-inifile                   \ show its contents
                                       \ now read it in again
inifile get.inifile abort" Cannot read .INI file"
                                       \ get the value for a key and print it
  s" Author" s" Compiler" value.inifile type cr cr
                                       \ modify the value of a section/key
  s" Hans Bezemer" s" Author" s" Compiler" set.inifile
  abort" Cannot modify key in named section"
                                       \ remove a section/key
  s" Version" s" Platform" delkeypair.inifile
  abort" Cannot delete key from named section"
                                       \ now wite it out again
inifile put.inifile abort" Cannot write .INI file"
destroy.inifile                        \ and remove it from memory

inifile show-inifile                   \ show its contents and remove it
inifile delete-file abort" Cannot delete .INI file"
