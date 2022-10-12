\ Priority Queue                                   uh 2016-02-21

\ Items that we store in the priority queue are double cell entries.
\ First cell is priority, second cell is value or pointer to a larger
\ data structure.

\ Copyright (c) 2016 Ulrich Hoffmann

\ The MIT License (MIT)
\ Permission is hereby granted, free of charge, to any person obtaining a copy
\ of this software and associated documentation files (the "Software"), to
\ deal in the Software without restriction, including without limitation the
\ rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
\ sell copies of the Software, and to permit persons to whom the Software is
\ furnished to do so.

\ The above copyright notice and this permission notice shall be included in
\ all copies or substantial portions of the Software.

\ 4tH port, J.L. Bezemer 2017-02-14

[UNDEFINED] q-items [IF]
[UNDEFINED] 2!      [IF] include lib/anscore.4th [THEN]

2 cells   *constant q-items            ( n -- units ) 
1 q-items +constant q-item+            ( addr -- x1 ... xn )

aka 2! q-item!                         ( x1 ... xn addr )
aka 2@ q-item@                         ( addr -- addr' )

\ Defining word Priority-Queue:
aka ! Priority-Queue!                  ( maxsize prio-q -- )

\ First field holds maximum size of priority queue
aka @ q-maxsize                        ( q -- max-size )

\ Second field holds actual size of priority queue
aka cell+ q-'size                      ( q -- 'size )

: q-size ( q -- u ) q-'size @ ;
: q-empty? ( q -- f ) q-size 0= ;
: q-clear ( q -- ) 0 swap q-'size ! ;
: q-full? ( q -- )  dup q-size  swap q-maxsize < 0= ;

\ throw values for priority queue exceptions
5000 constant #Q-UNDERFLOW
5001 constant #Q-OVERFLOW

: ?q-underflow ( q -- ) q-empty? IF #Q-UNDERFLOW throw THEN ;

: ?q-overflow ( q -- )  dup q-size  swap q-maxsize <
  IF EXIT THEN #Q-OVERFLOW throw ;

\ The following cells hold the queue items
2 cells +constant q-start              ( q -- addr )

: q-end ( q -- addr )                  \ address of 1st item beyond queue
    dup q-start swap q-size q-items + ;

: q-drop ( q -- )                      \ remove front item from queue
    dup ?q-underflow
    -1 over q-'size +! 
    dup >r  q-start dup q-item+ swap  r> q-size q-items smove ;

: q@ ( q -- key val )                  \ retrieve front item from queue
    dup ?q-underflow  dup >r q-start q-item@   r> q-drop ;

: q-find ( key q -- addr )             \ find address of first item with
    dup q-end swap q-start ?DO ( key ) \ higher priority
        dup  I q-item@ drop  < IF drop I UNLOOP EXIT THEN
    1 q-items +LOOP 
    drop 0 ;

: q-append ( key val q -- )            \ append item at end of queue
    dup ?q-overflow
    dup >r    q-end q-item!   1 r> q-'size +! ;

: q! ( key val q -- )                  \ store item in queue according to its
    dup ?q-overflow                    \ priority
    >r over r> swap over  q-find dup IF ( key val q addr ) \ insert item
       over 1 swap q-'size +!  dup >r dup q-item+  rot q-end over - smove
       r> q-item! 
       EXIT
    THEN
    drop q-append ;

: q. ( q -- )                          \ show text representation
    cr ." <priority-queue adr='" dup 0 .r ." ' max-size='"
    dup q-maxsize 0 .r ." '>" cr
    dup q-end swap q-start ?DO 
        I q-item@ swap
        ."   <q-item key='" 0 .r
        ." ' value='" 0 .r ." '/>"
        cr
    1 q-items +LOOP
    ." </priority-queue>" ;

[DEFINED] 4TH# [IF]
  hide q-item+
  hide q-item!
  hide q-item@
  hide q-'size
  hide ?q-underflow
  hide ?q-overflow
  hide q-start
  hide q-end
[THEN]
[THEN]
