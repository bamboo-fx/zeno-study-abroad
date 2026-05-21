import {
  Moon, Building2, Waves, BookOpen, Mountain, Utensils, GraduationCap, Coffee,
  Globe, Sparkles, Leaf, Sun, Snowflake,
} from "lucide-react";
import { G } from "../theme/gradients.js";

export const VIBES = [
  { id: "neon", label: "Neon City Nights", sub: "Electric, fast, futuristic", icon: Moon, grad: G.neon, photoQ: "Shibuya Crossing" },
  { id: "cobble", label: "Old-World Cobblestone", sub: "Historic, romantic", icon: Building2, grad: G.cobble, photoQ: "Prague" },
  { id: "beach", label: "Coastal Sun", sub: "Salt air, slow mornings", icon: Waves, grad: G.beach, photoQ: "Bondi Beach" },
  { id: "nordic", label: "Minimalist Calm", sub: "Quiet, clean, focused", icon: BookOpen, grad: G.nordic, photoQ: "Nyhavn" },
  { id: "alpine", label: "Mountain & Nature", sub: "Peaks, trails, fresh air", icon: Mountain, grad: G.alpine, photoQ: "Matterhorn" },
  { id: "market", label: "Bustling Markets", sub: "Spice, color, energy", icon: Utensils, grad: G.market, photoQ: "Marrakesh" },
  { id: "campus", label: "Storied Campus", sub: "Ivy, history, ambition", icon: GraduationCap, grad: G.campus, photoQ: "Trinity College, Cambridge" },
  { id: "cafe", label: "Cozy Café Culture", sub: "Warm, bookish, lingering", icon: Coffee, grad: G.cafe, photoQ: "Paris" },
];

export const CONTINENTS = [
  { id: "europe", label: "Europe", sub: "UK, France, Nordics, Spain…", icon: Building2, photoQ: "Prague" },
  { id: "asia", label: "Asia", sub: "Japan, Korea, Vietnam…", icon: Moon, photoQ: "Great Wall of China" },
  { id: "oceania", label: "Oceania", sub: "Australia, New Zealand", icon: Waves, photoQ: "Sydney Opera House" },
  { id: "americas", label: "Americas", sub: "Latin America & US", icon: GraduationCap, photoQ: "Rio de Janeiro" },
];

// Region-specific imagery per vibe. Falls back to VIBES[i].photoQ when the
// continent is "any" or missing.
export const VIBE_PHOTO_BY_REGION = {
  europe: {
    neon: "Berlin", cobble: "Prague", beach: "Barcelona",
    nordic: "Nyhavn", alpine: "Matterhorn", market: "Marrakesh",
    campus: "Trinity College, Cambridge", cafe: "Paris",
  },
  asia: {
    neon: "Shibuya Crossing", cobble: "Kyoto", beach: "Bali",
    nordic: "Osaka", alpine: "Mount Fuji", market: "Bangkok",
    campus: "Yasuda Auditorium", cafe: "Hanoi",
  },
  oceania: {
    neon: "Sydney", cobble: "Christchurch", beach: "Bondi Beach",
    nordic: "Wellington", alpine: "Queenstown", market: "Melbourne",
    campus: "Main Quadrangle, University of Sydney", cafe: "Melbourne",
  },
  americas: {
    neon: "Times Square", cobble: "Cusco", beach: "Rio de Janeiro",
    nordic: "Montevideo", alpine: "Torres del Paine", market: "Mexico City",
    campus: "Nassau Hall", cafe: "Buenos Aires",
  },
};

// Major → academic focus. Drives a best-fit weighting on programs.
// NOTE: this is a designed heuristic, not official "your major can only go here" data.
export const MAJORS = [
  { id: "business", label: "Finance / Economics", sub: "Business school track", icon: Building2,
    focus: "Business & economics programs, finance-strong partners" },
  { id: "stem", label: "STEM / Engineering", sub: "Science & technical", icon: Mountain,
    focus: "Research universities & technical institutes" },
  { id: "cs", label: "Computer Science", sub: "Tech & data", icon: Moon,
    focus: "Tech hubs & CS-strong universities" },
  { id: "social", label: "Social Sciences", sub: "Gov, IR, psych, soc", icon: GraduationCap,
    focus: "Politics, IR & social-science depth" },
  { id: "humanities", label: "Humanities", sub: "History, lit, philosophy", icon: BookOpen,
    focus: "Historic universities & liberal-arts depth" },
  { id: "arts", label: "Arts & Design", sub: "Studio, media, music", icon: Coffee,
    focus: "Creative cities & arts-forward programs" },
  { id: "language", label: "Languages / Area Studies", sub: "Immersion focus", icon: Globe,
    focus: "Full language immersion & area studies" },
  { id: "open", label: "Still exploring", sub: "Show me everything", icon: Sparkles,
    focus: "No filtering — all approved programs" },
];

export const SCHOOLS = [
  { id: "cmc", name: "Claremont McKenna College", note: "Live data from CMC's Center for Global Education portal", live: true },
  { id: "pomona", name: "Pomona College", note: "Live data from Pomona IDPO's Terra Dotta portal", live: true },
  { id: "pitzer", name: "Pitzer College", note: "Live data from Pitzer SAIP's Terra Dotta portal", live: true },
  { id: "scripps", name: "Scripps College", note: "Live data from Scripps SAGE's Terra Dotta portal", live: true },
  { id: "harvey-mudd", name: "Harvey Mudd College", note: "Live data from HMC's Study Abroad portal", live: true },
];

export const SEMS = [
  { id: "fall", label: "Fall Semester", sub: "Sep – Dec", icon: Leaf },
  { id: "spring", label: "Spring Semester", sub: "Jan – May", icon: Sun },
  { id: "summer", label: "Summer Term", sub: "Jun – Aug", icon: Snowflake },
];

export const SCORE_MAP = {
  cobble:["historic","history","old","medieval","ancient","architecture","castle","cobble","charming","romantic","gothic","heritage","classic","traditional","stone","village","town","preserved"],
  cafe:["café","cafe","coffee","cozy","cosy","book","bookish","quiet","slow","relax","calm","wine","pastry","literary","intimate","warm","charming"],
  beach:["beach","surf","ocean","sea","coast","coastal","warm","sun","sunny","island","tropical","swim","sand","mediterranean","summer","reef"],
  nordic:["nordic","minimal","minimalist","clean","design","scandinav","scandinavian","calm","focus","focused","modern","simple","tidy","orderly","quiet"],
  neon:["neon","nightlife","fast","futuristic","modern","tech","technology","busy","night","city","urban","energetic","lively","buzzing","exciting","fun","party","megacity"],
  alpine:["mountain","mountains","ski","skiing","hike","hiking","alps","alpine","nature","outdoor","outdoors","trail","trails","lake","snow","adventure","peaks","wilderness","glacier"],
  market:["market","markets","spice","spices","food","foodie","street","color","colour","colorful","vibrant","cheap","budget","affordable","inexpensive","bazaar","souk"],
  campus:["campus","university","college","academic","study","studious","ivy","library","prestige","prestigious","scholar","intellectual","research","elite","ambitious","ranked","stem"],
};
