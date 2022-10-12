include lib/time.4th
include lib/i18n.4th
                                       \ define language codes
create languages ," en" ," nl" ," de" ," fr"
here languages - constant #languages   \ calculate number of language
                                       \ order assets by language!
create day.name                        ( day -- a n)
  ," Monday"    ," Tuesday"  ," Wednesday" ," Thursday"   ," Friday"
  ," Saturday"  ," Sunday"
  ," maandag"   ," dinsdag"  ," woensdag"  ," donderdag"  ," vrijdag"
  ," zaterdag"  ," zondag"
  ," Montag"    ," Dienstag" ," Mittwoch"  ," Donnerstag" ," Freitag"
  ," Sonnabend" ," Sonntag"
  ," lundi"     ," mardi"    ," mercredi"  ," jeudi"      ," vendredi"
  ," samedi"    ," dimanche"
does> i18n.lang 7 * th swap 0 max 6 min th @c count ;
                                       \ language defines table offset
create MSG.TODAY                       \ select day relative to offset
  ," Today is %DAY%."
  ," Vandaag is het %DAY%."
  ," Heute ist %DAY%."
  ," Aujourd'hui c'est %DAY%."

languages #languages i18n.languages    \ declare languages to i18n
s" LANGUAGE" environ@ i18n.select drop to i18n.lang
                                       \ get the weekday
time tz posix>jday 7 mod day.name s" DAY" i18n.set
MSG.TODAY i18n.msg type cr             \ expand the message and type it
i18n.reset                             \ shut the i18n subsystem down

