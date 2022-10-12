\       emu6502.f
\       A simple 6502 emulation benchmark
\       /Mic, 2004


\       Only 11 opcodes are implemented. The memory layout is as follows:

\                2 kB RAM at 0000-07ff, mirrored throughout 0800-7fff
\               16 kB ROM at 8000-bfff, mirrored at c000

 2048 buffer: ram
16384 buffer: rom
variable cycle

\ 6502 registers
variable reg-a
variable reg-x
variable reg-y
variable reg-s
variable reg-pc

\ 6502 flags
variable flag-c
variable flag-n
variable flag-z
variable flag-v

[hex]

: w@ dup c@ swap char+ c@ 8 lshift or ;
: cs@ c@ dup 080 and if 100 - then ;

: read-byte ( address -- )
        dup 08000 < if
                07FF and ram + c@
        else
                03FFF and rom + c@
        then
        ;

: read-word ( address -- )
        dup 08000 < if
                07FF and ram + w@
        else
                03FFF and rom + w@
        then
        ;

: execute-until ( threshold -- )        \ Keep executing 6502 code until cycle >= threshold
        begin
        cycle @ over < while

                reg-pc @ 03fff and rom + c@ 1 reg-pc +!
                case

                \ JMP aaaa
                04C of
                        reg-pc @ 03fff and rom + w@ reg-pc !
                        3 cycle +!
                        endof

                \ LDA aa
                0A5 of
                        reg-pc @ 03fff and rom + c@ ram + c@ dup dup reg-a !
                        flag-z ! 080 and flag-n !
                        1 reg-pc +!
                        3 cycle +!
                        endof

                \ STA aa
                085 of
                        reg-a @ reg-pc @ 03fff and rom + c@ ram + c!
                        1 reg-pc +!
                        3 cycle +!
                        endof

                \ BEQ <aa
                0F0 of
                        flag-z @ 0= if
                                reg-pc @ 03fff and rom + cs@ 1+ reg-pc +!
                        else
                                1 reg-pc +!
                        then
                        3 cycle +!
                        endof

                \ BNE <aa
                0D0 of
                        flag-z @ if
                                reg-pc @ 03fff and rom + cs@ 1+ reg-pc +!
                        else
                                1 reg-pc +!
                        then
                        3 cycle +!
                        endof

                \ LDA #aa
                0A9 of
                        reg-pc @ 03fff and rom + c@ dup dup reg-a !
                        flag-z ! 080 and flag-n !
                        1 reg-pc +!
                        2 cycle +!
                        endof

                \ DEX
                0CA of
                        reg-x @ 1- 0FF and dup dup reg-x !
                        flag-z ! 080 and flag-n !
                        2 cycle +!
                        endof

                \ DEY
                088 of
                        reg-y @ 1- 0FF and dup dup reg-y !
                        flag-z ! 080 and flag-n !
                        2 cycle +!
                        endof

                \ INC aa
                0E6 of
                        reg-pc @ 03fff and rom + c@ ram + dup c@ 1+ 0FF and tuck swap c! dup
                        flag-z ! 080 and flag-n !
                        1 reg-pc +!
                        3 cycle +!
                        endof

                \ LDY #aa
                0A0 of
                        reg-pc @ 03fff and rom + c@ dup dup reg-y !
                        flag-z ! 080 and flag-n !
                        1 reg-pc +!
                        2 cycle +!
                        endof

                \ LDX #aa
                0A2 of
                        reg-pc @ 03fff and rom + c@ dup dup reg-x !
                        flag-z ! 080 and flag-n !
                        1 reg-pc +!
                        2 cycle +!
                        endof

                endcase
        repeat
        drop ;



\ Store some 6502 code
offset code
  0A9 c, 000 c,         \ start: LDA #0
  085 c, 008 c,         \ STA 08
  0A2 c, 00A c,         \ LDX #10
  0A0 c, 00A c,         \ loop1: LDY #10
  0E6 c, 008 c,         \ loop2: inc 08
  088 c,                \ DEY
  0D0 c, 0FB c,         \ BNE loop2
  0CA c,                \ DEX
  0D0 c, 0F6 c,         \ BNE loop1
  04C c, 000 c, 080 c,  \ JMP start

\ Initialize the 6502 program counter
: init-vm 13 0 do i code rom i chars + c! loop 0 cycle ! 08000 reg-pc ! ;

[decimal]
init-vm

\ Execute 200,000,000 cycles
." Executing 200,000,000 cycles..." cr cr
time 200000000 execute-until

\ Print execution speed
." Emulation speed was " time swap - 20000 swap / <# # # [char] . hold #s #> type ."  MHz" cr cr

hex
." 6502 state" cr
." ==========" cr
." PC: " reg-pc @ . cr
." A:  " reg-a  @ . cr
." X:  " reg-x  @ . cr
." Y:  " reg-y  @ . cr
