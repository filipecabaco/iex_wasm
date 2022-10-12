\ Taken from http://rosettacode.org 
\ 4tH version 2010, Hans Bezemer

[UNDEFINED] soundex [IF]
4 string sndx                          \ dedicated soundex buffer
                                       \ it is overwritten with each call!
offset alpha-table                     \ lookup table for soundex values
  bl     c, char 1 c, char 2 c, char 3 c,
  bl     c, char 1 c, char 2 c, char . c,
  bl     c, char 2 c, char 2 c, char 4 c,
  char 5 c, char 5 c, bl     c, char 1 c,
  char 2 c, char 6 c, char 2 c, char 3 c,
  bl     c, char 1 c, char . c, char 2 c,
  bl     c, char 2 c,
                                       ( c -- c)
: soundex-code 32 or [char] a - 0 max 26 min alpha-table ;
 
: soundex                              ( name len -- sndx len )
  over c@ sndx c!                      \ First character verbatim
  sndx char+ 3 [char] 0 fill           \ sndx to four characters with zeros
  1 sndx c@ soundex-code               ( count code )
  2swap bounds do
    i c@ soundex-code                  ( count code next )
    2dup = if         drop else        \ runs are ignored
    dup [char] . = if drop else        \ W, H don't separate runs of consonants
    dup bl = if        nip else        \ vowels separate consonants but aren't coded
      nip
      2dup swap sndx + c!
      swap 1+
      tuck 4 = if leave then
    then then then
  loop
  2drop sndx 4 ;

[DEFINED] 4TH# [IF]
  hide sndx
  hide alpha-table
  hide soundex-code
[THEN]
[THEN]

