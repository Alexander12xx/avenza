const WA = "254707392474";
const MAIL = "avenzatoursandtravel@gmail.com";
const IMG = "assets/img/";
const VID = "assets/video/";

const DESTINATIONS = [
  { id:"mara", name:"Maasai Mara", country:"Kenya", cat:"Kenya", img:"dest-mara.jpg", wide:true, tall:true,
    lead:"Kenya's most celebrated game reserve, rolling golden grasslands, big cat country and the best wildlife viewing in East Africa.",
    best:"July to October", ideal:"2 to 6 days", from:"US$1,050",
    high:["Great migration river crossings","Big cat country - lion, leopard, cheetah","Balloon safaris at sunrise","Maasai village visits"] },
  { id:"diani", name:"Diani Beach", country:"Kenya Coast", cat:"Kenya", img:"dest-diani.jpg", wide:true,
    lead:"A palm-fringed stretch of white sand on the warm Indian Ocean, with coral reefs, kitesurfing and quiet retreats.",
    best:"June to October", ideal:"4 to 7 days", from:"US$560",
    high:["Unspoilt four-kilometre beach","Snorkelling and dolphin trips","Kitesurfing hub","Lamu and Old Town excursions"] },
  { id:"zanzibar", name:"Zanzibar", country:"Tanzania", cat:"Zanzibar", img:"dest-zanzibar.jpg",
    lead:"Stone Town's carved doors, spice plantations and the turquoise shallows of the Zanzibar archipelago.",
    best:"June to October", ideal:"3 to 6 days", from:"US$1,500",
    high:["UNESCO World Heritage Stone Town","Forgotten Island snorkelling","Spice tour and cooking class","Dhow sunset cruise"] },
  { id:"serengeti", name:"Serengeti", country:"Tanzania", cat:"Tanzania", img:"dest-serengeti.jpg",
    lead:"Endless plains, kopje-dotted hills and the largest overland wildlife migration on earth.",
    best:"January to March", ideal:"4 to 8 days", from:"US$2,050",
    high:["1.5 million wildebeest migration","Big cats across the Seronera","Hot-air balloon at dawn","Ngorongoro Crater day trip"] },
  { id:"amboseli", name:"Amboseli", country:"Kenya", cat:"Kenya", img:"hero-kilimanjaro.jpg", wide:true,
    lead:"Elephant herds beneath the snow-capped peak of Mount Kilimanjaro - the most photographed wildlife scene in Africa.",
    best:"June to October", ideal:"2 to 3 days", from:"US$860",
    high:["Kilimanjaro on the horizon","Large tusker elephant families","Observation Hill at sunset","Maasai community visits"] },
  { id:"nakuru", name:"Lake Nakuru", country:"Kenya", cat:"Kenya", img:"dest-nakuru.jpg",
    lead:"A soda lake famous for its flamingo flocks, plus a rhino sanctuary and waterfall viewpoints nearby.",
    best:"June to October", ideal:"2 to 3 days", from:"US$490",
    high:["Spectacle of lesser flamingos","Black and white rhino sanctuary","Maturee Waterfall viewpoint","Over 450 bird species"] },
  { id:"nairobi", name:"Nairobi City", country:"Kenya", cat:"Kenya", img:"dest-nairobi.jpg",
    lead:"A green capital with world-class dining, design, wildlife rehabilitation and the national park on its doorstep.",
    best:"All year round", ideal:"2 to 4 days", from:"US$690",
    high:["Giraffe Centre and elephant orphanage","Nairobi National Park","Bomas and national museums","Karura forest nature walks"] },
  { id:"tsavo", name:"Tsavo", country:"Kenya", cat:"Kenya", img:"dest-tsavo.jpg",
    lead:"Two immense parks split by the Nairobi to Mombasa highway - red-earth elephants, lava tubes and hidden river valleys.",
    best:"June to October", ideal:"2 to 4 days", from:"US$520",
    high:["Red elephants of Tsavo East","Mkomazi lesser-known wilderness","Shetani lava tube caves","Galana river sundowners"] },
  { id:"rwanda", name:"Kigali and Volcanoes", country:"Rwanda", cat:"Rwanda", img:"pkg-gorilla.jpg",
    lead:"Clean, green Rwanda and the Volcanoes National Park mountain-gorilla trekking experience.",
    best:"June to September", ideal:"4 to 6 days", from:"US$2,450",
    high:["Mountain gorilla trekking permits","Kigali memorial and markets","Volcanoes hikes and crater lakes","Award-winning hospitality"] }
];

