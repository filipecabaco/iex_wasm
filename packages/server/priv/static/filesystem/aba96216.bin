\ Taken from http://rosettacode.org 
\ 4tH version 2011, Hans Bezemer

include lib/files.4th
include lib/toolfile.4th
include lib/range.4th

\ Open a text file and count the occurrences of each letter

32 1024 * constant /buffer             \ SLURP buffer size
/buffer buffer: buffer                 \ SLURP buffer
26 array counts                        \ frequency array

: freq                                 ( buffer -- )
  counts 26 bounds do 0 i ! loop bounds
  ?do
    i c@ 32 or [char] a -
    dup 0 26 within if cells counts + 1 swap +! else drop then
  loop
  26 0 do
    [char] a i + emit  ." : "
    counts i cells + ? cr
  loop ;

: freqfile
  argn 2 < abort" Usage: freqfile file"
  1 args size error? abort" Cannot determine file size"
  dup /buffer > abort" File too big"
  buffer swap 1 args slurp abort" Cannot read file" freq
;

freqfile
