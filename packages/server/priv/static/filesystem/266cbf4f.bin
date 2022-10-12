\ Binary Search by Charles Melice

\ When the key is not found, returns the position of the nearest greater key.
\ Can be used to insert a new key in the sorted array.

\     BSEARCH  ( key array count -- index flag )
\         count   count of elements in array.
\         array   SORTED array of anything.
\         key     the key we are searching for.
\         flag    TRUE if key was found.
\         index   effective else virtual key position in array.

\ and, to define please:

\     DEFER GET-KEY  ( index array -- key )
\         array   sorted array of anything.
\         index   index
\         key     the value at array[index]

\     DEFER B-COMPARE  ( key1 key2 -- result )
\         if key1 < key2, return -1
\         if key1 > key2, return +1
\         else return 0.

[UNDEFINED] BSEARCH [IF]
DEFER GET-KEY    ( index array -- key )
DEFER B-COMPARE  ( key1 key2 -- result )

: BSEARCH                        ( key array count -- index flag )
  DUP 0> IF                      \ if no array, quit
    TUCK 1- >R >R                ( key count)( R: array count)
    0 SWAP                       ( key lo hi)

    BEGIN  2DUP < WHILE
      DUP >R >R OVER OVER 
      R> -ROT R>
      + 1 RSHIFT TUCK            ( . . . mid key mid)
      R@ GET-KEY B-COMPARE       ( . . . mid flag)
      0> IF 1+ ROT DROP SWAP     \  mid 1+ to lo
      ELSE NIP                   \  mid to hi
      THEN
    REPEAT                       ( key lo hi)

    NIP R> OVER R> > IF          \ check end of array
      DROP SWAP >ZERO            \ if so, not found
    ELSE                         ( key index array)
      >R TUCK R> GET-KEY B-COMPARE 0=
    THEN

  ELSE
    2DROP >ZERO DUP
  THEN ;
[THEN]