const PACKAGES = [
  { id:"p1", title:"Maasai Mara and Migoria Safari", cat:"Safari", img:"pkg-mara.jpg", flag:"Kenya", days:"5 Days", from:1050, kes:"KES 145,000", place:"Maasai Mara",
    blurb:"Big cats, river crossings and golden-hour game drives across Kenya's most famous reserve.",
    incl:["4x4 safari vehicle with driver-guide","3 nights full-board tented camp","All game drives and park fees","Nairobi pick-up and drop-off"],
    itin:[["Nairobi to the Mara","Fly or drive to the Mara plains and settle into camp with an afternoon game drive."],["Full game drive - Migoria","A full day tracking lions, leopards and the resident elephant herds."],["River crossing and sundowner","A full day positioned for wildebeest crossings, ending with a sundowner drink."],["Balloon safari and bush walk","Optional dawn balloon flight, then a guided walking safari with a Maasai elder."],["Mara to Nairobi","A final dawn drive before returning to Nairobi for departure."]] },
  { id:"p2", title:"Diani Beach Retreat", cat:"Beach", img:"dest-diani.jpg", flag:"Kenya Coast", days:"5 Days", from:560, kes:"KES 78,000", place:"Diani Beach",
    blurb:"Barefoot days on the Indian Ocean with reef snorkelling, spa time and fresh seafood.",
    incl:["Beachfront accommodation","4x4 transfers from the airport","Reef snorkelling and dolphin cruise","All breakfasts and one seafood dinner"],
    itin:[["Arrival in Diani","Private transfer from Mombasa airport or a flight connection from Nairobi."],["Beach and reef day","Snorkel the coral headland, then a sunset walk along the sand."],["Dolphin and marine safari","Dolphin spotting in Kisite-Mpunguti Marine Park with a local skipper."],["Spa and free time","A morning at leisure, with an optional ninety-minute massage treatment."],["Departure","Breakfast on the sand and transfer for your onward journey."]] },
  { id:"p3", title:"Amboseli Under Kilimanjaro", cat:"Safari", img:"hero-kilimanjaro.jpg", flag:"Kenya", days:"4 Days", from:860, kes:"KES 118,000", place:"Amboseli",
    blurb:"Elephant families framed by Africa's highest mountain, at dawn and at dusk.",
    incl:["Private 4x4 with guide","Lodge with Kilimanjaro views","All park entry fees","Sunset at Observation Hill"],
    itin:[["Into the Amboseli plains","Arrive and take an evening game drive in the shadow of Kilimanjaro."],["Elephant country","A full day with the big tusker families of the northern swamps."],["Observation Hill sunset","Climb the lookout for full-circle views as the sun drops behind the peak."],["Return to Nairobi","A dawn drive before transfer back to Nairobi."]] },
  { id:"p4", title:"Serengeti Great Migration", cat:"Safari", img:"dest-serengeti.jpg", flag:"Tanzania", days:"8 Days", from:2050, kes:"KES 285,000", place:"Serengeti",
    blurb:"Follow the herds across the Serengeti, then descend into the Ngorongoro Crater.",
    incl:["Internal light aircraft flights","Full-board mobile tented camp","All game drives and park fees","Ngorongoro Crater descent"],
    itin:[["Arrive Arusha","Welcome and overnight in Arusha before flying to the Serengeti."],["Southern Serengeti","Ndutu and the long-grass plains where the herds calve."],["Western corridor","The Grumeti and Seronera stretches for crossings and predators."],["Northern Serengeti","Follow the herds toward the Mara river, with night game drives."],["Ngorongoro Crater","A full day on the crater floor among rhino, lion and hippo."],["Departure","Fly from the airstrip and transfer onward."]] },
  { id:"p5", title:"Zanzibar Spice and Sand", cat:"Beach", img:"dest-zanzibar.jpg", flag:"Zanzibar", days:"6 Days", from:1500, kes:"KES 210,000", place:"Zanzibar",
    blurb:"Stone Town culture, spice farms and warm turquoise water across the archipelago.",
    incl:["Boutique Stone Town stay","Beach resort nights","Spice tour and dhow cruise","All transfers and ferries"],
    itin:[["Stone Town walking tour","Carved doors, markets and the old slave trade history with a local guide."],["Spice plantation","Taste and learn how Zanzibar earned its name."],["Forgotten Island snorkelling","A dhow trip to the pristine reef at Nakupenda."],["Beach days","Free time for kayaking, diving or simply doing nothing."],["Sunset dhow cruise","A late-afternoon sail with music and snacks."],["Departure","Fly out from Zanzibar International Airport."]] },
  { id:"p6", title:"Nairobi and Naivasha", cat:"City & Culture", img:"pkg-nairobi.jpg", flag:"Kenya", days:"4 Days", from:690, kes:"KES 96,000", place:"Nairobi",
    blurb:"The capital's food, design and culture paired with a ranch-style lakeside escape.",
    incl:["Boutique city hotel","2 nights on a Naivasha ranch","Nairobi National Park half-day","All transfers"],
    itin:[["Nairobi orientation","Giraffe Centre, elephant orphanage and a guided city highlights tour."],["Nairobi National Park","A half-day drive on city roads with rhino, lion and giraffe."],["Lake Naivasha","Transfer north to a working ranch with lakeside rooms and walking trails."],["Return and departure","Back to Nairobi in time for your onward flight."]] },
  { id:"p7", title:"Tsavo East and West", cat:"Safari", img:"pkg-tsavo.jpg", flag:"Kenya", days:"3 Days", from:520, kes:"KES 72,000", place:"Tsavo",
    blurb:"Red earth, lava tubes and elephant herds in Kenya's largest wilderness.",
    incl:["2 nights across two parks","Shared or private 4x4","All park fees","Sundowner drinks"],
    itin:[["Tsavo East","Game drives among the famous red elephants and dust devils of the plains."],["Shetani lava tubes","Walk through the collapsed cave system and underground river."],["Tsavo West","Mkomazi riverfront drives and a relaxed final sundowner."]] },
  { id:"p8", title:"Lake Nakuru Bird Safari", cat:"Wildlife", img:"pkg-nakuru.jpg", flag:"Kenya", days:"3 Days", from:490, kes:"KES 68,000", place:"Lake Nakuru",
    blurb:"Flamingos, rhino sanctuary and over 450 recorded bird species around a soda lake.",
    incl:["2 nights lakeside lodge","Guided birding walks","Rhino sanctuary entry","All park fees"],
    itin:[["Into the Rift Valley","Descend the escarpment to a lodge overlooking the lake."],["Flamingo flocks","A morning among the lesser flamingos and herons."],["Rhino sanctuary and waterfall","Conservation first, then the Maturee Waterfall viewpoint."]] },
  { id:"p9", title:"Rwanda Gorilla Trek", cat:"Adventure", img:"pkg-gorilla.jpg", flag:"Rwanda", days:"5 Days", from:2450, kes:"KES 340,000", place:"Rwanda",
    blurb:"Mountain gorilla trekking, Kigali's clean capital and Volcanoes National Park hikes.",
    incl:["Gorilla trekking permits","4x4 with driver-guide","3 nights lodge accommodation","All park fees"],
    itin:[["Kigali arrival","Transfer and a city orientation with the genocide memorial."],["Drive to Volcanoes NP","Scenic journey through the hills to the gorilla trekking lodge."],["Gorilla trekking","A guided trek to see a habituated gorilla family."],["Volcanoes hike","An optional dawn hike to the summit of Bisoke or a slide on the lava slopes."],["Departure","Return to Kigali for your flight home."]] },
  { id:"p10", title:"Kenya Grand Escape", cat:"Wildlife", img:"pkg-lion.jpg", flag:"Kenya", days:"10 Days", from:3100, kes:"KES 430,000", place:"Kenya",
    blurb:"The complete Kenyan circuit: safari, highlands, coast and a final city break.",
    incl:["All domestic flights","9 nights accommodation","Private 4x4 throughout","All park fees and transfers"],
    itin:[["Nairobi","Arrive and settle, city highlights the next morning."],["Maasai Mara","Four nights of game drives and a bush dinner."],["Lake Nakuru","Flamingos and the rhino sanctuary en route south."],["Amboseli","Elephants beneath Kilimanjaro with a sunrise balloon option."],["Coast","Three nights on the Kenyan coast with a dolphin cruise."],["Departure","Final transfer to Mombasa or Nairobi for departure."]] },
  { id:"p11", title:"Tanzania Uncovered", cat:"Safari", img:"pkg-tanzania.jpg", flag:"Tanzania", days:"9 Days", from:2650, kes:"KES 370,000", place:"Tanzania",
    blurb:"Arusha, Tarangire, Ngorongoro, the Serengeti and the endless plains of the south.",
    incl:["All internal flights","8 nights mobile camping","Crater descent","All national park fees"],
    itin:[["Arusha","A Kilimanjaro foothill town and a night before the bush."],["Tarangire","Elephant country and ancient baobabs."],["Ngorongoro Crater","A full day on the crater floor, then on to the Serengeti."],["Serengeti plains","Central and southern Serengeti game drives."],["Return","Fly out and transfer onward."]] },
  { id:"p12", title:"Zebra and Sunrise Plains", cat:"Wildlife", img:"pkg-zebra.jpg", flag:"Kenya", days:"5 Days", from:1180, kes:"KES 162,000", place:"Laikipia",
    blurb:"A gentle, photography-friendly stay in open zebra country with a private vehicle.",
    incl:["Private vehicle and guide","4 nights in a quiet camp","Sunrise and sundowner drives","All park fees"],
    itin:[["Light-vehicle plains","A specialist guide reads the ground for zebra and wildebeest behaviour."],["Photography mornings","Positioned on the plains at first light with breakfast in the field."],["Predator country","Afternoon drives toward the resident lion prides."],["Night drive and sundowners","An evening drive with a lantern-lit dinner."],["Departure","Final dawn drive then transfer out."]] }
];

