\ 4tH pipes and files demonstration program
\ Copyright 2002,2008 J.L. Bezemer

file ls                                \ handle for 'ls'
file 4tH                               \ handle for the 4tH files
file dump                              \ handle for the output file
                                       \ open a pipe to 'ls'
s" ls *.4th" input pipe + open error? abort" Can't open pipe" to ls
                                       \ open the output file
s" doubleoutput.txt" output open error? abort" Can't open output" to dump
dump use                               \ use the output file for output

begin
  ls use                               \ use the pipe for input
  refill                               \ read the 4tH file name
while                                  \ write its name to the output file
  0 parse over over ." >>>" type cr
  input open error? abort" Can't open file" to 4tH

  4tH use                              \ now use the 4tH file for input
  begin
    refill                             \ read a line of the 4tH file
  while
    0 parse type cr                    \ write it to the output file
  repeat
  4tH close                            \ all read, now close the 4tH file

repeat                                 \ read the next 4tH filename

ls   close                             \ all files done, now close the pipe
dump close                             \ and the output file
                                       \ note that all standard channels are
." *** DONE ***" cr                    \ restored, so this appears on screen



