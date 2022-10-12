\ ***
\ Partially based on code by Wil Baden 1997-11-17
\ Believed to be in the public domain
\ 4tH version, Copyright J.L. Bezemer 2011,2012
\ ***
\ Permission is granted to everybody, to copy and distribute this 
\ text, to broadcast, to perform and to use it in any way, with or
\ without changes, in or from any medium, as long as this message
\ is preserved.
\ ***

[UNDEFINED] bin>base64 [IF]
[UNDEFINED] c>s        [IF] include lib/ctos.4th     [THEN]
[UNDEFINED] is-upper   [IF] include lib/istype.4th   [THEN]
[UNDEFINED] parse-name [IF] include lib/parsname.4th [THEN]

3 string (tmp3)                        \ binary buffer
5 string (tmp4)                        \ ASCII buffer (one extra for COUNT)

 0 char A - +constant +"A"             \ convert upper to binary
26 char a - +constant +'a'             \ convert lower to binary
52 char 0 - +constant +'0'             \ convert numeric to binary
62 char + - +constant +'+'             \ convert + to binary
63 char / - +constant +'/'             \ convert / to binary

\ Translation Table as described in RFC1113
offset Base64-Alphabet
  char A c, char B c, char C c, char D c, char E c, char F c, char G c,
  char H c, char I c, char J c, char K c, char L c, char M c, char N c,
  char O c, char P c, char Q c, char R c, char S c, char T c, char U c,
  char V c, char W c, char X c, char Y c, char Z c,
  char a c, char b c, char c c, char d c, char e c, char f c, char g c,
  char h c, char i c, char j c, char k c, char l c, char m c, char n c,
  char o c, char p c, char q c, char r c, char s c, char t c, char u c,
  char v c, char w c, char x c, char y c, char z c,
  char 0 c, char 1 c, char 2 c, char 3 c, char 4 c, char 5 c, char 6 c,
  char 7 c, char 8 c, char 9 c, char + c, char / c,
                                       ( a1 n1 a2 n2 -- a1 n1 a2 n2 f)
: fits? swap >r >r dup 3 /mod swap if 1+ then 4 * 1+ r@ > r> r> swap rot ;
: ?adjust chars (tmp4) + dup c@ [char] = = if 0 swap c! 1+ else drop then ;
: slack? 0 2 ?adjust 3 ?adjust ;       ( --)
: line> 0 dup begin 2drop refill dup while drop parse-name dup until ;
                                       \ terminate Base64 sequence
: terminate-ascii-line                 ( n1 a1 -- n1 a1)
  over 3 mod dup if 3 swap - 0 ?do dup s" =" rot +place loop else drop then
;
                                       ( a n2 n3 -- a n2)
: Bin-to-Ascii 63 and Base64-Alphabet rot >r c>s r@ +place r> swap ;
                                       \ convert ASCII to binary equivalent
: Ascii-to-Bin                         ( n1 -- n2)
  dup is-upper if +"A" exit then       \ not the most beautiful code
  dup is-lower if +'a' exit then       \ but quite efficient in 4tH
  dup is-digit if +'0' exit then       \ returns negative number
  dup [char] + = if +'+' exit then     \ when not in Base64 alphabet
  dup [char] / = if +'/' else negate then
;
                                       \ convert binary triplet to Base64
: 3Bin-to-4Ascii                       ( n a1 -- a1)
  swap >r (tmp3)
  dup c@ 16 lshift >r char+            ( str+1)( r: x)
  dup c@ 8  lshift r> or >r char+      ( str+2)( r: xx)
  c@ r> or                             ( xxx)( r: )
  dup 18 rshift bin-to-ascii
  dup 12 rshift bin-to-ascii
  r@ 1 > if dup 6 rshift bin-to-ascii then
  r> 2 > if dup bin-to-ascii then drop
;
                                       \ convert Base64 quadruplet to binary
