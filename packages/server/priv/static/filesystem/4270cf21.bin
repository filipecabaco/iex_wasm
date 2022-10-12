\ 4tH library - STOOGE SORT - Copyright 2013 J.L. Bezemer
\ You can redistribute this file and/or modify it under
\ the terms of the GNU General Public License

\ Stooge sort is a recursive sorting algorithm. The running time of the
\ algorithm is extremely slow compared to efficient sorting algorithms,
\ such as Merge sort, and is even slower than Bubble sort, a canonical
\ example of a fairly inefficient and simple sort.

\ void StoogeSort(int a[], int i, int j) 
\ {
\    int t;
\    if (a[j] < a[i]) SWAP(a[i], a[j]);
\    if (j - i > 1)
\    {
\        t = (j - i + 1) / 3;
\        StoogeSort(a, i, j - t);
\        StoogeSort(a, i + t, j);
\        StoogeSort(a, i, j - t);
\    }
\ }

[UNDEFINED] sort     [IF]
[UNDEFINED] precedes [IF]
  defer precedes                       \ compatible with QSORT
[THEN]

: (stoogesort)                         ( a n1 n2 --)
  rot >r over cells r@ + over cells r@ + over @ over @ over over swap precedes
  if >r swap ! r> swap ! else drop drop drop drop then
  over over swap - 1+ dup 2 >          \ swap if needed, anything left to sort
  if                                   \ if so, recurse three times
    r> swap 3 / >r swap >r swap
    over over r@ r'@ - recurse         \ a, i, j - t
    over over r'@ + r@ recurse         \ a, i + t, j
    r> r> - recurse exit               \ allow for tail recursion
  then                                 \ if not, clean up stack
  r> drop drop drop drop
;

: sort 0 swap 1- (stoogesort) ;        ( a n --)

[DEFINED] 4TH# [IF]
  hide (stoogesort)
[THEN]
[THEN]
