\ Lists the contents of an area in dump format ( a n --)

[UNDEFINED] dump [IF]                  \ n must be a multiple of BASE
: dump                                 ( addr n -- )
  cr /cell 2* spaces over              \ print a ruler
  base @ 0 do i over + base @ mod /cell .r loop 2 spaces
  base @ 0 do i over + base @ mod 1 .r loop drop
                                       \ dump bytes
  0 ?do
    base @ >r cr dup /cell 2* .r 
    r@ 0 do i over + c@ /cell .r loop 2 spaces
    r@ 0 do i over + c@ 127 and dup 32 < if drop 46 then emit loop
    r@ +
  r> +loop

  cr drop ; 
[THEN]
