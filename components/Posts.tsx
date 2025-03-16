'use client';

import React, { useEffect, useState, useRef } from "react";
import { getLoggedInUser, isUserLoggedIn } from "@/service/AuthService";
import { redirect } from "next/navigation";
import { Post } from "@/ds/post.dto";
import {getAllPosts, getProfileImageByStudentUserName} from "@/service/StudentPortalService";
import { createPost, deletePost, updatePost, likePost, unlikePost, getLikedPosts } from "@/service/PostService";
import Image from "next/image";
import { GiRose } from "react-icons/gi";
import { FaHeart } from "react-icons/fa";
import ReactCalendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import CountUp from 'react-countup';
import { FiCalendar, FiClock, FiDownloadCloud, FiAlertCircle } from 'react-icons/fi';
import {WiDaySunny} from "react-icons/wi";


function escapeRegExp(string: string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export default function Posts() {
    const [posts, setPosts] = useState<Post[]>([]);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [newPost, setNewPost] = useState("");
    const observerRef = useRef<IntersectionObserver | null>(null);
    const loadMoreRef = useRef<HTMLDivElement | null>(null);

    // Rude word/blocking state...
    const [rudeAttempts, setRudeAttempts] = useState(0);
    const [isBlocked, setIsBlocked] = useState(false);
    const [blockTimer, setBlockTimer] = useState(60);
    const [rudeNotice, setRudeNotice] = useState("");
    const [showWarningVideo, setShowWarningVideo] = useState(false);

    const [now, setNow] = useState(new Date());
    const loggedInUser = getLoggedInUser();

    // Inline editing/updating states
    const [editingPostId, setEditingPostId] = useState<number | null>(null);
    const [editingContent, setEditingContent] = useState("");

    // Confirmation modal states for update/delete (if needed)
    const [confirmModalOpen, setConfirmModalOpen] = useState(false);
    const [confirmModalType, setConfirmModalType] = useState(""); // "delete" or "update"
    const [confirmModalPostId, setConfirmModalPostId] = useState<number | null>(null);

    // Track liked posts (set of post IDs)
    const [likedPosts, setLikedPosts] = useState<Set<number>>(new Set());
    // List of prohibited words
    const rudeWords = `
abbo
abo
abortion
abuse
addict
addicts
adult
africa
african
alla
allah
alligatorbait
amateur
american
anal
analannie
analsex
angie
angry
anus
arab
arabs
areola
argie
aroused
arse
arsehole
asian
ass
assassin
assassinate
assassination
assault
assbagger
assblaster
assclown
asscowboy
asses
assfuck
assfucker
asshat
asshole
assholes
ashore
assjockey
asskiss
asskisser
assklown
asslick
asslicker
asslover
assman
assmonkey
assmunch
assmuncher
asspacker
asspirate
asspuppies
assranger
asswhore
asswipe
athletesfoot
attack
australian
babe
babies
backdoor
backdoorman
backseat
badfuck
balllicker
balls
ballsack
banging
baptist
barelylegal
barf
barface
barfface
bast
bastard
bazongas
bazooms
beaner
beast
beastality
beastial
beastiality
beatoff
beat-off
beatyourmeat
beaver
bestial
bestiality
bi
biatch
bible
bicurious
bigass
bigbastard
bigbutt
bigger
bisexual
bi-sexual
bitch
bitcher
bitches
bitchez
bitchin
bitching
bitchslap
bitchy
biteme
black
blackman
blackout
blacks
blind
blow
blowjob
boang
bogan
bohunk
bollick
bollock
bomb
bombers
bombing
bombs
bomd
bondage
boner
bong
boob
boobies
boobs
booby
boody
boom
boong
boonga
boonie
booty
bootycall
bountybar
bra
brea5t
breast
breastjob
breastlover
breastman
brothel
bugger
buggered
buggery
bullcrap
bulldike
bulldyke
bullshit
bumblefuck
bumfuck
bunga
bunghole
buried
burn
butchbabes
butchdike
butchdyke
butt
buttbang
butt-bang
buttface
buttfuck
butt-fuck
buttfucker
butt-fucker
buttfuckers
butt-fuckers
butthead
buttman
buttmunch
buttmuncher
buttpirate
buttplug
buttstain
byatch
cacker
cameljockey
cameltoe
canadian
cancer
carpetmuncher
carruth
catholic
catholics
cemetery
chav
cherrypopper
chickslick
children's
chin
chinaman
chinamen
chinese
chink
chinky
choad
chode
christ
christian
church
cigarette
cigs
clamdigger
clamdiver
clit
clitoris
clogwog
cocaine
cock
cockblock
cockblocker
cockcowboy
cockfight
cockhead
cockknob
cocklicker
cocklover
cocknob
cockqueen
cockrider
cocksman
cocksmith
cocksmoker
cocksucer
cocksuck
cocksucked
cocksucker
cocksucking
cocktail
cocktease
cocky
cohee
coitus
color
colored
coloured
commie
communist
condom
conservative
conspiracy
coolie
cooly
coon
coondog
copulate
cornhole
corruption
cra5h
crabs
crack
crackpipe
crackwhore
crack-whore
crap
crapola
crapper
crappy
crash
creamy
crime
crimes
criminal
criminals
crotch
crotchjockey
crotchmonkey
crotchrot
cum
cumbubble
cumfest
cumjockey
cumm
cummer
cumming
cumquat
cumqueen
cumshot
cunilingus
cunillingus
cunn
cunnilingus
cunntt
cunt
cunteyed
cuntfuck
cuntfucker
cuntlick
cuntlicker
cuntlicking
cuntsucker
cybersex
cyberslimer
dago
dahmer
dammit
damn
damnation
damnit
darkie
darky
datnigga
dead
deapthroat
death
deepthroat
defecate
dego
demon
deposit
desire
destroy
deth
devil
devilworshipper
dick
dickbrain
dickforbrains
dickhead
dickless
dicklick
dicklicker
dickman
dickwad
dickweed
diddle
die
died
dies
dike
dildo
dingleberry
dink
dipshit
dipstick
dirty
disease
diseases
disturbed
dive
dix
dixiedike
dixiedyke
doggiestyle
doggystyle
dong
doodoo
doo-doo
doom
dope
dragqueen
dragqween
dripdick
drug
drunk
drunken
dumb
dumbass
dumbbitch
dumbfuck
dyefly
dyke
easyslut
eatballs
eatme
eatpussy
ecstacy
ejaculate
ejaculated
ejaculating
ejaculation
enema
enemy
erect
erection
ero
escort
ethiopian
ethnic
european
evl
excrement
execute
executed
execution
executioner
explosion
facefucker
faeces
fag
fagging
faggot
fagot
failed
failure
fairies
fairy
faith
fannyfucker
fart
farted
farting
farty
fastfuck
fat
fatah
fatass
fatfuck
fatfucker
fatso
fckcum
fear
feces
felatio
felch
felcher
felching
fellatio
feltch
feltcher
feltching
fetish
fight
filipina
filipino
fingerfood
fingerfuck
fingerfucked
fingerfucker
fingerfuckers
fingerfucking
fire
firing
fister
fistfuck
fistfucked
fistfucker
fistfucking
fisting
flange
flasher
flatulence
floo
flydie
flydye
fok
fondle
footaction
footfuck
footfucker
footlicker
footstar
fore
foreskin
forni
fornicate
foursome
fourtwenty
fraud
freakfuck
freakyfucker
freefuck
fu
fubar
fuc
fucck
fuck
fucka
fuckable
fuckbag
fuckbuddy
fucked
fuckedup
fucker
fuckers
fuckface
fuckfest
fuckfreak
fuckfriend
fuckhead
fuckher
fuckin
fuckina
fucking
fuckingbitch
fuckinnuts
fuckinright
fuckit
fuckknob
fuckme
fuckmehard
fuckmonkey
fuckoff
fuckpig
fucks
fucktard
fuckwhore
fuckyou
fudgepacker
fugly
fuk
fuks
funeral
funfuck
fungus
fuuck
gangbang
gangbanged
gangbanger
gangsta
gatorbait
gay
gaymuthafuckinwhore
gaysex
geez
geezer
geni
genital
german
getiton
gin
ginzo
gipp
girls
givehead
glazeddonut
gob
god
godammit
goddamit
goddammit
goddamn
goddamned
goddamnes
goddamnit
goddamnmuthafucker
goldenshower
gonorrehea
gonzagas
gook
gotohell
goy
goyim
greaseball
gringo
groe
gross
grostulation
gubba
gummer
gun
gyp
gypo
gypp
gyppie
gyppo
gyppy
hamas
handjob
hapa
harder
hardon
harem
headfuck
headlights
hebe
heeb
hell
henhouse
heroin
herpes
heterosexual
hijack
hijacker
hijacking
hillbillies
hindoo
hiscock
hitler
hitlerism
hitlerist
hiv
ho
hobo
hodgie
hoes
hole
holestuffer
homicide
homo
homobangers
homosexual
honger
honk
honkers
honkey
honky
hook
hooker
hookers
hooters
hore
hork
horn
horney
horniest
horny
horseshit
hosejob
hoser
hostage
hotdamn
hotpussy
hottotrot
hummer
husky
hussy
hustler
hymen
hymie
iblowu
idiot
ikey
illegal
incest
insest
intercourse
interracial
intheass
inthebuff
israel
israeli
israel's
italiano
itch
jackass
jackoff
jackshit
jacktheripper
jade
jap
japanese
japcrap
jebus
jeez
jerkoff
jesus
jesuschrist
jew
jewish
jiga
jigaboo
jigg
jigga
jiggabo
jigger
jiggy
jihad
jijjiboo
jimfish
jism
jiz
jizim
jizjuice
jizm
jizz
jizzim
jizzum
joint
juggalo
jugs
junglebunny
kaffer
kaffir
kaffre
kafir
kanake
kid
kigger
kike
kill
killed
killer
killing
kills
kink
kinky
kissass
kkk
knife
knockers
kock
kondum
koon
kotex
krap
krappy
kraut
kum
kumbubble
kumbullbe
kummer
kumming
kumquat
kums
kunilingus
kunnilingus
kunt
ky
kyke
lactate
laid
lapdance
latin
lee
lesbain
lesbayn
lesbian
lesbin
lesbo
lez
lezbe
lezbefriends
lezbo
lezz
lezzo
liberal
libido
licker
lickme
lies
limey
limpdick
limy
lingerie
liquor
livesex
loadedgun
lolita
looser
loser
lotion
lovebone
lovegoo
lovegun
lovejuice
lovemuscle
lovepistol
loverocket
lowlife
lsd
lubejob
lucifer
luckycammeltoe
lugan
lynch
macaca
mad
mafia
magicwand
mams
manhater
manpaste
marijuana
mastabate
mastabater
masterbate
masterblaster
mastrabator
masturbate
masturbating
mattressprincess
meatbeatter
meatrack
meth
mexican
mgger
mggor
mickeyfinn
mideast
milf
minority
mockey
mockie
mocky
mofo
moky
moles
molest
molestation
molester
molestor
moneyshot
mooncricket
mormon
moron
moslem
mosshead
mothafuck
mothafucka
mothafuckaz
mothafucked
mothafucker
mothafuckin
mothafucking
mothafuckings
motherfuck
motherfucked
motherfucker
motherfuckin
motherfucking
motherfuckings
motherlovebone
muff
muffdive
muffdiver
muffindiver
mufflikcer
mulatto
muncher
munt
murder
murderer
muslim
naked
narcotic
nasty
nastybitch
nastyho
nastyslut
nastywhore
nazi
necro
negro
negroes
negroid
negro's
nig
niger
nigerian
nigerians
nigg
nigga
niggah
niggaracci
niggard
niggarded
niggarding
niggardliness
niggardliness's
niggardly
niggards
niggard's
niggaz
nigger
niggerhead
niggerhole
niggers
nigger's
niggle
niggled
niggles
niggling
nigglings
niggor
niggur
niglet
nignog
nigr
nigra
nigre
nip
nipple
nipplering
nittit
nlgger
nlggor
nofuckingway
nook
nookey
nookie
noonan
nooner
nude
nudger
nuke
nutfucker
nymph
ontherag
oral
orga
orgasim
orgasm
orgies
orgy
osama
paki
palesimian
palestinian
pansies
pansy
panti
panties
payo
pearlnecklace
peck
pecker
peckerwood
pee
peehole
pee-pee
peepshow
peepshpw
pendy
penetration
peni5
penile
penis
penises
penthouse
period
perv
phonesex
phuk
phuked
phuking
phukked
phukking
phungky
phuq
pi55
picaninny
piccaninny
pickaninny
piker
pikey
piky
pimp
pimped
pimper
pimpjuic
pimpjuice
pimpsimp
pindick
piss
pissed
pisser
pisses
pisshead
pissin
pissing
pissoff
pistol
pixie
pixy
playboy
playgirl
pocha
pocho
pocketpool
pohm
polack
pom
pommie
pommy
poo
poon
poontang
poop
pooper
pooperscooper
pooping
poorwhitetrash
popimp
porchmonkey
porn
pornflick
pornking
porno
pornography
pornprincess
pot
poverty
premature
pric
prick
prickhead
primetime
propaganda
pros
prostitute
protestant
pu55i
pu55y
pube
pubic
pubiclice
pud
pudboy
puddboy
puke
puntang
purinapricness
puss
pussie
pussies
pussy
pussycat
pussyeater
pussyfucker
pussylicker
pussylips
pussylover
pussypounder
pusy
quashie
queef
queer
quickie
quim
ra8s
rabbi
racial
racist
radical
radicals
raghead
randy
rape
raped
raper
rapist
rearend
rearentry
rectum
redlight
redneck
reefer
reestie
refugee
reject
remains
rentafuck
republican
rere
retard
retarded
ribbed
rigger
rimjob
rimming
roach
robber
roundeye
rump
russki
russkie
sadis
sadom
samckdaddy
sandm
sandnigger
satan
scag
scallywag
scat
schlong
screw
screwyou
scrotum
scum
semen
seppo
servant
sex
sexed
sexfarm
sexhound
sexhouse
sexing
sexkitten
sexpot
sexslave
sextogo
sextoy
sextoys
sexual
sexually
sexwhore
sexy
sexymoma
sexyslim
shag
shaggin
shagging
shat
shav
shawtypimp
sheeney
shhit
shinola
shit
shitcan
shitdick
shite
shiteater
shited
shitface
shitfaced
shitfit
shitforbrains
shitfuck
shitfucker
shitfull
shithapens
shithappens
shithead
shithouse
shiting
shitlist
shitola
shitoutofluck
shits
shitstain
shitted
shitter
shitting
shitty
shoot
shooting
shortfuck
showtime
sick
sissy
sixsixsix
sixtynine
sixtyniner
skank
skankbitch
skankfuck
skankwhore
skanky
skankybitch
skankywhore
skinflute
skum
skumbag
slant
slanteye
slapper
slaughter
slav
slave
slavedriver
sleezebag
sleezeball
slideitin
slime
slimeball
slimebucket
slopehead
slopey
slopy
slut
sluts
slutt
slutting
slutty
slutwear
slutwhore
smack
smackthemonkey
smut
snatch
snatchpatch
snigger
sniggered
sniggering
sniggers
snigger's
sniper
snot
snowback
snownigger
sob
sodomy
sodomise
sodomite
sodomize
sodomy
sonofabitch
sonofbitch
sooty
sos
soviet
spaghettibender
spaghettinigger
spank
spankthemonkey
sperm
spermacide
spermbag
spermhearder
spermherder
spic
spick
spig
spigotty
spik
spit
spitter
splittail
spooge
spreadeagle
spunk
spunky
squaw
stagg
stiffy
strapon
stringer
stripclub
stroke
stroking
stupid
stupidfuck
stupidfucker
suck
suckdick
sucker
suckme
suckmyass
suckmydick
suckmytit
suckoff
suicide
swallow
swallower
swalow
swastika
sweetness
syphilis
taboo
taff
tampon
tang
tantra
tarbaby
tard
teat
terror
terrorist
teste
testicle
testicles
thicklips
thirdeye
thirdleg
threesome
threeway
timbernigger
tinkle
tit
titbitnipply
titfuck
titfucker
titfuckin
titjob
titlicker
titlover
tits
tittie
titties
titty
tnt
toilet
tongethruster
tongue
tonguethrust
tonguetramp
tortur
torture
tosser
towelhead
trailertrash
tramp
trannie
tranny
transexual
transsexual
transvestite
triplex
trisexual
trojan
trots
tuckahoe
tunneloflove
turd
turnon
twat
twink
twinkie
twobitwhore
uck
uk
unfuckable
upskirt
uptheass
upthebutt
urinary
urinate
urine
usama
uterus
vagina
vaginal
vatican
vibr
vibrater
vibrator
vietcong
violence
virgin
virginbreaker
vomit
vulva
wab
wank
wanker
wanking
waysted
weapon
weenie
weewee
welcher
welfare
wetb
wetback
wetspot
whacker
whash
whigger
whiskey
whiskeydick
whiskydick
whit
whitenigger
whites
whitetrash
whitey
whiz
whop
whore
whorefucker
whorehouse
wigger
willie
williewanker
willy
wn
wog
women's
wop
wtf
wuss
wuzzie
xtc
xxx
yankee
yellowman
zigabo
zipperhead
`.split("\n")
        .map(word => word.trim())
        .filter(word => word.length > 0);

    // Add profile image state at the top of the component
    const [userProfileImage, setUserProfileImage] = useState<string>("default.png");

// Add this useEffect to fetch user's profile image
    useEffect(() => {
        if (loggedInUser) {
            getProfileImageByStudentUserName(loggedInUser)
                .then(res => setUserProfileImage(res.data))
                .catch(err => console.error("Error fetching profile image:", err));
        }
    }, [loggedInUser]);

    // Effects and functions remain unchanged

    useEffect(() => {
        if (!isUserLoggedIn()) {
            redirect("/login");
        }
        fetchPosts();
        // Fetch liked posts for the user
        getLikedPosts(loggedInUser)
            .then((res) => {
                const liked: number[] = res.data;
                setLikedPosts(new Set(liked));
            })
            .catch((err) => console.error(err));
    }, [page]);

    useEffect(() => {
        const interval = setInterval(() => setNow(new Date()), 1000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (isBlocked) {
            setRudeNotice(`You are blocked from posting. Please wait ${blockTimer} seconds.`);
        }
    }, [blockTimer, isBlocked]);

    function getRandomNumber() {
        return Math.floor(Math.random() * 10000000) + 1;
    }

    const fetchPosts = () => {
        setLoading(true);
        getAllPosts()
            .then((res) => {
                const parsedPosts = res.data.map((post: Post) => ({
                    ...post,
                    createdAt: post.createdAt,
                }));
                setPosts((prevPosts) => [...prevPosts, ...parsedPosts]);
                setLoading(false);
            })
            .catch((err) => {
                console.error(err);
                setLoading(false);
            });
    };

    useEffect(() => {
        observerRef.current = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) {
                    setPage((prev) => prev + 1);
                }
            },
            { threshold: 1.0 }
        );
        if (loadMoreRef.current) {
            observerRef.current.observe(loadMoreRef.current);
        }
        return () => observerRef.current?.disconnect();
    }, []);

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isBlocked) {
            interval = setInterval(() => {
                setBlockTimer((prev) => {
                    if (prev <= 1) {
                        clearInterval(interval);
                        setIsBlocked(false);
                        setRudeAttempts(0);
                        setRudeNotice("");
                        return 60;
                    }
                    return prev - 1;
                });
            }, 1000);
        }
        return () => interval && clearInterval(interval);
    }, [isBlocked]);

    const timeSince = (dateStr: string) => {
        const created = new Date(dateStr);
        let seconds = Math.floor((now.getTime() - created.getTime()) / 1000);
        if (seconds < 0) seconds = 0;
        if (seconds < 5) return "just now";
        let interval = seconds / 31536000;
        if (interval >= 1)
            return `${Math.floor(interval)} year${Math.floor(interval) > 1 ? "s" : ""} ago`;
        interval = seconds / 2592000;
        if (interval >= 1)
            return `${Math.floor(interval)} month${Math.floor(interval) > 1 ? "s" : ""} ago`;
        interval = seconds / 86400;
        if (interval >= 1)
            return `${Math.floor(interval)} day${Math.floor(interval) > 1 ? "s" : ""} ago`;
        interval = seconds / 3600;
        if (interval >= 1)
            return `${Math.floor(interval)} hour${Math.floor(interval) > 1 ? "s" : ""} ago`;
        interval = seconds / 60;
        if (interval >= 1)
            return `${Math.floor(interval)} minute${Math.floor(interval) > 1 ? "s" : ""} ago`;
        return `${Math.floor(seconds)} second${Math.floor(seconds) > 1 ? "s" : ""} ago`;
    };

    const findRudeWords = (text: string) => {
        const lowerText = text.toLowerCase();
        const foundWords: string[] = [];
        rudeWords.forEach((word) => {
            const pattern = new RegExp(`\\b${escapeRegExp(word)}\\b`, "g");
            if (pattern.test(lowerText)) {
                foundWords.push(word);
            }
        });
        return Array.from(new Set(foundWords));
    };

    // Inline editing functions
    const handleEditPost = (postId: number, currentContent: string) => {
        setEditingPostId(postId);
        setEditingContent(currentContent);
    };

    const cancelEdit = () => {
        setEditingPostId(null);
        setEditingContent("");
    };

    // Confirm update – if rude words found, show warning video and delete the post
    const confirmUpdate = () => {
        if (editingPostId === null) return;
        const updatedContent = editingContent;
        const rudeFound = findRudeWords(updatedContent);
        if (rudeFound.length > 0) {
            setShowWarningVideo(true);
            // Delete the post due to inappropriate language
            deletePost(editingPostId, loggedInUser)
                .then(() => {
                    setPosts((prevPosts) =>
                        prevPosts.filter((post) => post.id !== editingPostId)
                    );
                    alert("Your post contained inappropriate language and has been deleted.");
                    setEditingPostId(null);
                    setEditingContent("");
                    setTimeout(() => {
                        setShowWarningVideo(false);
                    }, 3000);
                })
                .catch((err) => console.error(err));
            return;
        }
        updatePost(editingPostId, loggedInUser, updatedContent)
            .then(() => {
                setPosts((prevPosts) =>
                    prevPosts.map((post) =>
                        post.id === editingPostId ? { ...post, content: updatedContent } : post
                    )
                );
                setEditingPostId(null);
                setEditingContent("");
            })
            .catch((err) => console.error(err));
    };

    const handleCreatePost = () => {
        if (!newPost.trim()) return;
        if (isBlocked) {
            setRudeNotice(`You are blocked from posting. Please wait ${blockTimer} seconds.`);
            return;
        }
        const foundRudeWords = findRudeWords(newPost);
        if (foundRudeWords.length > 0) {
            const newAttempts = rudeAttempts + 1;
            setRudeAttempts(newAttempts);
            if (newAttempts >= 5) {
                setIsBlocked(true);
                setBlockTimer(60);
                setRudeNotice("Too many inappropriate attempts. You are blocked for 60 seconds.");
            } else {
                setRudeNotice(
                    `Your post contains inappropriate word(s): "${foundRudeWords.join('", "')}". Please remove them.`
                );
            }
            setShowWarningVideo(true);
            return;
        }
        setRudeNotice("");
        const newPostObj: Post = {
            id: getRandomNumber(),
            postOwner: loggedInUser,
            content: newPost,
            title: "New Post",
            createdAt: new Date().toISOString(),
            likeCount: 0,
        };
        createPost(newPostObj)
            .then(() => {
                setPosts([]);
                setPage(1);
                getLikedPosts(loggedInUser)
                    .then((res) => setLikedPosts(new Set(res.data)))
                    .catch((err) => console.error(err));
            })
            .catch((err) => console.error(err));
        setNewPost("");
    };

    // Toggle like/unlike for a post
    const handleToggleLike = (postId: number) => {
        if (likedPosts.has(postId)) {
            unlikePost(postId, loggedInUser)
                .then(() => {
                    setPosts((prevPosts) =>
                        prevPosts.map((post) =>
                            post.id === postId
                                ? { ...post, likeCount: Math.max((post.likeCount ?? 0) - 1, 0) }
                                : post
                        )
                    );
                    setLikedPosts((prev) => {
                        const newSet = new Set(prev);
                        newSet.delete(postId);
                        return newSet;
                    });
                })
                .catch((err) => console.error(err));
        } else {
            likePost(postId, loggedInUser)
                .then(() => {
                    setPosts((prevPosts) =>
                        prevPosts.map((post) =>
                            post.id === postId
                                ? { ...post, likeCount: (post.likeCount ?? 0) + 1 }
                                : post
                        )
                    );
                    setLikedPosts((prev) => new Set(prev).add(postId));
                })
                .catch((err) => console.error(err));
        }
    };

    // Render warning and ban videos
    const renderWarningVideo = () => (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50">
            <div className="bg-white p-2 rounded shadow">
                <video
                    src="/ohmygah.mp4"
                    autoPlay
                    controls={false}
                    className="w-80"
                    onEnded={() => setShowWarningVideo(false)}
                />
            </div>
        </div>
    );

    const renderBanVideo = () => (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50">
            <div className="bg-white p-2 rounded shadow">
                <video src="/angry.mp4" autoPlay loop controls={false} className="w-80" />
                <p className="mt-2 text-black text-center">
                    You are banned for {blockTimer} seconds
                </p>
            </div>
        </div>
    );

    // Confirmation modal for delete/update (if needed)
    const openConfirmModal = (actionType: string, postId: number) => {
        setConfirmModalType(actionType);
        setConfirmModalPostId(postId);
        setConfirmModalOpen(true);
    };

    const closeConfirmModal = () => {
        setConfirmModalOpen(false);
        setConfirmModalType("");
        setConfirmModalPostId(null);
    };

    const confirmDelete = () => {
        if (confirmModalPostId === null) return;
        deletePost(confirmModalPostId, loggedInUser)
            .then(() => {
                setPosts((prevPosts) =>
                    prevPosts.filter((post) => post.id !== confirmModalPostId)
                );
            })
            .catch((err) => console.error(err));
        closeConfirmModal();
    };

    const handleDeletePost = (postId: number) => {
        openConfirmModal("delete", postId);
    };

    return (
        <div
            className="container mx-auto grid grid-cols-12 gap-6 p-5 min-h-screen"
            style={{ backgroundColor: "#f6f8f6" }}
        >
            {/* Render ban or warning video */}
            {isBlocked && renderBanVideo()}
            {!isBlocked && rudeNotice && showWarningVideo && renderWarningVideo()}

            {/* Confirmation Modal */}
            {confirmModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center z-50">
                    <div className="absolute inset-0 bg-black opacity-50"></div>
                    <div className="bg-white p-6 rounded shadow-lg z-10">
                        {confirmModalType === "delete" ? (
                            <p className="mb-4">Are you sure you want to delete this post?</p>
                        ) : (
                            <p className="mb-4">Are you sure you want to update this post?</p>
                        )}
                        <div className="flex justify-end gap-4">
                            <button onClick={closeConfirmModal} className="px-4 py-2 bg-gray-200 rounded">
                                Cancel
                            </button>
                            {confirmModalType === "delete" ? (
                                <button onClick={confirmDelete} className="px-4 py-2 bg-red-500 text-white rounded">
                                    Confirm
                                </button>
                            ) : (
                                <button onClick={confirmUpdate} className="px-4 py-2 bg-green-500 text-white rounded">
                                    Confirm
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Left Sidebar */}
            <aside className="col-span-12 lg:col-span-3 space-y-6">
                {/* Myanmar Weather Widget */}
                <div className="bg-white rounded-2xl shadow-lg p-6">
                    <div className="flex items-center gap-3 mb-4">
                        <WiDaySunny className="text-3xl text-yellow-500" />
                        <div>
                            <h2 className="text-xl font-bold text-green-800">Myanmar Weather</h2>
                            <p className="text-gray-600">Yangon</p>
                        </div>
                    </div>
                    <div className="flex items-center justify-between">
                        <p className="text-4xl font-bold">32°C</p>
                        <p className="text-gray-600">Partly Cloudy</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4 mt-4">
                        <div className="bg-green-50 p-3 rounded-lg">
                            <p className="text-sm text-gray-600">Humidity</p>
                            <p className="font-bold text-green-800">68%</p>
                        </div>
                        <div className="bg-green-50 p-3 rounded-lg">
                            <p className="text-sm text-gray-600">Wind</p>
                            <p className="font-bold text-green-800">14 km/h</p>
                        </div>
                    </div>
                </div>

                {/* Academic Calendar */}
                <div className="bg-white rounded-2xl shadow-lg p-5">
                    <h2 className="text-xl font-bold mb-4 text-green-800 flex items-center gap-2">
                        <FiCalendar className="text-green-600" />
                        Academic Calendar
                    </h2>
                    <ReactCalendar
                        className="!w-full !border-0"
                        tileClassName={({ date }) =>
                            date.getDay() === 6 || date.getDay() === 0 ? "text-red-400" : ""
                        }
                        minDetail="month"
                    />
                </div>

                {/* Download Section */}
                <div className="bg-white rounded-2xl shadow-lg p-5">
                    <h2 className="text-xl font-bold mb-4 text-green-800 flex items-center gap-2">
                        <FiDownloadCloud className="text-green-600" />
                        University Resources
                    </h2>
                    <div className="space-y-3">
                        <a
                            href="/UIT-Academic-Rules.pdf"
                            download
                            className="flex items-center justify-between p-3 hover:bg-green-50 rounded-xl transition-colors"
                        >
                            <span className="text-gray-700">Academic Rules</span>
                            <span className="text-green-600 text-sm">PDF 2.1MB</span>
                        </a>
                        {/* Add other download links similarly */}
                    </div>
                </div>
            </aside>

            {/* Main Feed */}
            <main className="col-span-12 lg:col-span-6 space-y-6">
                {/* Create Post Card */}
                <div className="bg-white shadow-xl rounded-2xl p-6">
                    <div className="flex items-center gap-4">
                        <Image
                            src={`/${userProfileImage}`}
                            alt="User"
                            width={56}
                            height={56}
                            className="rounded-full border-2 border-green-200"
                            onError={(e) => {
                                (e.target as HTMLImageElement).src = "/default.png";
                            }}
                            unoptimized // Add if you're having image optimization issues
                        />
                        <div className="flex-1">
              <textarea
                  value={newPost}
                  onChange={(e) => setNewPost(e.target.value)}
                  placeholder="Share your thoughts with the campus..."
                  className="w-full p-3 rounded-xl border border-gray-200 focus:border-green-400 focus:ring-2 focus:ring-green-100 resize-none transition-all"
                  rows={3}
              />
                        </div>
                    </div>
                    {rudeNotice && (
                        <div className="mt-4 p-3 bg-red-100 text-red-600 rounded-lg flex items-center gap-2">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                                    clipRule="evenodd"
                                />
                            </svg>
                            {rudeNotice}
                        </div>
                    )}
                    <div className="flex justify-end mt-4">
                        {!isBlocked && (
                            <button
                                onClick={handleCreatePost}
                                className="bg-green-800 hover:bg-green-700 text-white font-semibold px-6 py-2 rounded-full transition duration-300"
                            >
                                Post
                            </button>
                        )}
                    </div>
                </div>

                {/* Posts List */}
                {posts.map((post, index) => (
                    <div
                        key={`${post.id}-${index}`}
                        className="bg-white shadow-lg rounded-2xl p-6 group hover:shadow-xl transition-shadow"
                    >
                        <div className="flex items-start gap-4">
                            <div className="relative flex-shrink-0">
                                <Image
                                    src={`/${post.profileImage || "default.png"}`}
                                    alt="Profile"
                                    width={48}
                                    height={48}
                                    className="rounded-full border-2 border-green-200"
                                    onError={(e) => {
                                        (e.target as HTMLImageElement).src = "/default.png";
                                    }}
                                    unoptimized
                                />
                                <GiRose className="absolute -right-1 -top-1 text-red-500 bg-white rounded-full p-0.5" />
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center justify-between mb-2">
                                    <div>
                                        <h3 className="font-bold text-gray-800 capitalize">
                                            {post.postOwner}
                                        </h3>
                                        <p className="text-xs text-gray-400">{timeSince(post.createdAt)}</p>
                                    </div>
                                    {post.postOwner === loggedInUser && (
                                        <div className="flex items-center gap-3">
                                            {editingPostId !== post.id ? (
                                                <>
                                                    <button onClick={() => handleEditPost(post.id, post.content)}>
                                                        <Image src="/update.svg" alt="update" width={20} height={20} />
                                                    </button>
                                                    <button onClick={() => handleDeletePost(post.id)}>
                                                        <Image src="/delete.svg" alt="delete" width={20} height={20} />
                                                    </button>
                                                </>
                                            ) : (
                                                <div className="flex gap-2">
                                                    <button onClick={confirmUpdate}>
                                                        <Image src="/update.svg" alt="save" width={20} height={20} />
                                                    </button>
                                                    <button onClick={cancelEdit} className="text-gray-500">
                                                        Cancel
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                                {editingPostId === post.id ? (
                                    <textarea
                                        value={editingContent}
                                        onChange={(e) => setEditingContent(e.target.value)}
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-400"
                                        rows={3}
                                    />
                                ) : (
                                    <p className="text-gray-700 mb-4 leading-relaxed">{post.content}</p>
                                )}
                                <div className="flex items-center gap-4 text-gray-500">
                                    <button
                                        onClick={() => handleToggleLike(post.id)}
                                        className="flex items-center gap-1.5 hover:text-red-500 transition-colors"
                                    >
                                        <FaHeart
                                            className={`${
                                                likedPosts.has(post.id) ? "text-red-500" : "text-gray-400"
                                            } transition-colors`}
                                        />
                                        <span className="text-sm">{post.likeCount}</span>
                                    </button>
                                    <span className="flex items-center gap-1 text-pink-500">
                    <GiRose />
                    <span className="text-sm">{post.roseCount || 0}</span>
                  </span>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
                <div ref={loadMoreRef} className="h-10"></div>
                {loading && <p className="text-center text-gray-500">Loading more posts...</p>}
            </main>

            {/* Right Sidebar */}
            <aside className="col-span-12 lg:col-span-3 space-y-6">
                {/* Anime Recommendations */}
                <div className="bg-white rounded-2xl shadow-lg p-6">
                    <h3 className="text-lg font-bold mb-4 text-green-800">Anime Recommendations</h3>
                    <div className="grid grid-cols-2 gap-4">
                        {[
                            { title: "Violet Evergarden", image: "violetevergarden.jpg" },
                            { title: "Your Lie in April", image: "yourlieinapril.jpg" },
                            { title: "Clannad", image: "clannad.jpg" },
                            { title: "Anohana", image: "anohana.jpg" },
                            { title: "Angel Beats", image: "angelbeats.jpg" },
                            { title: "Plastic Memories", image: "p.jpg" },
                            { title: "Aria The Animation", image: "aria.jpg" },
                            { title: "Vivy", image: "vivy.jpg" },
                            { title: "White Album 2", image: "white.jpg" },
                            { title: "Eminence In Shadow", image: "shadow.jpg" },
                            { title: "Air", image: "kanon.jpg" },
                            { title: "I Want To Eat Your Pancreas", image: "pancreas.jpg" },
                            { title: "K-ON", image: "k.jpg" },
                            { title: "Azumanga Daioh", image: "azu.jpg" },
                            { title: "Yuru Camp", image: "camp.jpg" },
                            { title: "My Teen Romantic Comedy", image: "teen.jpg" },
                            { title: "Bunny Girl Senpai", image: "mei.jpg" },
                            { title: "Horimiya", image: "horimiya.jpg" },
                            { title: "My Dressup Darling", image: "marin.jpeg" },
                            { title: "86", image: "86.jpg" },
                            { title: "Shikimori is not just a cutie", image: "shikimori.jpg" },
                            { title: "One Piece", image: "one.jpg" },
                            { title: "The Pet Girl Of Sakurasou", image: "sou.png" },
                            { title: "How To Raise A Boring Girlfriend", image: "girlfriend.jpg" },
                            { title: "Bocchi The Rock", image: "bocchi.jpg" },
                            { title: "Gintama", image: "gintama.jpg" },
                        ].map((anime) => (
                            <a
                                key={anime.title}
                                href={`https://www.youtube.com/results?search_query=${encodeURIComponent(
                                    anime.title + " trailer"
                                )}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group relative block rounded-xl overflow-hidden hover:shadow-md transition-shadow"
                            >
                                <Image
                                    src={`/${anime.image}`}
                                    alt={anime.title}
                                    width={200}
                                    height={300}
                                    className="w-full h-32 object-cover"
                                />
                                <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <span className="text-white font-medium text-center text-sm">Watch Trailer</span>
                                </div>
                                <p className="text-sm font-medium text-gray-800 mt-2">{anime.title}</p>
                            </a>
                        ))}
                    </div>
                </div>

                {/* Myanmar Clock */}
                <div className="bg-green-800 text-white rounded-2xl p-6 shadow-lg">
                    <div className="flex items-center gap-3 mb-4">
                        <FiClock className="text-2xl" />
                        <h3 className="text-xl font-bold">Myanmar Time</h3>
                    </div>
                    <div className="text-4xl font-mono font-bold text-center">
                        {now.toLocaleTimeString("en-US", {
                            hour: "2-digit",
                            minute: "2-digit",
                            timeZone: "Asia/Yangon",
                        })}
                    </div>
                    <div className="text-center mt-2 text-sm opacity-90">
                        {now.toLocaleDateString("en-US", {
                            weekday: "long",
                            month: "long",
                            day: "numeric",
                            timeZone: "Asia/Yangon",
                        })}
                    </div>
                </div>

                {/* Daily Quote */}
                <div className="bg-white rounded-2xl shadow-lg p-6">
                    <h3 className="text-lg font-bold mb-4 text-green-800">Daily Quote</h3>
                    <p className="italic text-gray-600">
                        "Education is the passport to the future, for tomorrow belongs to those who prepare for it today."
                    </p>
                    <p className="mt-2 text-sm text-gray-500">- Malcolm X</p>
                </div>
            </aside>
        </div>
    );
}