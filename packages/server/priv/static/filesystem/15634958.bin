\               Hamming Encoding and Decoding Implementation

\   File     : hamming.4th
\   Purpose  : Implementation Hamming encode and decode routines.  Contains
\              different style functions for Hamming encoding and decoding.
\   Author   : Michael Dipperstein
\   Date     : December 29, 2004
\   4tH port : J.L. Bezemer, December 19, 2011

\   Revision 1.4  2007/09/19 13:08:14  michael
\   Licensed under LGPL V3.

[UNDEFINED] HammingMatrixEncode [IF]
[UNDEFINED] bitcount [IF] include lib/bits.4th [THEN]

  4 constant DATA_BITS
 16 constant DATA_VALUES               ( 2^DATA_BITS)

\ number of parity bits and data values 
  3 constant PARITY_BITS
  8 constant PARITY_VALUES             ( 2^PARITY_BITS)

\ number of code bits (data + parity) and data values
DATA_BITS PARITY_BITS + constant CODE_BITS
128 constant CODE_VALUES               ( 2^CODE_BITS)

[HEX]
( code matrix 2nd, 3rd, and 4th MSB define parity bits )
\ offset (g) 
\     38 c,   ( 0 1 1 | 1 0 0 0 )
\     54 c,   ( 1 0 1 | 0 1 0 0 )
\     62 c,   ( 1 1 0 | 0 0 1 0 )
\     71 c,   ( 1 1 1 | 0 0 0 1 )

( code matrix transposed for ease of use in routines )
offset (gT)
    07 c,   ( 0 1 1 1 )
    0B c,   ( 1 0 1 1 )
    0D c,   ( 1 1 0 1 )
            ( ------- )
    08 c,   ( 1 0 0 0 )
    04 c,   ( 0 1 0 0 )
    02 c,   ( 0 0 1 0 )
    01 c,   ( 0 0 0 1 )

( table of Hamming codes hammingCodes[x] is the x encoded )
offset (hammingCodes)
    00 c,   ( 0 )
    71 c,   ( 1 )
    62 c,   ( 2 )
    13 c,   ( 3 )
    54 c,   ( 4 )
    25 c,   ( 5 )
    36 c,   ( 6 )
    47 c,   ( 7 )
    38 c,   ( 8 )
    49 c,   ( 9 )
    5A c,   ( A )
    2B c,   ( B )
    6C c,   ( C )
    1D c,   ( D )
    0E c,   ( E )
    7F c,   ( F )

( parity check matrix.  4 LSBs indicate which bits a parity bit represents )
offset (h)
    47 c,   ( 1 0 0 | 0 1 1 1 )
    2B c,   ( 0 1 0 | 1 0 1 1 )
    1D c,   ( 0 0 1 | 1 1 0 1 )

( convert syndrome [H x data] to mask that corrects data error )
offset (syndromeMask)
    00 c,   ( syndrome = 0 0 0 )
    10 c,   ( syndrome = 0 0 1 )
    20 c,   ( syndrome = 0 1 0 )
    08 c,   ( syndrome = 0 1 1 )
    40 c,   ( syndrome = 1 0 0 )
    04 c,   ( syndrome = 1 0 1 )
    02 c,   ( syndrome = 1 1 0 )
    01 c,   ( syndrome = 1 1 1 )

