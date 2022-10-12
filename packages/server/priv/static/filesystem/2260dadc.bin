\ n TO (OFFSET) will shift the centre-line of the displayed waveform.
\ n TO AMPLITUDE will adjust the scaling
\ CYCLE will produce one waveform cycle
\ n CYCLES will perform n cycles.

\ It will always stop at the end of a completed cycle.

\ Sample Code by Paul E. Bennett, 2014
\ 4tH version by Hans Bezemer, 2014

\ This code generates a sine-wave to the screen displayed as a star character
\ eat a distance from th left hand edge proportional to the amplitude of that
\ point of the sine wave.

include lib/anscore.4th

: (DDA)                                ( S: sin\cos -- sin'\cos' )
( This code is the main sine wave generator )
  over over 256 / >r 256 / - swap r> + swap
;

2 ARRAY (sine)

: SINE (sine) DUP 2@ (DDA) ROT 2! ;

: DDA-RESET                            \ S: 'addr --
  32768 0 rot 2!
;

(sine) DDA-RESET

\ **************************************************************
\ Screen Oscilloscope Functions
\ This lexicon is for a single channel Oscilloscope function that
\ takes a value and plots the wave-form to the screen. The plotted
\ character is an asterix.
\ **************************************************************

36 VALUE (OFFSET)
32 VALUE AMPLITUDE

: level                                ( S: n -- 'n )
( This code adjusts the scale of the signal to ensure it will be in )
( range for printing to screen )
  AMPLITUDE 32768 */ (OFFSET) + 0 MAX
;
 
: .scope                               ( S: n -- )
( This code is the portion that plots the text on the screen at the )
( appropriate distance from the left hand edge )
  cr level spaces ." *"
;

: chunk                                ( S: -- )
( This performs several blind cycles to reduce the height of screen )
( over which the waveform is displayed. )
  35 0 do SINE loop
;

: cycle                                ( S: -- )
\ Perform one full cycle
  46 0 
  do  chunk                            \ 46 * 35 = 1610; the no. of steps in full cycle.
    (sine) @ 
    .scope
  loop
  (sine) DDA-RESET
;

: cycles                               ( S: n -- )
( Displays the n cycles of the sine wave )
  0 do cycle loop cr
;

5 cycles