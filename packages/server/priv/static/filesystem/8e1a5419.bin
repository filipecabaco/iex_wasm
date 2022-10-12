\ example of how to do graphics by outputting Postscript (to Ghostscript)

\ This program is in the public domain.  No Warranty.
\ Author: Anton Ertl
\ 4tH conversion: Hans Bezemer

\ this example just draws a sine wave.  You could also do this
\ directly in Postscript.

\ For learning Postscript, look at the appropriate books or websites;
\ this program only uses very little and the comments don't explain
\ that.


include lib/zenfloat.4th
include lib/zenferf.4th
include lib/zenans.4th
include lib/zenfpio.4th

: init-ps
    ." %!PS-Adobe-3.0" cr
    ." %%Creator: 4tH" cr
    ." %%Title: ErfWave" cr
    ." %%Orientation: Portrait" cr
    ." %%Pages: 1" cr
    ." %%PageOrder: Ascend" cr
    ." %%EndComments" cr
    ." %!" cr
    ." 0.3 setlinewidth 0 setgray " cr ;

0 value point-set?

: data2coord ( f: rx f: ry -- rx1 ry1 )
    \ transform from our data to Postscript coordinates
    fswap 20 s>f f* 250 s>f f+ fswap
    100 s>f f* 150 s>f f+ ;

: next-point ( f: rx f: ry -- )
    fswap f. f.
    point-set? if
        ." lineto" cr
    else
        ." moveto" cr 1 to point-set?
    then ;

: finish-line ( -- )
    \ only stroke actually draws the line, so this is a good time to
    \ flush the output: earlier there is little effect, later delays
    \ displaying the line
    ." stroke" cr
    0 to point-set? ;

: nextpage ( -- )
    \ also clears the canvas
    ." showpage" cr cr ;

: erf-lines ( -- )
    100 -100 do
        i s>f 10 s>f f/ fdup ferf data2coord next-point
    loop ;

: erf-graph ( -- )
    init-ps erf-lines finish-line ;

\ We could now do the following to get postscript output (e.g., for
\ redirecting it to a file or a printer):
erf-graph
nextpage
