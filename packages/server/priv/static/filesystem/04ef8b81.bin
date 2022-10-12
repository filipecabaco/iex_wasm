/**
 * Name: f90
 * Description: Fortran90 programming language.
 * Author: David Bowler <david.bowler@ucl.ac.uk>
 * 
 * Copyright (C) 2009  Free Software Foundation, Inc.
 */

/**
 * Deal with strings enclosed with '...'
 */
state f90_string_single extends Highlight
{
  /[\']/ {
    language_print ($0);
    return;
  }
  LANGUAGE_SPECIALS {
    language_print ($0);
  }
}

/**
 * Deal with strings enclosed with "..."
 */
state f90_string_double extends Highlight
{
  /[\"]/ {
    language_print ($0);
    return;
  }
  LANGUAGE_SPECIALS {
    language_print ($0);
  }
}

/**
 * Deal function/subroutine declarations and subroutine calls: end with ) at end of line or then comment
 */
state f90_func extends Highlight
{
  /\)[ \t]*$/ {
    language_print ($0);
    return;
  }
  /(\)[ \t]*)(![a-zA-Z_0-9\,\.\(\)\*\%\: \t]*)/ {
    language_print ($1);
    comment_face (true);
    language_print($2);
    call (eat_one_line);
    comment_face (false);
    return;
  }
  LANGUAGE_SPECIALS {
    language_print ($0);
  }
}

/**
 * Highlight variable declarations
 */
