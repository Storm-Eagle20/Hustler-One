small = [
    /free/gi,
    /nitro(?! ?man)/gi,
    /cs:? ?go/gi,
    /trade/gi,
    /skins/gi,
    /knife/gi,
    /steam/gi,
    /airdrop/gi,
    /discord.+?subscription/gi,
    /distribut(ion|ed)/gi,
    /crypto/gi,
    /humble ?bundle(?!\.com)/gi,
    /arbitrage/gi,
    /@everyone/gi,
    /gift/gi,
]

full = [
    /hurry up.+(nitro(?! man)|trade|skin|cs:? ?go).+https?:\/\//gi,
    /don\u0027t be (greedy|modest) and take few/gi,
    /cs:? ?go.{3,}(giving away|give everything|trade)/gi,
    /(hello|hi).{20,}i will give a.{3,}knife/gi,
    /@everyone.+(steam|cs:? ?go|bit\.ly|discord( |-)nitro(?! man)|:free:|hurry up)/gi,
    /Free [3-9] Months of Discord( |-)Nitro.+http/gi,
    /(steam|cs:? ?go|bit\.ly|discord( |-)nitro (?!man)|:free:|hurry up).+@everyone/gi,
    /first.{3,15}who send a trade/gi,
    /i abandoned the cop and decided to distribute/gi,
    /store[\.\-](?!steampowered|playstation|hp)[^.]+?\.com\/app\/\d+/gi,
    /(hi|hello),? (bro|friend|guys), today I am leaving this (fucking)? game (with a bunch of cheaters|.+skins)/gi,
    /(hi|hello),? (bro|friend|guys), I left cs:? ?go because.+fucking cheaters in every game/gi,
    /(skins?\.?|trade|knife|sale|Rust).+(((i\.)?imgur\.com|ibb\.co)\/(a\/)?\w{6,8}(\.png|\.jpg)?)?.+https?:\/\/s(?!teamcommunity)[^.]+?\.com\/\w{3,12}(=[a-z0-9]{6,8}=\?[0-9]{1,}|\/[0-9]{15,}|\/([a-z0-9]{2,3}\/)?\?[a-z]{5,10}=[0-9]{6,14}&[a-z]{4,6}=-?\w{4,12}|\/[0-9]{5,8}\/\w{4,8}\/)$/gi,
    /dlscord(app)?\.(codes|shop|wiki)/gi,
    /(?!discord\.com)\/billing\/promotions\/[a-zA-Z0-9]{15,}\/$/gi,
    /(wowfnatic|giveawaynitro)\.(site|com)/gi,
    /((i\.)?imgur\.com|ibb\.co)\/(a\/)?\w{6,8}(\.png|\.jpg)?.+(free|(discord)?( |-)nitro(?! man))[^.]+?(for free|(discord)?( |-)nitro(?! man))/gi,
    /((i\.)?imgur\.com|ibb\.co)\/(a\/)?\w{6,8}(\.png|\.jpg)?.+(bit\.ly|discord\.ink)/gi,
    /hey cuz!!.+steam/gi,
    /discord.nitro.+offer (ends|is valid).+(January|February|March|April|May|June|July|August|September|October|November|December) [1-3]?\d(st|nd|rd|th)?/gi,
    /get [1-9] months of discord nitro.+Personalize your profile/gi,
    /skins?.+\([^.]+?(i\.)?(imgur\.com|ibb\.co)\/(a\/)?\w{6,8}(\.png|\.jpg)?\).+everyone/gi,
    /free (discord( |-))?nitro.+[1-9] months?/gi,
    /d(?!iscor)[a-z]{5}d(app)?\.[a-z]{2,4}\/[a-z0-9]{3,5}\/\w{7,10}$/gi,
    /(cl[il]scor(d|cl)|d[il]scorcl)/gi,
    /\.[a-z]{2,4}\/nitro\/steam/gi,
    /see here bro >>>/gi,
    /hot and beautiful girls.+sex/gi,
    /hi bro!.+(hot|beautiful).+girls/gi,
    /girls.+wats sex/gi,
    /(steam|discord).+bit\.ly/gi,
    /2014 Cobblestone Souvenir Package/gi,
    /get [1-9] months of discord nitro (for )?free/gi,
    /\.(xyz|ru|link)\/(gift|nitro|steam)/gi,
    /(steam|nitro(?! man)).+(i already got mine|i.+already received this)/gi,
    /(i already got mine|i.+already received this).+(steam|nitro(?! man))/gi,
    /\.ru\.com/gi,
    /nitro.+promotion.+steam/gi,
    /(hi|hello).+you won discord nitro/gi,
    /nitro\.(com|link)/gi,
    /free nitro(?! man).+https?:\/\//gi,
    /confirm the all exchanges/gi,
    /take all what you want/gi,
    /Customize your profile, share your screen in HD, update your emoji and more!.+https?:\/\//gi,
    /Personalize your profile, screen share in HD, upgrade your emojis, and more!.+https?:\/\//gi,
    /steam is giving away [1-9] months of discord nitro/gi,
    /steam ?give ?nitro/gi,
    /((hi|hello),? (bro|friend|guys)(,|!)|free|nitro(?! man)|steam).+https?:\/\/d(?!iscord)iscou?r(d|cl|b)(gift)?\.[a-z]{2,5}(\.uk)?/gi,
    /((hi|hello),? (bro|friend|guys)(,|!)|free|nitro(?! man)|steam).+https?:\/\/cliscou?r(d|cl|b)(gift)?\.[a-z]{2,5}(\.uk)?/gi,
    /https?:\/\/([a-z]{6,9}|free|gifts)-?nitro(ss?|i)?\.[a-z]{2,5}(\.uk|.com)?.{5,12}( @everyone)?$/gi,
    /some japanese candy/gi,
    /bonsaignw/gi,
    /discord giving [1-9] months? of free nitro/gi,
    /don\u0027t thank :call_me: ?$/gi,
    /hurry up.+([Nn]itro(?! [Mm]an)|trade|skin|[Cc][Ss]:? ?[Gg][Oo]).+https?:\/\//gi,
    /(nitro(?! man)|trade|skin|cs:? ?go).+hurry up.+https?:\/\//gi,
    /nitro\sof\sdiscord\sfreebie/gi,
    /????.+?(https:\/\/)?????.+?(https:\/\/)??????/gi,
    /steam has teamed up with discord/gi,
    /have time to pick up too before the distribution is over/gi,
    /discord n(?!itr)[a-z]{3}o.+https?:\/\//gi,
    /steam distributes discord nitro.+https?:\/\//gi,
    /cs:? ?go hack.+roblox exploit.+valorant esp/gi,
    /try your luck and get a guaranteed prize!/gi,
    /\.online\//gi,
    /dropmefiles\.com\//gi,
    /profit.+discord\.gg/gi,
    /click the link below to get yours!/gi,
    /steam store discord nitro/gi,
    /with nitro you are able to personalise your profile, screen share in HD, upgrade the emojis and much more\./gi,
    /discord\-app\.net/gi,
    /misplay\.oneline\.me/gi,
    /0ffer ends/gi,
    /nitro.+halloween/gi,
    /this gift is for you bro/gi,
    /d(?!iscor)[a-z]{5,6}d(\.|-)(gift|app)/gi,
    /halloween.+?(discord|nitro)/gi,
    /jahjajha/gi,
    /i need your support i made it to the semi-final of the/gi,
    /cs-esports\.link/gi,
    /@everyone.+?https?:\/\//gi,
    /d[lt]sc[oq]c?r[cd]/gi,
    /Upgrade your emoji, enjoy bigger file uploads, stand out in your favorite Discords, and more./gi,
    /get 3 months of Discord Nitro free from STEAM\./gi,
    /i got some nitro left over here/gi,
    /dsicord\./gi,
    /:point_up_2: sorry bro/gi,
    /glft\.com/gi,
    /Play Coin Master/gi,
    /club.exe/gi,
    /ty terll me/gi,
    /discord.+?youtube.+?nitro.+?https?:\/\//gi,
    /we partnered with club/gi,
    /currently hosting a 1 year nitro boost giveaway/gi,
    /someone was talking about \W{3,14} in this server https?:\/\//gi,
    /go to this website for free money/gi,
    /don't look at the url or it doesn't work/gi,
    /www\.\S{3}\.info/gi,
    /??? http/gi,
    /i bought 2 nitro codes by accident/gi,
    /disord\.gifts/gi,
    /distribution nitro/gi,
    /hello bro is my gift/gi,
    /take nitro faster/gi,
    /this is gift,/gi,
    /discordhalloween/gi,
    /discord.\.gift/gi,
    /\x00/gi,
    /discord is giving away nitro!/gi,
    /fuck this trash called cs.?go/gi,
    /take away while there is something left/gi,
    /stearnc/gi,
    /working nitro gen/gi,
    /generator nitro/gi,
    /\|\|\s?(@here|@everyone)\s?\|\|/gi,
    /nltro/gi,
    /click to get nitro/gi,
    /distributes nitro for free/gi,
    /\.shop(?!ify)/gi,
    /bit\.do/gi,
    /there is nitro handed out/gi,
    /discordclub\.com/gi,
    /motiontoken/gi,
    /steam gived nitro/gi,
    /@(everyone|here).+\.ru\//gi,
    /glfts?\//gi,
    /go or rast or pubg/gi,
    /take it until everything is sorted out/gi,
    /:clock630:/gi,
    /free nitro full/gi,
    /get even more nitro!/gi,
    /K67cXvr7MYA/gi,
    /free gift discord nitro/gi,
    /just don\u0027t tell anyone !!!/gi,
    /nitroapp\.rar/gi,
    /hi brothers, i have found a way to get discord nitro/gi,
    /i got some nitro left over here/gi,
    /free, take it :\)/gi,
    /gifts for the new year, nitro/gi,
    /discord, along with steam/gi,
    /ste[el]lseries\S+?\.\w{2,4}\//gi,
    /\.ly\//gi,
    /who is first\? :\)/gi,
    /for you bro :\)/gi,
    /steam gived free nitro/gi,
]

module.exports = {
    small,
    full
}
