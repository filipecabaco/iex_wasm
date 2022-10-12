\ Five sailors are shipwrecked on an island and collect a large pile of
\ coconuts during the day. That night the first sailor wakes up and decides
\ to take his first share early so tries to divide the pile of coconuts
\ equally into five piles but finds that there is one coconut left over,
\ so he tosses it to a monkey and then hides "his" one of the five equally
\ sized piles of coconuts and pushes the other four piles together to form
\ a single visible pile of coconuts again and goes to bed.

\ To cut a long story short, each of the sailors in turn gets up once during
\ the night and performs the same actions of dividing the coconut pile into
\ five, finding that one coconut is left over and giving that single remainder
\ coconut to the monkey.

\ In the morning (after the surreptitious and separate action of each of the
\ five sailors during the night), the remaining coconuts are divided into five
\ equal piles for each of the sailors, whereupon it is found that the pile of
\ coconuts divides equally amongst the sailors with no remainder. (Nothing for
\ the monkey in the morning.)

\ 1. Calculate the minimum possible size of the initial pile of coconuts
\    collected during the first day.
\ 2. Use a method that assumes an answer is possible, and then applies the
\    constraints of the tale to see if it is correct. (I.e. no applying some
\    formula that generates the correct answer without integer divisions and
\    remainders and tests on remainders; but constraint solvers are allowed.)
\ 3. Calculate the size of the initial pile of coconuts if six sailors were
\    marooned and went through a similar process (but split into six piles
\    instead of five of course).

: total
  over * over 1- rot 0 ?do
    over over mod if dup xor swap leave else over over / 1+ rot + swap then
  loop drop
;

: sailors
  1+ 2 ?do
    1 begin i over total dup 0= while drop 1+ repeat i 0 .r ." : " . . cr
  loop
;

9 sailors