const VIDEOS = [
  { src:"wildebeest-mara.webm", title:"Great migration on the move", place:"Maasai Mara, Kenya", poster:"gal-serengeti.jpg", dur:"Short" },
  { src:"elephant-river.webm", title:"Elephants crossing the river", place:"Greater Kruger, South Africa", poster:"gal-elephants.jpg", dur:"Short" },
  { src:"elephant-water.webm", title:"A herd at the waterhole", place:"Mphafa, Malawi", poster:"pkg-tsavo.jpg", dur:"Short" },
  { src:"elephant-drink.webm", title:"Bull elephant drinking", place:"Savanna plains", poster:"hero-mara.jpg", dur:"Short" },
  { src:"lion-cubs.webm", title:"Lion cubs at play", place:"Savanna reserve", poster:"gal-lion.jpg", dur:"Short" },
  { src:"zebra.webm", title:"Zebra in the open", place:"African plain", poster:"gal-zebra.jpg", dur:"Short" },
  { src:"buffalo-herd.webm", title:"Buffalo herds on the plains", place:"Maasai Mara, Kenya", poster:"dest-mara.jpg", dur:"Short" },
  { src:"diani-beach.webm", title:"Morning on Diani Beach", place:"Diani Beach, Kenya", poster:"dest-diani.jpg", dur:"Short" },
  { src:"safari-nairobi.webm", title:"Safari in the city park", place:"Nairobi National Park", poster:"dest-nairobi.jpg", dur:"Short" },
  { src:"nairobi-city.webm", title:"Nairobi timelapse", place:"Nairobi, Kenya", poster:"gal-nairobi.jpg", dur:"Short" },
  { src:"balloon-safari.webm", title:"Hot air balloon at dawn", place:"Over the savanna", poster:"pkg-sunset.jpg", dur:"Short" }
];

