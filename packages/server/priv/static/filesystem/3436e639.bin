\ 4tH library - CRC-32 - Copyright 2021 J.L. Bezemer
\ You can redistribute this file and/or modify it under
\ the terms of the GNU General Public License

\ Based on the following C code:

\ #include <stddef.h>
\ #include <stdint.h>

\ uint32_t crc32(const char *s,size_t n) {
\   uint32_t crc=0xFFFFFFFF;
	
\   for(size_t i=0;i<n;i++) {
\     char ch=s[i];
\     for(size_t j=0;j<8;j++) {
\       uint32_t b=(ch^crc)&1; crc>>=1;
\       if(b) crc=crc^0xEDB88320; ch>>=1;
\     }
\   }
\   return ~crc;
\ }

[UNDEFINED] buf>crc32 [IF]
[UNDEFINED] +UL       [IF] include lib/constant.4th [THEN]

[HEX] /cell 4 [=] [IF]                 \ 32 bit and 64 bit versions
   6DB88320 +UL constant (crc-magic)
   7FFFFFFF +UL constant (32-bits)
[ELSE]
   EDB88320 constant (crc-magic)
   FFFFFFFF constant (32-bits)
[THEN] [DECIMAL]

1 string (char-buf)                    \ for FILE>CRC32
                                       \ main hash routine
: (crc32)                              ( crc ch -- crc' )
  8 0 do  
    over over xor 1 and                ( crc ch b)
    >r 1 rshift swap 1 rshift r>       ( ch crc)
    if (crc-magic) xor then swap       ( crc ch)
  loop drop
;
                                       ( x xt -- n)
: (exec-crc32) (32-bits) dup >r swap execute r> xor ;
: buf>crc32 [: -rot bounds ?do i c@ (crc32) loop ;] (exec-crc32) ;
                                       ( a n1 -- n2)
: file>crc32                           ( a n1 -- n2)
  input open error? ?exit dup >r use   \ open file
  [: begin (char-buf) dup 1 accept 0> while c@ (crc32) repeat drop ;]
  (exec-crc32) r> close                \ read file execution token
;                                      \ close the file

[DEFINED] 4TH# [IF]
  hide (char-buf)
  hide (crc32)
  hide (exec-crc32)
[THEN]
[THEN]
  
\ s" 123456789" buf>crc32 hex .
\ s" The quick brown fox jumps over the lazy dog" buf>crc32 hex . 
\ s" crc32.4th" file>crc32 hex . depth .

