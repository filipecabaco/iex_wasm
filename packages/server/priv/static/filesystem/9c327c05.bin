\ Program by Prof. Ting

[needs lib/enter.4th]
[needs lib/ansfacil.4th]
[needs lib/random.4th]

4096 string bottom                      ( allocate 4096 chars )

char O CONSTANT white                   ( ASCII # )
BL     CONSTANT black                   ( blank )

: address1 ( n -- addr )                ( first area of life objects)
        2047 AND                        ( n modulo 2048 )
        BOTTOM +                        ( add offset to LO )
        ;

: address2 ( n -- addr )                ( 2nd area for next generation)
        address1                        ( add 2048 to the address1 )
        2048 +                          ( let address1 do the modulus )
        ;

: neighbors ( -- )
        2048 0                          ( scan the entire map )
        DO      I 1 + address1 c@       ( add objects in 8 neighbors )
                I 1 - address1 c@ +
                I 79 + address1 c@ +
                I 79 - address1 c@ +
                I 80 + address1 c@ +
                I 80 - address1 c@ +
                I 81 + address1 c@ +
                I 81 - address1 c@ +
                I address1 c@           ( object in this location? )
                IF      DUP 2 =         ( yes.  2 or 3 neighbors? )
                        SWAP 3 = OR
                        IF 1 ELSE 0 THEN ( over-crowded. )
                ELSE    3 =             ( empty location )
                        IF 1 ELSE 0 THEN ( give birth if 3 life neighbors)
                THEN
                I address2 c!           ( store next generation )
        LOOP
        ;

: refresh ( -- )                        ( copy next generation to current)
        BOTTOM 2048 + BOTTOM 2048 CMOVE
        ;

: display ( -- )                        ( show current map on screen )
        BOTTOM
        24 0 DO                         ( show a screen full )
           79 0 DO                      ( show a line )
                DUP C@                  ( life object here? )
                IF WHITE ELSE BLACK THEN
                EMIT                    ( show it )
                1+                      ( next location )
           LOOP CR 1+                   ( next line )
        LOOP    DROP
        79 0 DO [CHAR] = EMIT LOOP CR   ( display separation )
        ;

: init-map ( addr -- )                  ( generate a map from some memory )
        RANDOMIZE                       ( initialize randomizer )
        2048 0                          ( look at a 2048 byte area )
        DO      random 1 AND            ( use its least significant bit )
                IF 1 ELSE 0 THEN        ( to assign life object )
                I address1 c!           ( in our current map )
        LOOP
        ;

: generations ( n -- )                  ( repeat n generations )
        0 DO    neighbors               ( compute next generation )
                refresh                 ( copy to current map )
                display                 ( and show it )
                2000 ms                 ( make a pause )
        LOOP
        ;

init-map                               ( initialize the map )
." How many generations? "
enter
generations                            ( do 10 generations )