state f90_new_var_list extends Highlight
{
  /* Catch variable names followed by a comment: 1. Continuation marker present */
  /([ \t]*::|[ \t]+)([a-zA-Z_0-9\,\.\(\)\*\%\: \t]+[^\&][ \t]*)(\&[ \t]*)(![a-zA-Z_0-9\,\.\(\)\*\%\: \t]*)/ {
    language_print ($1);
    variable_name_face(true);
    language_print ($2);
    language_print ($3);
    variable_name_face(false);
    comment_face (true);
    language_print ($4);
    call (eat_one_line);
    comment_face (false);
  }
  /* Catch variable names followed by a comment: 2. No continuation marker (so return)*/
  /([ \t]*::|[ \t]+)([a-zA-Z_0-9\,\.\(\)\*\%\: \t]+[^\&][ \t]*)(![a-zA-Z_0-9\,\.\(\)\*\%\: \t]*)/ {
    language_print ($1);
    variable_name_face(true);
    language_print ($2);
    variable_name_face(false);
    comment_face (true);
    language_print ($3);
    call (eat_one_line);
    comment_face (false);
    return;
  }
  /* Is this a specifier ? 1. real(var) ? */
  /(\([ \t]*)([a-zA-Z0-9_]+)([ \t]*\))/{
    language_print($0);
  }
  /* Is this a specifier ? 2. real(kind=var) */
  /(\([ \t]*)(len|kind)([a-zA-Z0-9_ =]+)(\))/{
    language_print($1);
    keyword_face(true);
    language_print($2);
    keyword_face(false);
    language_print($3);
    language_print($4);
  }
  /* Is this a specifier ? 3. real(kind=selected_real_kind(6,90)) */
  /(\([ \t]*)(len|kind)([ \t]*=[ \t]*)(selected_(int_kind|real_kind))([ \t]*\([ \t]*[0-9\,]+[ \t]*\)[ \t]*)(\))/{
    language_print($1);
    keyword_face(true);
    language_print($2);
    keyword_face(false);
    language_print($3);
    keyword_face(true);
    language_print($4);
    keyword_face(false);
    language_print($6);
    language_print($7);
  }
  /* Highlight modifiers 
     (build-re '(allocatable Allocatable ALLOCATABLE external External EXTERNAL
      intent Intent INTENT optional Optional OPTIONAL parameter Parameter PARAMETER pointer Pointer POINTER 
      private Private PRIVATE public Public PUBLIC save SAVE Save target TARGET Target))
  */
  /(\,[ \t]*)(A(LLOCATABLE|llocatable)|E(XTERNAL|xternal)|I(NTENT|ntent)\
|O(PTIONAL|ptional)\
|P(ARAMETER|OINTER|RIVATE|UBLIC|arameter|ointer|rivate|ublic)\
|S(AVE|ave)|T(ARGET|arget)|allocatable|external|intent|optional\
|p(arameter|ointer|rivate|ublic)|save|target)/ {
    language_print($1);
    keyword_face(true);
    language_print($2);
    keyword_face(false);
  }
  /(\,[ \t]*)(D(IMENSION|imension)|dimension)([ \t]*\([ \:\,\-+*a-zA-Z_0-9]+[ \t]*\))/ {
    language_print($1);
    keyword_face(true);
    language_print($2);
    keyword_face(false);
    language_print($4);
  }
  /* Highlight variable names up to continuation marker */
  /([ \t]*::|[^\,\(][ \t]*)([a-zA-Z_0-9]+[a-zA-Z_0-9\,\.\(\)\*\%\:\+\- \t]+[\&][ \t]*)$/ {
    language_print ($1);
    variable_name_face(true);
    language_print ($2);
    variable_name_face(false);
  }
  /* Highlight variable names up to end of line (no continuation marker: return) */
  /([ \t]*::|[^\,\(][ \t]*)([a-zA-Z_0-9]+[a-zA-Z_0-9\,\.\(\)\*\%\:\+\- \t]*[^\&][ \t]*)$/ {
    language_print ($1);
    variable_name_face(true);
    language_print ($2);
    variable_name_face(false);
    return;
  }
  /* Highlight variable names up to equals sign (return after equals)*/
  /([ \t]*::|[^\,\(][ \t]*)([a-zA-Z_0-9]+[a-zA-Z_0-9\,\.\(\)\*\%\:\+\- \t]*[^\&])([ \t]*=)/ {
    language_print ($1);
    variable_name_face(true);
    language_print ($2);
    variable_name_face(false);
    language_print ($3);
    return;
  }
  LANGUAGE_SPECIALS {
    language_print ($0);
  }
}

/**
 * Highlight F90 io statements
 */
state f90_io extends Highlight
{
  /* Catch comments */
  /[!]/ {
    comment_face (true);
    language_print ($0);
    call (eat_one_line);
    comment_face (false);
  }
  /* String constants. */
  /[\'][^\)]/ {
    string_face (true);
    language_print ($0);
    call (f90_string_single);
    string_face (false);
  }
  /[\"][^\)]/ {
    string_face (true);
    language_print ($0);
    call (f90_string_double);
    string_face (false);
  }

  /* This terminates an io statement */
  /\)[^\'\"]/ {
    language_print ($0);
    return;
  }

  /* IO Keywords.  (build-re '(FMT UNIT REC END ERR FILE STATUS
     ACCESS FORM RECL BLANK IOSTAT EXIST OPENED NUMBER NAME
     SEQUENTIAL DIRECT FORMATTED UNFORMATTED NEXTREC)) */
  /\b(ACCESS|BLANK|DIRECT|E(ND|RR|XIST)|F(ILE|MT|ORM(|ATTED))|IOSTAT\
      |N(AME|EXTREC|UMBER)|OPENED|REC(|L)|S(EQUENTIAL|TATUS)\
      |UN(FORMATTED|IT))\b/ {
    keyword_face (true);
    language_print ($0);
    keyword_face (false);
  }

  /* IO Keywords.  (build-re '(fmt unit rec end err file 
     status access form recl blank iostat exist 
     opened number name sequential direct 
     formatted unformatted nextrec)) */
  /\b((a|A)ccess|(b|B)lank|(d|D)irect|(e|E)(nd|rr|xist)|(f|F)(ile|mt|orm(|atted))|(i|I)ostat\
      |(n|N)(ame|extrec|umber)|(o|O)pened|(r|R)ec(|l)|(s|S)(equential|tatus)\
      |(u|U)n(formatted|it))\b/ {
    keyword_face (true);
    language_print ($0);
    keyword_face (false);
  }
  LANGUAGE_SPECIALS {
    language_print ($0);
  }
}

state f90 extends HighlightEntry
{
  BEGIN {
    header ();
  }
  END {
    trailer ();
  }

  /* String constants. */
  /[\']/ {
    string_face (true);
    language_print ($0);
    call (f90_string_single);
    string_face (false);
  }
  /[\"]/ {
    string_face (true);
    language_print ($0);
    call (f90_string_double);
    string_face (false);
  }
  /* Labels - whitespace followed by number at start of line */
  /^[ \t]*[0-9]+/{
    keyword_face(true);
    language_print ($0);
    keyword_face(false);
  }
  /* Comments. We'll only have free-form, modern f90 statements - ! to end of line*/
  /[!]/ {
    comment_face (true);
    language_print ($0);
    call (eat_one_line);
    comment_face (false);
  }
  /* builtins - maths, matrices etc */
/* Builtins.
  (build-re '(abs achar acos adjustl adjustr aimag aint all allocated
   anint any asin associated atan atan2 bit_size btest
   ceiling char cmplx conjg cos cosh count cshift
   date_and_time dble digits dim dot_product dprod eoshift
   epsilon exp exponent floor fraction huge iachar iand
   ibclr ibits ibset ichar ieor index int ior ishft
   ishftc kind lbound len len_trim lge lgt lle llt log
   logical log10 matmul max maxexponent maxloc maxval merge
   min minexponent minloc minval mod modulo mvbits nearest
   nint not pack precision present product radix
   random_number random_seed range real repeat reshape
   rrspacing scale scan selected_int_kind selected_real_kind
   set_exponent shape sign sin sinh size spacing spread
   sqrt sum system_clock tan tanh tiny transfer transpose
   trim ubound unpack verify))
  */
  /\b((a|A)(bs|c(har|os)|djust(l|r)|i(mag|nt)|ll(|ocated)|n(int|y)|s(in|sociated)\
|tan(|2))\
|(b|B)(it_size|test)|(c|C)(eiling|har|mplx|o(njg|s(|h)|unt)|shift)\
|(d|D)(ate_and_time|ble|i(gits|m)|ot_product|prod)\
|(e|E)(oshift|psilon|xp(|onent))|(f|F)(loor|raction)|(h|H)uge\
|(i|I)(a(char|nd)|b(clr|its|set)|char|eor|n(dex|t)|or|shft(|c))|(k|K)ind\
|(l|L)(bound|en(|_trim)|g(e|t)|l(e|t)|og(|10|ical))\
|(m|M)(a(tmul|x(|exponent|loc|val))|erge|in(|exponent|loc|val)|od(|ulo)\
|vbits)\
|(n|N)(earest|int|ot)|(p|P)(ack|r(e(cision|sent)|oduct))\
|(r|R)(a(dix|n(dom_(number|seed)|ge))|e(al|peat|shape)|rspacing)\
|(s|S)(ca(le|n)|e(lected_(int_kind|real_kind)|t_exponent)|hape\
|i(gn|n(|h)|ze)|p(acing|read)|qrt|um|ystem_clock)\
|(t|T)(an(|h)|iny|r(ans(fer|pose)|im))|(u|U)(bound|npack)|(v|V)erify)\b/ {
    builtin_face (true);
    language_print ($0);
    builtin_face (false);
  }
/* Builtins.
  (build-re '(ABS ACHAR ACOS ADJUSTL ADJUSTR AIMAG AINT ALL ALLOCATED
   ANINT ANY ASIN ASSOCIATED ATAN ATAN2 BIT_SIZE BTEST
   CEILING CHAR CMPLX CONJG COS COSH COUNT CSHIFT
   DATE_AND_TIME DBLE DIGITS DIM DOT_PRODUCT DPROD EOSHIFT
   EPSILON EXP EXPONENT FLOOR FRACTION HUGE IACHAR IAND
   IBCLR IBITS IBSET ICHAR IEOR INDEX INT IOR ISHFT
   ISHFTC KIND LBOUND LEN LEN_TRIM LGE LGT LLE LLT LOG
   LOGICAL LOG10 MATMUL MAX MAXEXPONENT MAXLOC MAXVAL MERGE
   MIN MINEXPONENT MINLOC MINVAL MOD MODULO MVBITS NEAREST
   NINT NOT PACK PRECISION PRESENT PRODUCT RADIX
   RANDOM_NUMBER RANDOM_SEED RANGE REAL REPEAT RESHAPE
   RRSPACING SCALE SCAN SELECTED_INT_KIND SELECTED_REAL_KIND
   SET_EXPONENT SHAPE SIGN SIN SINH SIZE SPACING SPREAD
   SQRT SUM SYSTEM_CLOCK TAN TANH TINY TRANSFER TRANSPOSE
   TRIM UBOUND UNPACK VERIFY))
  */
  /\b(A(BS|C(HAR|OS)|DJUST(L|R)|I(MAG|NT)|LL(|OCATED)|N(INT|Y)|S(IN|SOCIATED)\
|TAN(|2))\
|B(IT_SIZE|TEST)|C(EILING|HAR|MPLX|O(NJG|S(|H)|UNT)|SHIFT)\
|D(ATE_AND_TIME|BLE|I(GITS|M)|OT_PRODUCT|PROD)\
|E(OSHIFT|PSILON|XP(|ONENT))|F(LOOR|RACTION)|HUGE\
|I(A(CHAR|ND)|B(CLR|ITS|SET)|CHAR|EOR|N(DEX|T)|OR|SHFT(|C))|KIND\
|L(BOUND|EN(|_TRIM)|G(E|T)|L(E|T)|OG(|10|ICAL))\
|M(A(TMUL|X(|EXPONENT|LOC|VAL))|ERGE|IN(|EXPONENT|LOC|VAL)|OD(|ULO)\
|VBITS)\
|N(EAREST|INT|OT)|P(ACK|R(E(CISION|SENT)|ODUCT))\
|R(A(DIX|N(DOM_(NUMBER|SEED)|GE))|E(AL|PEAT|SHAPE)|RSPACING)\
|S(CA(LE|N)|E(LECTED_(INT_KIND|REAL_KIND)|T_EXPONENT)|HAPE\
|I(GN|N(|H)|ZE)|P(ACING|READ)|QRT|UM|YSTEM_CLOCK)\
|T(AN(|H)|INY|R(ANS(FER|POSE)|IM))|U(BOUND|NPACK)|VERIFY)\b/ {
    builtin_face (true);
    language_print ($0);
    builtin_face (false);
  }

  LANGUAGE_SPECIALS {
    language_print ($0);
  }
  /* Comparators.  We have to roll by hand because of the
     dots - "\b" doesn't delimit here. */
  /\.((a|A)nd|(e|E)qv?|(g|G)(e|t)|(l|L)(e|t)|(n|N)e(qv)?|(n|N)ot|(o|O)r|(t|T)rue|(f|F)alse)\./ {
    keyword_face (true);
    language_print ($0);
    keyword_face (false);
  }

  /* Comparators.  We have to roll by hand because of the
     dots - "\b" doesn't delimit here. */
  /\.(AND|EQV?|G(E|T)|L(E|T)|NE(QV)?|NOT|OR|TRUE|FALSE)\./ {
    keyword_face (true);
    language_print ($0);
    keyword_face (false);
  }
  /* function, subroutine declaration or subroutine call: 1. with arguments*/
  /(^[ \t]*((c|C)all|(f|F)unction|(s|S)ubroutine)[ \t]+)([a-zA-Z_0-9]+)([ \t]*\()/ {
    keyword_face(true);
    language_print($1);
    keyword_face(false);
    function_name_face(true);
    language_print($6);
    function_name_face(false);
    language_print($7);
    call (f90_func);
  }
  /* function, subroutine declaration or subroutine call: 1. without arguments*/
  /(^[ \t]*((c|C)all|(f|F)unction|(s|S)ubroutine)[ \t]+)([a-zA-Z_0-9]+[ \t]*)$/ {
    keyword_face(true);
    language_print($1);
    keyword_face(false);
    function_name_face(true);
    language_print($6);
    function_name_face(false);
    language_print($7);
  }
  /* function, subroutine declaration or subroutine call*/
  /((CALL|FUNCTION|SUBROUTINE)[ \t]+)([a-zA-Z_0-9]+)([ \t]*\()/ {
    keyword_face(true);
    language_print($1);
    keyword_face(false);
    function_name_face(true);
    language_print($3);
    function_name_face(false);
    language_print($4);
    call (f90_func);
  }
  /* end function, subroutine declaration or subroutine call*/
  /(((e|E)nd)[ \t]*)(((c|C)all|(f|F)unction|(s|S)ubroutine)[ \t]+)([a-zA-Z_0-9]+)/ {
    keyword_face(true);
    language_print($1);
    language_print($4);
    keyword_face(false);
    function_name_face(true);
    language_print($9);
    function_name_face(false);
  }
  /* end function, subroutine declaration or subroutine call*/
  /((END)[ \t]*)((CALL|FUNCTION|SUBROUTINE)[ \t]+)([a-zA-Z_0-9]+)/ {
    keyword_face(true);
    language_print($1);
    language_print($3);
    keyword_face(false);
    function_name_face(true);
    language_print($5);
    function_name_face(false);
  }
  /* Module, program, use declaration */
  /(((e|E)nd)?[ \t]*)(((m|M)odule|(p|P)rogram|(u|U)se)[ \t]+)([a-zA-Z_0-9]+)/ {
    keyword_face(true);
    language_print($1);
    language_print($4);
    keyword_face(false);
    function_name_face(true);
    language_print($9);
    function_name_face(false);
  }
  /* Module, program, use declaration */
  /((END)?[ \t]*)((MODULE|PROGRAM|USE)[ \t]+)([a-zA-Z_0-9]+)/ {
    debug(concat("Strings: ",$0));
    debug(concat($1,"|"));
    debug(concat($2,"|"));
    debug(concat($3,"|"));
    debug(concat($4,"|"));
    debug(concat($5,"|"));
    debug(concat($6,"|"));
    keyword_face(true);
    language_print($1);
    language_print($3);
    keyword_face(false);
    function_name_face(true);
    language_print($5);
    function_name_face(false);
  }
  /* Function call */
  /* Unfortunately, as F90 uses round brackets for function calls and arrays, this breaks */
  /* /(=[ \t]*)([a-zA-Z_0-9]+)([ \t]*\()/{
    language_print($1);
    function_name_face(true);
    language_print($2);
    function_name_face(false);
    language_print($3);
  }*/
  /* Variable declaration */
  /^([ \t]*)((i|I)nteger|(r|R)eal|(c|C)omplex|(c|C)haracter|(l|L)ogical|([ \t]*(e|E)nd[ \t]*)?(t|T)ype)/ {
    type_face(true);
    language_print($0);
    type_face(false);
    call (f90_new_var_list);
  }
  /^([ \t]*)(INTEGER|REAL|COMPLEX|CHARACTER|LOGICAL|([ \t]*END[ \t]*)?TYPE)/ {
    type_face(true);
    language_print($0);
    type_face(false);
    call (f90_new_var_list);
  }
  /* none */
  /\bnone\b/ {
    type_face(true);
    language_print($0);
    type_face(false);
  }
  /* IO Statement (build-re '(open close read
  write inquire backspace endfile rewind )) */
  /\b((b|B)ackspace|(c|C)lose|(e|E)ndfile|(i|I)nquire|(o|O)pen|(r|R)e(ad|wind)|(w|W)rite)\b/ {

    keyword_face (true);
    language_print ($0);
    keyword_face (false);
    call (f90_io);
  }

  /* IO Statement (build-re '(OPEN CLOSE READ
  WRITE INQUIRE BACKSPACE ENDFILE REWIND )) */
  /\b(BACKSPACE|CLOSE|ENDFILE|INQUIRE|OPEN|RE(AD|WIND)|WRITE)\b/ {

    keyword_face (true);
    language_print ($0);
    keyword_face (false);
    call (f90_io);
  }

  /* Keywords */
  /* (build-re '(allocate allocatable assign assignment block
     case common contains
     continue cycle data deallocate dimension do double else
     elseif elsewhere end enddo endif entry equivalence
     exit external forall format goto if implicit
     include intent interface intrinsic module
     namelist none nullify only operator optional parameter
     pause pointer precision print private procedure program
     public recursive result return save select
     sequence stop subroutine target then use where
     while))
   */
  /\b((a|A)(llocat(able|e)|ssign(|ment))|(b|B)lock\
|(c|C)(ase|o(mmon|nt(ains|inue))|ycle)|(d|D)(ata|eallocate|imension|o(|uble))\
|(e|E)(lse(|if|where)|n(d(|do|if)|try)|quivalence|x(it|ternal))\
|(f|F)or(all|mat)|(g|G)oto|(i|I)(f|mplicit|n(clude|t(e(nt|rface)|rinsic)))\
|(m|M)odule\
|(n|N)(amelist|ullify)|(o|O)(nly|p(erator|tional))\
|(p|P)(a(rameter|use)|ointer|r(ecision|i(nt|vate)|o(cedure|gram))|ublic)\
|(r|R)e(cursive|sult|turn)|(s|S)(ave|e(lect|quence)|top|ubroutine)\
|(t|T)(arget|hen)|(u|U)se|(w|W)h(ere|ile))\b/ {
    keyword_face (true);
    language_print ($0);
    keyword_face (false);
  }
  /* (build-re '(ALLOCATE ALLOCATABLE ASSIGN ASSIGNMENT BLOCK
     CASE COMMON CONTAINS
     CONTINUE CYCLE DATA DEALLOCATE DIMENSION DO DOUBLE ELSE
     ELSEIF ELSEWHERE END ENDDO ENDIF ENTRY EQUIVALENCE
     EXIT EXTERNAL FORALL FORMAT GOTO IF IMPLICIT
     INCLUDE INTENT INTERFACE INTRINSIC MODULE
     NAMELIST NULLIFY ONLY OPERATOR OPTIONAL PARAMETER
     PAUSE POINTER PRECISION PRINT PRIVATE PROCEDURE PROGRAM
     PUBLIC RECURSIVE RESULT RETURN SAVE SELECT
     SEQUENCE STOP SUBROUTINE TARGET THEN USE WHERE
     WHILE))
   */
  /\b(A(LLOCAT(ABLE|E)|SSIGN(|MENT))|BLOCK\
|C(ASE|O(MMON|NT(AINS|INUE))|YCLE)|D(ATA|EALLOCATE|IMENSION|O(|UBLE))\
|E(LSE(|IF|WHERE)|N(D(|DO|IF)|TRY)|QUIVALENCE|X(IT|TERNAL))\
|FOR(ALL|MAT)|GOTO|I(F|MPLICIT|N(CLUDE|T(E(NT|RFACE)|RINSIC)))\
|MODULE\
|N(AMELIST|ULLIFY)|O(NLY|P(ERATOR|TIONAL))\
|P(A(RAMETER|USE)|OINTER|R(ECISION|I(NT|VATE)|O(CEDURE|GRAM))|UBLIC)\
|RE(CURSIVE|SULT|TURN)|S(AVE|E(LECT|QUENCE)|TOP|UBROUTINE)\
|T(ARGET|HEN)|USE|WH(ERE|ILE))\b/ {
    keyword_face (true);
    language_print ($0);
    keyword_face (false);
  }
  LANGUAGE_SPECIALS {
    language_print ($0);
  }
}



/*
Local variables:
mode: c
End:
*/
