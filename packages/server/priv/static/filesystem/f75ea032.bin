\ 4tH library - SHELLSORT - Copyright 2011,2012 J.L. Bezemer
\ You can redistribute this file and/or modify it under
\ the terms of the GNU General Public License

\ void shell_sort (int *a, int n) {
\    int h, i, j, k;
\    for (h = n; h /= 2;) {
\        for (i = h; i < n; i++) {
\            k = a[i];
\            for (j = i; j >= h && k < a[j - h]; j -= h) {
\                a[j] = a[j - h];
\            }
\            a[j] = k;
\        }
\    }
\ }

[UNDEFINED] sort     [IF]

[DEFINED] A033622 [IF]
create (shell-seq)                     \ see: http://oeis.org/A033622
  1073643521 , 603906049 , 268386305 , 150958081 , 67084289 , 37730305 ,
  16764929 , 9427969 , 4188161 , 2354689 , 1045505 , 587521 , 260609 ,
  146305 , 64769 , 36289 , 16001 , 8929 , 3905 , 2161 , 929 , 505 , 209 ,
  109 , 41 , 19 , 5 , 1 , 0 ,
[THEN]

[DEFINED] A108870 [IF]
create (shell-seq)                     \ see: http://oeis.org/A108870
  1147718700 , 510097200 , 226709866 , 100759940 , 44782196 ,  19903198 ,
  8845866 , 3931496 , 1747331 , 776591 , 345152 , 153401 , 68178 , 30301 ,
  13467 ,  5985 , 2660 , 1182 , 525 , 233 , 103 , 46 , 20 , 9 , 4 , 1 , 0 ,
[THEN]

[DEFINED] (shell-seq) [IF]
does> begin over over @c < while cell+ repeat ;
[THEN]

[UNDEFINED] precedes [IF]
defer precedes                         ( addr addr -- flag )
[THEN]                                 \ compatible with QSORT

: (shell)                              ( a n h -- a n h)
  over >r tuck                         ( a h n h)
  ?do                                  ( a h)
    i swap >r                          ( a j        R: h)
    2dup cells + @ -rot                ( k a j      R: h)
    begin                              ( k a j      R: h)
      dup r@ - dup >r 0< 0=            ( k a j f    R: h j-h)
    while                              ( k a j      R: h j-h)
      -rot over over r@ cells + @      ( j k a k v  R: h j-h)
      precedes >r rot r>               ( k a j f    R: h j-h)
    while                              ( k a j      R: h j-h)
      over r@ cells + @ >r             ( k a j      R: h j-h a[j-h])
      2dup cells + r> swap !           ( k a j      R: h j-h)
      drop r>                          ( k a j'     R: h)
    repeat                             ( k a j      R: h j-h)
[UNDEFINED] 4TH# [IF] then [THEN]
    rot >r 2dup cells +                ( a j a[j]   R: h j-h k)
    r> swap ! r> drop drop r>          ( a h)
  loop r> swap
;

[DEFINED] (shell-seq) [IF]
: sort                                 ( a n --)
  (shell-seq)                          \ set up the sequence and sort
  begin >r r@ @c dup while (shell) drop r> cell+ repeat
  r> drop drop 2drop                   \ clean up the stack
;
[ELSE]                                 ( a n --)
: sort dup begin 2/ dup while (shell) repeat drop 2drop ;
false constant (shell-seq)             \ vanilla shell sort
[THEN]                                 \ create dummy (shell-seq)

[DEFINED] 4TH# [IF]
  hide (shell)
  hide (shell-seq)
[THEN]
[THEN]
