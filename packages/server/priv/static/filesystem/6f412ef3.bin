\ *** RfD: N>R and NR>
\ *** 4 February 2009, Stephen Pelc

[UNDEFINED] N>R [IF]
: N>R                                  \ xn .. x1 N -- ; R: -- x1 .. xn n
\ Transfer N items and count to the return stack.
  dup                                  \ xn .. x1 N N --
  begin
    dup
  while
    rot r> swap >r >r                  \ xn .. N N -- ; R: .. x1 --
    1-                                 \ xn .. N 'N -- ; R: .. x1 --
  repeat
  drop                                 \ N -- ; R: x1 .. xn --
  r> swap >r >r
;

: NR>                                  \ -- xn .. x1 N ; R: x1 .. xn N --
\ Pull N items and count off the return stack.
  r> r> swap >r dup
  begin
    dup
  while
    r> r> swap >r -rot
    1-
  repeat
  drop
;
[THEN]
