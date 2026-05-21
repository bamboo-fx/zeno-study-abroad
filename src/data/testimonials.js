export const TESTI = {
  "Barcelona": {
    fall: { who: "Maya, economics major, fall semester",
      quote: "Fall in Barcelona is the city exhaling — the August crowds gone, the sea still warm enough to swim after class.",
      day: ["8:30 — Cortado and a pastry standing at the bar of the café below my piso in Gràcia; everyone reads the paper.",
        "9:30 — Walk 20 min to class past Modernista facades; the morning light hits the tiled buildings gold.",
        "13:00 — Long lunch — menú del día, three courses, 12 euros — with classmates near the university.",
        "16:00 — Library or a study café in El Born; narrow medieval lanes the whole walk there.",
        "18:30 — Swim or run at Barceloneta beach; the water's ~72°F through October.",
        "21:30 — Late dinner, tapas crawl; the city doesn't really eat until 9."] },
    spring: { who: "Diego, IR major, spring semester",
      quote: "Spring is orange-blossom air and the Mediterranean turning swimmable again right as finals loom.",
      day: ["9:00 — Class first; mornings are cool and bright, jacket-on-jacket-off weather.",
        "13:30 — Picnic lunch in Parc de la Ciutadella, everyone out on the grass once it warms.",
        "16:00 — Group project at a café; sit outside for the first time since winter.",
        "18:00 — Walk the Gothic Quarter; the low spring sun in the stone canyons is unreal.",
        "20:30 — Rooftop with friends watching the sunset over the city, sea on the horizon.",
        "22:00 — Dinner late, always late."] },
    summer: { who: "Priya, summer term",
      quote: "Summer is intense heat by noon and a city that lives at night — beach mornings, siesta, then everything reopens at 7.",
      day: ["8:00 — Beach before it gets brutal; the sand's already filling by 10.",
        "10:00 — Short class block — summer schedules are compressed.",
        "14:00 — Hide from the heat; long lunch, then genuinely everyone slows down.",
        "19:00 — City comes back to life as it cools; markets and plazas fill.",
        "22:00 — Dinner outside, 82°F and pleasant, music somewhere nearby.",
        "00:30 — Walk home along streets still full of people."] } },
};

export const GEN_TESTI = (city, clim) => {
  const warm = clim === "med" || clim === "trop" || clim === "latam";
  return {
    fall: { who: `A student, fall semester in ${city}`,
      quote: `Fall in ${city} settles into a steady rhythm — classes find their groove and the city feels lived-in, not touristy.`,
      day: [`Morning — coffee near the flat, then the walk or transit to class; the ${clim==="ukmar"?"cool, often grey":clim==="easia"?"crisp, clear":"changing"} light sets the mood.`,
        "Midday — a real sit-down lunch with the cohort; this is where the friendships form.",
        "Afternoon — library or a study café; explore one new neighborhood on the way back.",
        "Evening — cook with flatmates or grab something local; plan the weekend trip.",
        "Night — early by local standards or late, depending on the city's pace."] },
    spring: { who: `A student, spring semester in ${city}`,
      quote: `Spring is ${city} waking up — longer days, the first outdoor afternoons, finals on the horizon but the city pulling you outside.`,
      day: ["Morning — class while it's still cool; layers you'll shed by noon.",
        "Midday — lunch outdoors for the first time since winter; everyone notices.",
        "Afternoon — group work, then a walk somewhere green now that it's blooming.",
        "Evening — golden light makes the ordinary streets cinematic; everyone's out.",
        "Night — dinner with friends, the season turning warm enough to linger."] },
    summer: { who: `A student, summer term in ${city}`,
      quote: warm
        ? `Summer in ${city} is heat, slow afternoons, and a city that truly comes alive once the sun drops.`
        : `Summer in ${city} is the long-daylight payoff — mild, bright until late, the best version of the place.`,
      day: [warm?"Early — out before the heat peaks; mornings are the move." : "Morning — bright early; compressed summer class schedule.",
        "Midday — the hot hours; long lunch, slow down, locals do too.",
        "Afternoon — indoors or shaded; the city rests.",
        "Evening — everything reopens as it cools; plazas and markets fill.",
        "Night — outdoor dinner, warm air, the city at its liveliest."] },
  };
};
