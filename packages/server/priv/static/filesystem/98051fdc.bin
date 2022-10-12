\ Copryright Timothy Huang, October 1982
\ Optimized 4tH version, J.L. Bezemer, November 2011, 2012

[UNDEFINED] BIT-ARRAY [IF]
[UNDEFINED] CELL-BITS [IF] include lib/constant.4th [THEN]
                                       ( #bit addr -- n1 n2)
: @MASK @ 1 ROT LSHIFT ;               \ fetches element and create mask

\ Warning!! number.of.bit.wanted must be a multiple of CELL-BITS!
\ BIT-ARRAY defines a family of bitarrays. At the bit array
\ creation time [time 2], it takes the form:

\ number.of.bit.wanted CELL-BITS / ARRAY <name> DOES> BIT-ARRAY ;

\ At the execution time [ use the <name> bit array ; time 3 ],
\ it takes the form:

\ index <name> [index --- # .of.bit.offset addr ]
                                       \ BIT-ARRAY DOES> word
: BIT-ARRAY                            ( index --- #.of.bit.offset addr)
  SWAP CELL-BITS /MOD ROT + ;

\ BIT? yields the bit status. BIT-ON sets the bit. BIT-OFF
\ sets the bit off. BIT-TOGGLE toggle the bit. Use the form:
\ index <name> BITxxxxxx )
                                       \ BIT-ON BIT-OFF BIT? BIT-TOGGLE
: BIT?                                 ( index <name> --- 1/0 )
  @MASK AND 0<> ;                      \ 1 = on 0 = off
                                       \ set index bit on
: BIT-ON                               ( index <name> --)
  DUP >R @MASK OR R> ! ;
                                       \ turn index bit off
: BIT-OFF                              ( index <name> --)
  DUP >R @MASK INVERT AND R> ! ;

: BIT-TOGGLE ( index <name> --- )      \ toggle index bit
  DUP >R @MASK XOR R> ! ;

[DEFINED] 4TH# [IF]                    \ hide private word @MASK
  hide @MASK
[THEN]
[THEN]
