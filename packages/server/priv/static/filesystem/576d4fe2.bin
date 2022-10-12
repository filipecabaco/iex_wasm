\ 4tH BrainFuck threaded compiler - Copyright 2004, 2011 J.L. Bezemer
\ You can redistribute this file and/or modify it under
\ the terms of the GNU General Public License

include lib/row.4th
include lib/argopen.4th
                                       \ BF memory
30000 constant #BFMemory
#BFMemory string BFmemory
                                       \ BF threaded code
16000 constant #BFCode
#BFCode array BFCode

10 constant EOL                        \ end of line character
0 value rp                             \ level for jumps
                                       \ get character from TIB
: char>                                ( t p m -- t p m c)
  >r >r dup tib =                      \ save pointers, if start buffer
  if refill else true then             \ then refill the buffer
  if                                   \ if read is successful
    dup c@ dup 0=                      \ get character, if end of string
    if EOL + nip tib swap              \ return LF and signal end of buffer
    else swap char+ swap               \ else increment pointer
    then
  else 0                               \ else return NULL
  then r> r> rot                       \ restore pointers and rotate char
;
                                       \ BF instructions
: m++ char+ ;                          \ increment memory pointer
: m-- char- ;                          \ decrement memory pointer
: >m char> over c! ;                   \ store input at memory pointer
: m> dup c@ emit ;                     \ emit content at memory pointer
: m@++ dup c@ 1+ over c! ;             \ increment contents at mem pointer
: m@-- dup c@ 1- over c! ;             \ decrement contents at mem pointer
: ?p> swap cell+ over c@ 0= if @ then swap ;  
: <p swap cell+ @ swap ;               \ while / repeat
: x drop drop drop abort ;             \ exit interpreter

create BFop
  char > , ' m++ ,
  char < , ' m-- ,
  char + , ' m@++ ,
  char - , ' m@-- ,
  char . , ' m> ,
  char , , ' >m ,
  char [ , ' ?p> ,
  char ] , ' <p ,
  NULL ,
                                       \ compile BF source
: CompileBF                            ( --)
  argn 2 <                             \ if no filename issued
  abort" Usage: bf sourcefile"         \ issue error message
  input 1 arg-open                     \ open the input file
  ['] x BFCode rp@ to rp               ( h i p)
  begin                                ( h i p)
    pad dup 1 accept                   ( h i p a n)
  while                                ( h i p a)
    c@ BFop 2 num-key row              ( h i p c n f)
    if                                 ( h i p c n)
      cell+ @c rot tuck ! swap         ( h i p c)
      dup [char] [ =                   ( h i p c f)
      if over >r >r cell+ r> then      ( h i p c)
      [char] ] =                       ( h i p f)
      if                               ( h i p)
        cell+ dup dup                  ( h i p p p)
        rp rp@ = abort" Unmatched ["   ( h i p p p)
        r> dup cell- rot !             ( h i p p p')
        cell+ !                        ( h i p)
      then                             ( h i p)
      cell+ dup BFCode #BFCode cells + = abort" File too big"
    else                               ( h i p c n)
      drop drop                        ( h i p)
    then                               ( h i p)
  repeat                               ( h i p)
  drop ! close                         \ close file
  rp rp@ <> abort" Unmatched ]"        ( --)
;
                                       \ run interpreter
: ExecBF                               ( --)
  BFMemory #BFMemory erase             \ clear memory
  tib BFCode BFMemory                  \ setup pointers
  begin over @ execute swap cell+ swap again
;                                      \ execute program

: BF CompileBF ExecBF ;

BF