const GALLERY = [
  { img:"gal-elephants.jpg", title:"Elephants at the waterhole", cat:"Wildlife", place:"Amboseli, Kenya", big:true, wide:true },
  { img:"gal-maasai.jpg", title:"Maasai community", cat:"Culture", place:"Kenya" },
  { img:"gal-lion.jpg", title:"The king of the pride", cat:"Wildlife", place:"Maasai Mara, Kenya" },
  { img:"dest-diani.jpg", title:"Diani at sunrise", cat:"Coast", place:"Kenya Coast" },
  { img:"gal-zebra.jpg", title:"Zebra watching", cat:"Wildlife", place:"Nairobi, Kenya" },
  { img:"gal-dhow.jpg", title:"Dhow on the horizon", cat:"Coast", place:"Zanzibar" },
  { img:"gal-giraffe.jpg", title:"Three giraffes", cat:"Wildlife", place:"Kenya" },
  { img:"gal-serengeti.jpg", title:"Serengeti plains", cat:"Landscape", place:"Tanzania", big:true },
  { img:"gal-nairobi.jpg", title:"Nairobi skyline", cat:"Landscape", place:"Nairobi, Kenya" },
  { img:"gal-ostrich.jpg", title:"Ostrich and acacia", cat:"Landscape", place:"Maasai Mara, Kenya" },
  { img:"gal-gazelle.jpg", title:"Grant's gazelle", cat:"Wildlife", place:"Tsavo East, Kenya" },
  { img:"intro-safari.jpg", title:"Ready for the day", cat:"Landscape", place:"Maasai Mara, Kenya" }
];

