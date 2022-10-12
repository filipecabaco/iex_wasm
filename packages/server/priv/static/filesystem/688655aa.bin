\ Copyright (C) 2002, 2003 Volker Poplawski <volker@poplawski.de>
\                          Stefan Reinauer
\ This example even fits in a signature ;-)

include lib/pickroll.4th

: arshift 0 ?do 2/ loop ;

[hex] 4666 dup negate
do
    i 4000 dup 2* negate
    do
        2a 0 dup 2dup 1e 0
    do
        2swap * d arshift 4 pick +
        -rot - j +
        dup dup * e arshift rot
        dup dup * e arshift rot
        swap
        2dup + 10000 > if
            drop 2drop 2drop 20 0 dup 2dup leave
        then
    loop
    2drop 2drop
    emit
    268 +loop
    cr drop
5de +loop

