\ Copyright (C) 2002, 2003 Volker Poplawski <volker@poplawski.de>
\                          Stefan Reinauer
\ This example even fits in a signature ;-)

\ Optimizations and 4tH version, J.L. Bezemer 2013,2014

18022 -18022 do
    16384 -32768 do
        j 42 0 dup dup dup
        30 0 do
           - j + -rot * 8192 / 2>r over 2r> rot +
           over dup * 16384 /
           over dup * 16384 /
           over over + 65536 > if
              drop drop drop drop drop 32 0 dup dup dup leave
           then
        loop
        drop drop drop drop emit drop
    616 +loop
    cr
1502 +loop
