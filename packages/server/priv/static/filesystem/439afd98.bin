\ Testall: 4tH Test prorgam for Hamming Encoding/Decoding routines
\ Copyright (C) 2004, 2007 by Michael Dipperstein (mdipper@cs.ucsb.edu)

\ This file is part of the Hamming library.

\ The Hamming library is free software; you can redistribute it and/or
\ modify it under the terms of the GNU Lesser General Public License as
\ published by the Free Software Foundation; either version 3 of the
\ License, or (at your option) any later version.

\ The Hamming library is distributed in the hope that it will be useful,
\ but WITHOUT ANY WARRANTY; without even the implied warranty of
\ MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU Lesser
\ General Public License for more details.

\ You should have received a copy of the GNU Lesser General Public License
\ along with this program.  If not, see <http://www.gnu.org/licenses/>.

\   Description: This function verifies that the Hamming encode function
\                produces resutls which are correctly decoded by the decode
\                function.  Then it verifies that all versions of the encode
\                function produce identical results and all versions of the
\                decode function produce identical results.  The results of
\                each operation and any error that may occur are written
\                to stdout.

include lib/hamming.4th

\ emit a tab
: tab 9 emit ;

\ verify that decode is the reverse of encode
." Verifying Matched Encode/Decode ..." cr
." Value" tab ." Encoded" tab ." Decoded" cr

DATA_VALUES 0 do
  i HammingMatrixEncode dup HammingMatrixDecode
  dup i <> if ." ** Error decoding " i . cr then
  i . swap tab . tab . cr
loop

\ verify that all versions of encode produce the same results
cr ." Verifying Encodes Match ..." cr
." Value" tab ." Matrix" tab ." Table" cr

DATA_VALUES 0 do
  i HammingTableEncode i HammingMatrixEncode 
  over over <> if ." ** Error encoding " i . cr then
  i . tab . tab . cr
loop

\ verify that all versions of decode produce the same results
cr ." Verifying Decodes Match ..." cr
." Value" tab ." Matrix" tab ." Table" tab ." Packed" cr

CODE_VALUES 0 do
  i HammingPackTableDecode i HammingTableDecode i HammingMatrixDecode
  >r over over <> over r@ <> or r> swap if ." ** Error decoding " i . cr then
  i . tab . tab . tab . cr
loop

\ verify that all single bit errors are corrected
cr ." Verifying Single Bit Errors Are Corrected ..." cr
." Value" tab ." Encoded" tab ." Error" tab ." Decoded" cr

DATA_VALUES 0 do
  i HammingMatrixEncode 1
  begin
    dup 128 <
  while
    over over xor dup HammingMatrixDecode
    dup i <> if ." ** Error decoding " over . cr then
    >r >r 1 lshift over r> r> swap rot
    i . tab . tab . tab . cr
  repeat drop drop
loop
