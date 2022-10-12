\ 4tH BrainFuck optimizing threaded compiler - Copyright 2004,2011 J.L. Bezemer
\ You can redistribute this file and/or modify it under
\ the terms of the GNU General Public License

include lib/row.4th
include lib/stack.4th
include lib/argopen.4th
                                       \ BF memory
30000 constant #BFMemory
#BFMemory string BFmemory
                                       \ BF threaded code
16000 constant #BFCode
#BFCode array BFCode
                                       \ control stack
256 constant #CStack
#CStack array CStack

10 constant EOL                        \ end of line character
2 +constant next                       \ next instruction

: >cs CStack >a ;                      \ put on control stack
: cs> CStack a> ;                      \ get from control stack
: csdepth CStack adepth ;              \ get control stack depth
: cell, over ! cell+ ;                 ( p n -- p+1)
: bf, cell, 1 cell, ;                  ( p n -- p+2)
: ?p>, over >cs bf, ;                  ( p n -- p+2)
                                       \ compile a backward jump
: <p,                                  ( p n -- p+2)
  cell, csdepth 0= abort" Unmatched [" \ check if stack is balanced
  cs> over over cell- cell- cell, >r >r cell- r> cell+ ! r>
;                                      \ resolve forward jump
                                       \ optimize similar instructions
: optimize                             ( p1 n -- p2)
  over BFCode >                        \ has something been compiled?
  if over cell- cell- @ over = if drop 1 over cell- +! exit then then bf,
;                                      \ if so, try to optimize it
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
: m++ over cell+ @ + ;                 \ increment memory pointer
: m-- over cell+ @ - ;                 \ decrement memory pointer
: >m char> over c! ;                   \ store input at memory pointer
: m> dup c@ emit ;                     \ emit content at memory pointer
: m@++ over cell+ @ over c@ + over c! ;
: m@-- over cell+ @ over c@ swap - over c! ;
: ?p> dup c@ 0= if swap cell+ @ swap then ;
: <p swap cell+ @ swap ;               \ while / repeat
: x drop drop drop abort ;             \ exit interpreter

create BFop
  char > , ' m++  , ' optimize ,
  char < , ' m--  , ' optimize ,
  char + , ' m@++ , ' optimize ,
  char - , ' m@-- , ' optimize ,
  char . , ' m>   , ' bf, ,
  char , , ' >m   , ' bf, ,
  char [ , ' ?p>  , ' ?p>, ,
  char ] , ' <p   , ' <p, ,
  NULL ,
                                       \ compile BF source
: CompileBF                            ( --)
  argn 2 <                             \ if no filename issued
  abort" Usage: bf sourcefile"         \ issue error message
  input 1 arg-open ['] x BFCode        \ open the input file
  begin                                ( h i p)
    pad dup 1 accept                   ( h i p a n)
  while                                ( h i p a)
    c@ BFop 3 num-key row rot drop     ( h i p n f)
    if                                 ( h i p n)
      cell+ dup @c                     ( h i p n+1 xt)
      swap cell+ @c execute            ( h i p)
      dup BFCode #BFCode 1- cells + > abort" File too big"
    else                               ( h i p n)
      drop                             ( h i p)
    then                               ( h i p)
  repeat                               ( h i p)
  drop ! close                         \ close file
  csdepth abort" Unmatched ]"          ( --)
;
                                       \ run interpreter
: ExecBF                               ( --)
  BFMemory #BFMemory erase             \ clear memory
  tib BFCode BFMemory                  \ setup pointers
  begin over @ execute swap next swap again
;

: BF CStack stack CompileBF ExecBF ;

BF 
