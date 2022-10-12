include lib/fp3.4th
include lib/ttester.4th
include lib/fzeta.4th

s" 2e-16"  s>float rel-near f!         \ 32-bit precision
set-near fclear

\ 60 digit reference values computed by Marcel Hendrix
\ using MPFR/MPC version of zzeta.

t{  0 s>f fzeta  => s" -5.00000000000000e-01" s>float r}t
t{  2 s>f fzeta  => s" 1.6449340668482264364724151666460251892190e" s>float r}t
t{  3 s>f fzeta  => s" 1.2020569031595942853997381615114499907651e" s>float r}t
t{  4 s>f fzeta  => s" 1.0823232337111381915160036965411679027749e" s>float r}t
t{  5 s>f fzeta  => s" 1.0369277551433699263313654864570341680573e" s>float r}t
t{  6 s>f fzeta  => s" 1.0173430619844491397145179297909205279018e" s>float r}t
t{  7 s>f fzeta  => s" 1.0083492773819228268397975498497967595993e" s>float r}t
t{  8 s>f fzeta  => s" 1.0040773561979443393786852385086524652574e" s>float r}t
t{  9 s>f fzeta  => s" 1.0020083928260822144178527692324120604826e" s>float r}t
t{ 10 s>f fzeta  => s" 1.0009945751278180853371459589003190170015e" s>float r}t
t{ 11 s>f fzeta  => s" 1.0004941886041194645587022825264699364626e" s>float r}t
t{ 12 s>f fzeta  => s" 1.0002460865533080482986379980477396709530e" s>float r}t
t{ 13 s>f fzeta  => s" 1.0001227133475784891467518365263573957058e" s>float r}t
t{ 14 s>f fzeta  => s" 1.0000612481350587048292585451051353337383e" s>float r}t
t{ 15 s>f fzeta  => s" 1.0000305882363070204935517285106450625779e" s>float r}t
t{ 16 s>f fzeta  => s" 1.0000152822594086518717325714876367220132e" s>float r}t
t{ 17 s>f fzeta  => s" 1.0000076371976378997622736002935630292028e" s>float r}t
t{ 18 s>f fzeta  => s" 1.0000038172932649998398564616446219397200e" s>float r}t
t{ 19 s>f fzeta  => s" 1.0000019082127165539389256569577951013428e" s>float r}t
t{ 20 s>f fzeta  => s" 1.0000009539620338727961131520386834493354e" s>float r}t

\ need some reference values for points off the real axis. km,20120502
