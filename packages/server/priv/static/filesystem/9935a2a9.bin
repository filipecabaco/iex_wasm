\ First published by David Sands, CEO at ST Robotics in LinkedIn, 2013
\ Believed to be in the Public Domain

\ One typical computing element is the integrator. A neat demonstration would
\ be generation of a sinewave. Imagine you are inputting a sinewave. Integral
\ of sin(x) is -cos(x). Integrate that you get -sin(x). Invert it for sin(x)
\ which is what you started with. Connect the output to the input and hey
\ presto: you get a sinewave. It's the fundamental principal behind positive
\ feedback. But how would it be done with digital computers? I could not find
\ out.

\ So as an experiment I simulated the above function in Forth. An integrator
\ is, after all, only successive addition of the input. It should be easy to
\ code and connect several elements. The time scale has to be just successive
\ loops. To connect one element to the next?

\ Obviously the stack. The final value is then the input value for the next
\ loop. Here is my code for you to try. Really simple. DISP just spaces along
\ the screen and prints an asterisk. V1 and V2 hold the current values in the
\ two integrators. Added some scaling factors for presentability.

DECIMAL
VARIABLE V1
VARIABLE V2

: INT1 V1 +! V1 @ ;
: INT2 V2 +! V2 @ ;
: INV 0 SWAP - ;
: FUNC INT1 INT2 INV 20 / ;
: DISP CR 40 + 0 DO SPACE LOOP 42 EMIT ;
: INIT 0 V1 ! 0 V2 ! ;

: TEST
  INIT 150
  29 0 DO FUNC DUP DISP LOOP
  DROP CR
;

TEST