\ 4tH - Generator demo - Copyright 2014 J.L. Bezemer
\ You can redistribute this file and/or modify it under
\ the terms of the GNU General Public License

\ In computer science, a generator is a special routine that can be used to
\ control the iteration behaviour of a loop. A generator is very similar to
\ a function that returns an array, in that a generator has parameters, can
\ be called, and generates a sequence of values. However, instead of building
\ an array containing all the values and returning them all at once, a
\ generator yields the values one at a time, which requires less memory and
\ allows the caller to get started processing the first few values immediately.
\ In short, a generator looks like a function but behaves like an iterator.

\ Generators can be implemented in terms of more expressive control flow
\ constructs, such as coroutines or first-class continuations. Generators,
\ also known as semicoroutines, are a special case of (and weaker than)
\ coroutines, in that they always yield control back to the caller (when
\ passing a value back), rather than specifying a coroutine to jump to.

\ Note that .FIB may not disturb the stack and return it to FIB in an
\ unchanged condition!! The R> DROP is required to avoid returning to
\ the caller (which is FIB at termination).

[DEFINED] useyieldlib [IF]
include lib/yield.4th

: fib 0 1 yield begin dup rot + yield again ;
: .fib fib begin dup 100 < while dup . yield repeat drop drop grab [FORCE] ;
[ELSE]                                 ( -- n)
: fib 0 1 r> execute begin dup rot + r> execute again ;
: .fib fib begin dup 100 < while dup . r> execute repeat drop drop r> drop ;
[THEN]

: .fibs 0 ?do .fib cr loop ;           ( --)
5 .fibs