( table convering encoded value [with error] to original data )
( hammingDecodeValues[code] = original data )
offset (hammingDecodeVals)
    00 c, 00 c, 00 c, 03 c, 00 c, 05 c, 0E c, 07 c,     ( 00 to 07 )
    00 c, 09 c, 0E c, 0B c, 0E c, 0D c, 0E c, 0E c,     ( 08 to 0F )
    00 c, 03 c, 03 c, 03 c, 04 c, 0D c, 06 c, 03 c,     ( 10 to 17 )
    08 c, 0D c, 0A c, 03 c, 0D c, 0D c, 0E c, 0D c,     ( 18 to 1F )
    00 c, 05 c, 02 c, 0B c, 05 c, 05 c, 06 c, 05 c,     ( 20 to 27 )
    08 c, 0B c, 0B c, 0B c, 0C c, 05 c, 0E c, 0B c,     ( 28 to 2F )
    08 c, 01 c, 06 c, 03 c, 06 c, 05 c, 06 c, 06 c,     ( 30 to 37 )
    08 c, 08 c, 08 c, 0B c, 08 c, 0D c, 06 c, 0F c,     ( 38 to 3F )
    00 c, 09 c, 02 c, 07 c, 04 c, 07 c, 07 c, 07 c,     ( 40 to 47 )
    09 c, 09 c, 0A c, 09 c, 0C c, 09 c, 0E c, 07 c,     ( 48 to 4F )
    04 c, 01 c, 0A c, 03 c, 04 c, 04 c, 04 c, 07 c,     ( 50 to 57 )
    0A c, 09 c, 0A c, 0A c, 04 c, 0D c, 0A c, 0F c,     ( 58 to 5F )
    02 c, 01 c, 02 c, 02 c, 0C c, 05 c, 02 c, 07 c,     ( 60 to 67 )
    0C c, 09 c, 02 c, 0B c, 0C c, 0C c, 0C c, 0F c,     ( 68 to 6F )
    01 c, 01 c, 02 c, 01 c, 04 c, 01 c, 06 c, 0F c,     ( 70 to 77 )
    08 c, 01 c, 0A c, 0F c, 0C c, 0F c, 0F c, 0F c,     ( 78 to 7F )

( packed table convering encoded value [with error] to original data )
( hammingPackedDecodeValues[code / 2] & 0F = original data for odd codes )
( hammingPackedDecodeValues[code / 2] >> 4 = original data for even codes )
offset (hammingPackDecodeVals)
    00 c, 03 c, 05 c, E7 c,     ( 00 to 07 )
    09 c, EB c, ED c, EE c,     ( 08 to 0F )
    03 c, 33 c, 4D c, 63 c,     ( 10 to 17 )
    8D c, A3 c, DD c, ED c,     ( 18 to 1F )
    05 c, 2B c, 55 c, 65 c,     ( 20 to 27 )
    8B c, BB c, C5 c, EB c,     ( 28 to 2F )
    81 c, 63 c, 65 c, 66 c,     ( 30 to 37 )
    88 c, 8B c, 8D c, 6F c,     ( 38 to 3F )
    09 c, 27 c, 47 c, 77 c,     ( 40 to 47 )
    99 c, A9 c, C9 c, E7 c,     ( 48 to 4F )
    41 c, A3 c, 44 c, 47 c,     ( 50 to 57 )
    A9 c, AA c, 4D c, AF c,     ( 58 to 5F )
    21 c, 22 c, C5 c, 27 c,     ( 60 to 67 )
    C9 c, 2B c, CC c, CF c,     ( 68 to 6F )
    11 c, 21 c, 41 c, 6F c,     ( 70 to 77 )
    81 c, AF c, CF c, FF c,     ( 78 to 7F )
[DECIMAL]
                                       ( n1 -- n2)
: SumBitsModulo2 CODE_VALUES 1- and bitcount 1 and ;
                                       \ determine Hamming code for a value
: HammingMatrixEncode                  ( n1 -- n2)
  0 CODE_BITS over
  do 1 lshift over i (gT) and SumBitsModulo2 or loop nip
;
                                       \ determine the value encoded by a code
: HammingMatrixDecode                  ( n1 -- n2)
  0 PARITY_BITS over
  do 1 lshift over i (h) and SumBitsModulo2 or loop
  (syndromeMask) xor DATA_VALUES 1- and
;                                      \ packed lookup table to determine 
                                       \ value encoded by a code
: HammingPackTableDecode               ( n1 -- n2)
  dup 2/ (hammingPackDecodeVals) swap 1 and
  if DATA_VALUES 1- and else DATA_BITS rshift then
;

aka (hammingCodes)      HammingTableEncode
aka (hammingDecodeVals) HammingTableDecode

[DEFINED] 4TH# [IF]
\  hide (g)
  hide (gT)
  hide (hammingCodes)
  hide (h)
  hide (syndromeMask)
  hide (hammingDecodeVals)
  hide (hammingPackDecodeVals)
  hide SumBitsModulo2
[THEN]
[THEN]
