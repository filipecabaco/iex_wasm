\ Taken from http://rosettacode.org 
\ 4tH version 2011,2012  Hans Bezemer
false constant shared-fp

shared-fp [IF]
  include lib/fp2.4th
[ELSE]
  include lib/fp4.4th
[THEN]

include lib/statist.4th

fclear 100 set-precision

/st_var array stats
stats st.clear

2 s>f stats st.add
4 s>f stats st.add
4 s>f stats st.add
4 s>f stats st.add
5 s>f stats st.add
5 s>f stats st.add
7 s>f stats st.add
9 s>f stats st.add
 
stats st.stddev f. cr                  \ 2.

stats st.clear

11 1 do i s>f stats st.add loop
stats st.amean f. cr                   \ 5.5
stats st.hmean f. cr                   \ 3.41417152147406
stats st.gmean f. cr                   \ 4.52872868811677
stats st.rms   f. cr                   \ 6.20484