: 4Ascii-to-3Bin                       ( a n -- a )
  >r (tmp4)
  dup c@ Ascii-to-Bin 18 lshift >r char+
  dup c@ Ascii-to-Bin 12 lshift r> or >r char+
  dup c@ Ascii-to-Bin  6 lshift r> or >r char+
  c@ Ascii-to-Bin r> or swap
  over 16 rshift over c! char+
  r@ 2 < if over 8 rshift over c! char+ then
  r> 1 < if over over c! char+ then nip
;
                                       \ convert a string to Base64
: s>base64                             ( a1 n1 a2 n2 -- a2 n3 f)
  over 0 swap c! fits? dup >r 0=       \ if buffer large enough
  if                                   \ figure out number of iterations
    drop >r 2dup dup 3 /mod swap if 1+ then r> swap 0
    ?do                                \ erase and fill buffer
       >r dup 3 min >r (tmp3) 3 erase
       over (tmp3) r@ cmove r> r> 3Bin-to-4Ascii >r 3 /string r>
    loop                               \ convert string in 3 char chunks
    >r 2drop r> terminate-ascii-line count
  then 2nip r>                         \ clean up and get flag
;
                                       \ convert a *clean* Base64 string
: base64>s                             ( a1 n1 -- a1 n2)
  over >r 2dup dup 4 /mod swap if 1+ then r> swap 0
  ?do                                  \ figure out number of iterations
     >r dup 4 min >r (tmp4) 4 erase    \ erase and fill buffer
     over (tmp4) r> cmove r> slack? 4Ascii-to-3Bin >r 4 /string r>
  loop                                 \ convert string in 4 char chunks
  >r 2drop drop r> over -              \ clean up and calculate length
;
                                       \ convert an open file to base64
: bin>base64                           ( --)
  0 dup (tmp3) >r                      \ save count and buffer address
  begin
    drop 0 (tmp4) c! r@ 3 2dup erase   \ erase all buffers
    accept dup                         \ try filling the buffer
  while                                \ exit if buffer completely empty
    dup >r                             \ fill (tmp3) buffer, save count
    (tmp4) 3Bin-to-4Ascii r@ 3 <       \ convert, check EOF and adjust
    if r> swap terminate-ascii-line swap >r then count type
    1+ dup 19 = if dup xor cr then     \ break at 76 characters
    r> 3 < dup                         \ until buffer partially filled
  until drop r> drop 19 - if cr then   \ final carriage return and cleanup
;                                      \ save any residue
                                       ( a1 n1 -- n3)
: >buffer dup if tuck (tmp4) dup 4 erase place 4 swap - else nip then ;
                                       \ fill residue buffer and convert
: buffer>                              ( a1 n1 n2 -- a1 n3 n4)
  dup if                               \ if there was a residue
    over min >r over r@ (tmp4) +place  \ fill gap in buffer
    (tmp3) dup slack? 4Ascii-to-3Bin over - type r> /string
  else                                 \ convert, adjust string
    drop                               \ no residue, so drop value
  then 4 /mod 4 * swap                 \ calculate next residue
;
                                       \ convert an open file to binary
: base64>bin                           ( --)
  0 >r pad >r                          \ setup dummy parameters
  begin                                \ if there was a residue, set it up
    r> r> >buffer line> dup            \ as long as there are lines to be read
  while                                \ strip the line from any whitespace
    rot buffer> >r 2dup chars + >r base64>s type
  repeat drop drop                     \ drop flag and residue count
;

[DEFINED] 4TH# [IF]
  hide (tmp3)
  hide (tmp4)
  hide +"A"
  hide +'a'
  hide +'0'
  hide +'+'
  hide +'/'
  hide Base64-Alphabet
  hide fits?
  hide ?adjust
  hide slack?
  hide terminate-ascii-line
  hide Bin-to-Ascii
  hide Ascii-to-Bin
  hide 3Bin-to-4Ascii
  hide 4Ascii-to-3Bin
  hide >buffer
  hide buffer>
[THEN]
[THEN]

\ s" base64.b64" input open error? abort" Cannot open" use base64>bin
\ s" base64.4th" input open error? abort" Cannot open" use bin>base64
\ 100 string my64 S" This is the end!!" my64 100 s>base64 . type cr
\ s" VGhpcyBpcyB0aGUgZW5kISE=" base64>s type cr depth .