const TESTIMONIALS = [
  { q:"The itinerary felt personal from the very first conversation. Every detail was organised, yet we still had the freedom to simply enjoy the journey.", n:"W. Otieno", r:"Family holiday, Maasai Mara" },
  { q:"They rebooked our whole Zanzibar trip after a flight was cancelled, at short notice, without adding a single extra shilling. That is real service.", n:"S. Patel", r:"Honeymoon, Zanzibar" },
  { q:"I have used Avenza for three separate business trips. Consistent invoices, reliable vehicles, and someone always picking up the phone.", n:"M. Kariuki", r:"Corporate travel, East Africa" },
  { q:"Our guide in the Mara knew exactly where the cats were. We saw five different leopards in two days. Worth every shilling.", n:"L. Abrahamsen", r:"Group safari, Kenya" },
  { q:"Clear pricing, no hidden extras, and an itinerary that actually made sense on paper. Exactly what we hoped for.", n:"J. Njoroge", r:"Anniversary trip, Tanzania" }
];

const FAQS = [
  { q:"How far in advance should I book?", a:"For the Maasai Mara and the Serengeti, six to nine months is safest because peak-season lodges sell out early. Kenya's coast and Nairobi can often be arranged with two to four weeks notice. If you are unsure, send us your dates and we will tell you honestly how tight the window is." },
  { q:"Is a deposit required, and how do payments work?", a:"We ask for a deposit to confirm lodge and vehicle reservations, with the balance due before departure. Bank transfer, mobile money and card payments are all accepted, and you always receive a written itinerary with a clear breakdown of what is included." },
  { q:"Do you arrange international flights and visas?", a:"We handle international ticketing through trusted partners and guide you through the Kenyan eTA application. Transit visas for Zanzibar and onward travel within East Africa can be arranged as part of your booking. Just let us know your passport nationality." },
  { q:"Can you travel with children or a large group?", a:"Yes. We regularly plan family trips and groups of twenty or more, splitting vehicles and arranging larger camps or villas as needed. Tell us ages and numbers in the enquiry form and we will size everything accordingly." },
  { q:"What if I have dietary or medical needs?", a:"Every itinerary is built around your requirements. Allergies, vegetarian or vegan diets, mobility considerations and ongoing medication can all be accommodated. We brief camps and drivers directly so nothing is missed on arrival." },
  { q:"Are safari vehicles and guides included?", a:"Yes, every safari itinerary includes a private or shared 4x4 with an English-speaking driver-guide, fuel, park entry fees and unlimited game drives within park opening hours. Walking safaris and night drives are included where the camp and park rules permit." }
];

