\ 4tH library - Constants - Copyright 2006,2017 J.L. Bezemer
\ You can redistribute this file and/or modify it under
\ the terms of the GNU General Public License

[UNDEFINED] 10K [IF]
10000 constant 10K                     ( scaling constant )
[THEN]

[UNDEFINED] unit-bits [IF]
char-bits /char / constant unit-bits   ( bits per unit )
[THEN]

[UNDEFINED] cell-bits [IF]
unit-bits /cell * constant cell-bits   ( bits per cell )
[THEN]

[UNDEFINED] highbit [IF]
(error) constant highbit               ( highbit in cell) 
[THEN]

[UNDEFINED] lowbits [IF]
max-n constant lowbits                 ( lowbits in cell)
[THEN]

[UNDEFINED] NULL [IF]
(error) constant NULL                  ( NULL pointer)
[THEN]

[UNDEFINED] +UL [IF]                   ( cast for unsigned 32 bits numbers)
[hex] 7fffffff 1+ +constant +UL [decimal]
[THEN]

/cell 8 [=] [IF]                       ( cast for unsigned 64 bits numbers)
[UNDEFINED] +ULL [IF]
[hex] 7fffffffffffffff 1+ +constant +ULL [decimal]
[THEN]
[THEN]