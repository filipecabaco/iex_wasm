\ Philips/NXP Mifare Crypto-1 implementation v1.0
\ By Karsten Nohl, Henryk Plötz, Sean O’Neil

\ Clock the prng register by n steps and return the new state, don’t
\ update the register.
\ Note: returns a 32 bit value, even if the register is only 16 bit wide.
\ This return value is only valid, when the register was clocked at least
\ 16 times.

[UNDEFINED] mifare-prng [IF]
[UNDEFINED] rev8bit     [IF] include lib/bitrevse.4th [THEN]

[hex]
: (rev16) dup 0FF and rev8bit swap 8 rshift 0FF and rev8bit 8 lshift or ;
: (rev32) dup 0FFFF and (rev16) swap 10 rshift 0FFFF and (rev16) 10 lshift or ;
[decimal]
                                       \ n1 = register value, n2 = cycles
: mifare-prng                          ( n1 n2 -- n3)
  swap (rev32) swap 0 ?do              \ perform algorithm for n2 cycles
    >r r@ 15 rshift r@ 13 rshift r@ 12 rshift r@ 10 rshift xor xor xor 1
    and r> 1 lshift or                 \ shift original number left
  loop (rev32)                         \ reverse the bytes again
;

[DEFINED] 4TH# [IF]
  hide (rev16)
  hide (rev32)
[THEN]
[THEN]