const OPTS = {
  destination:["Maasai Mara","Amboseli","Diani Beach","Lamu Island","Watamu","Malindi","Kilifi","Mombasa","Zanzibar","Stone Town","Paje and Nungwi","Serengeti","Ngorongoro Crater","Tarangire","Arusha","Lake Manyara","Lake Nakuru","Tsavo East","Tsavo West","Nairobi City","Nairobi National Park","Lake Naivasha","Laikipia","Samburu","Mount Kenya","Meru","Kilimanjaro","Kigali","Volcanoes National Park","Rwanda","Victoria Falls","Okavango Delta","Botswana","Sossusvlei","Namibia","Cairo and Giza","Egypt","Dubai","Doha","Istanbul","Somewhere else entirely"],
  month:["January","February","March","April","May","June","July","August","September","October","November","December","January to March","June to October dry season","Flexible, not decided yet","Not sure, please advise me"],
  travellers:["1 traveller","2 travellers","3 to 4 travellers","5 to 8 travellers","9 to 15 travellers","16 to 30 travellers","30 or more, conference group"],
  style:["Safari","Beach","Adventure and trekking","City and culture","Wildlife photography","Honeymoon","Family holiday","Group tour","Corporate travel","Conference or MICE","Wellness retreat","Road trip","Anything else"],
  tripType:["Safari","Beach holiday","International trip","Domestic Kenya trip","Business travel","Conference or MICE","Family holiday","Honeymoon","Group tour","Adventure and trekking","City break","Safari plus beach combo","Student or academic tour","Relocation","Not sure yet"],
  duration:["1 to 2 days","3 to 4 days","5 to 7 days, one week","8 to 10 days","2 weeks","3 weeks","1 month or longer","Not sure, please advise me"],
  budget:["Under US$500","US$500 to US$1,000","US$1,000 to US$2,000","US$2,000 to US$4,000","US$4,000 to US$8,000","Over US$8,000","I would like a recommendation"],
  stay:["Budget camp or guesthouse","Mid-range lodge","Comfortable 4-star","Luxury lodge or suite","Ultra-luxury private villa","No preference, please advise"],
  airport:["Jomo Kenyatta International (NBO)","Jomo Kenyatta Wilson (WIL)","Mombasa Moi International (MBA)","Mombasa Malindi (LAU)","Dar es Salaam (DAR)","Zanzibar Abeid Amani Karume (ZNZ)","Kigali International (KGL)","Arusha Airport (ARK)","Entebbe (EBB)","Addis Ababa (ADD)","Lusaka (LUN)","Johannesburg OR Tambo (JNB)","Not applicable, arranging my own flights","Other or undecided"],
  country:["Kenya","Tanzania","Uganda","Rwanda","Zambia","Botswana","South Africa","Ethiopia","Nigeria","Ghana","Kenya diaspora","United Kingdom","United States","Canada","Australia","New Zealand","United Arab Emirates","Saudi Arabia","India","Kenya, elsewhere in Africa","Other country"],
  source:["WhatsApp","Instagram","Facebook","Google search","A friend or family recommendation","TikTok","Email","Walked past the office","Other"]
};
