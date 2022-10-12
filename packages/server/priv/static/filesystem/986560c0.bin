\ 4tH BrainFuck interpreter - Copyright 2004,2009 J.L. Bezemer
\ You can redistribute this file and/or modify it under
\ the terms of the GNU General Public License

include lib/row.4th
include lib/argopen.4th
                                       \ BF memory
30000 constant #BFMemory
#BFMemory string BFmemory
                                       \ BF source
8192 constant #BFSource
#BFSource string BFSource

10 constant EOL                        \ end of line character
variable level                         \ level for jumps
defer next                             \ jump program counter instruction
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

: m@ dup c@ ;                          \ fetch memory contents
: m! over c! ;                         \ store memory contents 
: m++ char+ ;                          \ increment memory pointer
: m-- char- ;                          \ decrement memory pointer
: >m char> m! ;                        \ store input at memory pointer
: m> m@ emit ;                         \ emit content at memory pointer
: m@++ m@ 1+ m! ;                      \ increment contents at mem pointer
: m@-- m@ 1- m! ;                      \ decrement contents at mem pointer

: p@ over c@ ;                         \ fetch program instruction
: p++ swap char+ swap ;                \ increment program pointer
: p-- swap char- swap ;                \ decrement program pointer

: level-- = if -1 level +! then ;      \ increment level if equal
: level++ = if  1 level +! then ;      \ decrement level if equal
                                       \ jump to location
: jump                                 ( p m c1 c2 xt -- p' m)
  is next                              ( p m c1 c2)
  >r rot swap                          ( m p c1)
  begin                                ( m p c1)
    p@ dup r@ level--                  ( m p c1 p@)
    over level++                       ( m p c1)
    level @                            ( m p c1 n)
  while                                ( m p c1)
    next                               ( m p' c1)
  repeat                               ( m p' c1)
  r> drop drop swap                    ( p' m)
;
                                       \ BF jump instructions
: <p [char] ] [char] [ ['] p-- jump p-- ; 
: ?p> m@ 0= if [char] [ [char] ] ['] p++ jump then ;
                                       \ BF operators table
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
                                       \ read BF source
: ReadBF                               ( --)
  argn 2 <                             \ if no filename issued
  abort" Usage: bfi sourcefile"        \ issue error message 
  input 1 arg-open                     \ open the input file
  BFSource #BFSource                   \ setup source buffer
  over over erase accept               \ read sourcefile
  #BFSource = abort" File too large"   \ check size
  close                                \ close file
;
                                       \ initialize interpreter
: InitBF                               ( -- a1 a2 a3)
  0 level !                            \ reset level
  BFMemory #BFMemory erase             \ clear memory
  tib BFSource BFMemory                \ setup parameters
;
                                       \ run interpreter
: ExecBF                               ( a1 a2 a3 --)
  p@                                   \ get operator 
  begin                                \ begin
    BFop 2 num-key row                 \ find operator; if found execute
    if nip cell+ @c execute else drop drop then
    p++ p@ dup 0=                      \ increment program counter
  until                                \ until end-of-code marker
  drop drop drop drop                  \ drop pointers
;

: BF ReadBF InitBF ExecBF ;

BF
