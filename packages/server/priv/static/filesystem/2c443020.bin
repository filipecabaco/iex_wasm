\ Wil Baden's heapsort, 4tH version
\ Set PRECEDES for different datatypes or sort order.

\  This is a direct translation of HEAPSORT from Knuth's _The Art of
\  Computer Programming_, section 5.2.3.

\  Normallly the data is an array of addresses of records.  The
\  deferred PRECEDES function, used in two places, should compare the
\  keys within a pair of records.

[UNDEFINED] SORT     [IF]
[UNDEFINED] PRECEDES [IF]
DEFER PRECEDES                         ( addr addr -- flag )
[THEN]                                 \ compatible with QSORT

: SORT                                 ( a n -- )
    dup 2 < IF 2DROP EXIT THEN
    SWAP >R                            ( n)
                                       \ H1.  Initialize.
    dup 2/ CELLS SWAP 1- CELLS         ( l r)
    BEGIN                              \ H2.  Decrease _l_ or _r_.
\ A N IDUMP  SPACE  over 1 CELLS / 1+ .  dup 1 CELLS / 1+ .
        over IF
            >R 1 CELLS - R>
            over R@ + @ R> SWAP >R >R
        ELSE
            dup R@ + @ R> SWAP >R >R
            R@ @ over R@ + !
            1 CELLS -
            dup 0= IF 2DROP R> R> SWAP ! EXIT THEN
        THEN
                                       \ H3.  Prepare for siftup.
        over                           ( l r j)
        BEGIN                          \ H4.  Advance downward.
            dup 2* CELL+               ( l r i j)
            >R OVER R> SWAP over ( r j) < 0=
        WHILE                          \ H5.  Find larger child.
            >R OVER R> SWAP over ( r j) > IF
                dup R@ + @ over CELL+ R@ + @ PRECEDES
                    IF  CELL+  THEN
            THEN                       \ H6.  Larger than _K_?
            R> R@ SWAP >R over R@ + @ PRECEDES
        WHILE                          \ H7.  Move it up.
            dup R@ + @ ROT R@ + !      ( l r j)
        REPEAT                         ( l r i j)
[UNDEFINED] 4TH# [IF] THEN [THEN]      \ H8.  Store _R_.
        DROP                           ( l r i)
        R> R> SWAP >R SWAP R@ + !      ( l r)
    AGAIN ;
[THEN]