\ 4tH library - MORSE - Copyright 2011.2012 J.L. Bezemer
\ You can redistribute this file and/or modify it under
\ the terms of the GNU General Public License

\ o The application program is responsible for breaking up a line into
\   Morse tokens.
\ o Note the table is case sensitive. Lower case characters are NOT
\   recognized!
\ o The returned Morse string is in a transient area, so it has a short
\   lifespan.
\ o The words return zero or a NULL string on error.

[UNDEFINED] >morse [IF]

create (morse)
       21 128 * char A + ,
     1222 128 * char B + ,
     1212 128 * char C + ,
      122 128 * char D + ,
        2 128 * char E + ,
     2212 128 * char F + ,
      112 128 * char G + ,
     2222 128 * char H + ,
       22 128 * char I + ,
     2111 128 * char J + ,
      121 128 * char K + ,
     2122 128 * char L + ,
       11 128 * char M + ,
       12 128 * char N + ,
      111 128 * char O + ,
     2112 128 * char P + ,
     1121 128 * char Q + ,
      212 128 * char R + ,
      222 128 * char S + ,
        1 128 * char T + ,
      221 128 * char U + ,
     2221 128 * char V + ,
      211 128 * char W + ,
     1221 128 * char X + ,
     1211 128 * char Y + ,
     1122 128 * char Z + ,
    11111 128 * char 0 + ,
    21111 128 * char 1 + ,
    22111 128 * char 2 + ,
    22211 128 * char 3 + ,
    22221 128 * char 4 + ,
    22222 128 * char 5 + ,
    12222 128 * char 6 + ,
    11222 128 * char 7 + ,
    11122 128 * char 8 + ,
    11112 128 * char 9 + ,
   212121 128 * char . + ,
   112211 128 * char , + ,
   221122 128 * char ? + ,
   211112 128 * char ' + ,
   121211 128 * char ! + ,
    12212 128 * char / + ,
    12112 128 * char ( + ,
   121121 128 * char ) + ,
    21222 128 * char & + ,
   111222 128 * char : + ,
   121212 128 * char ; + ,
    12221 128 * char = + ,
    21212 128 * char + + ,
   122221 128 * char - + ,
   221121 128 * char _ + ,
   212212 128 * char " + ,
  2221221 128 * char $ + ,
   211212 128 * char @ + ,
                       0 ,             ( n1 -- n2 c)
does> swap cells + @c 128 /mod ;
                                       \ encode/decode morse codes
: >dot <# #s #> 2dup bounds ?do i c@ 4 - i c! loop ;
: dot> 2dup bounds ?do i c@ 4 + i c! loop number ;
                                       \ convert character to morse
: >morse                               ( c -- a n)
  >r 0 begin dup (morse) over while over r@ - while drop drop 1+ repeat
  rot r> drop drop dup if nip >dot then
;
                                       \ convert character from morse
: morse>                               ( a n -- c)
  dot> >r 0 begin dup (morse) dup while dup r@ - while drop drop 1+ repeat
  rot r> drop drop drop 
;

[DEFINED] 4TH# [IF]
  hide (morse)
  hide >dot
  hide dot>
[THEN]
[THEN]
