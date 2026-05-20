export const COUNTRY_COST = {
  "Switzerland":118,"Norway":92,"Iceland":96,"Denmark":86,"Singapore":88,
  "Hong Kong":78,"Australia":74,"New Zealand":68,"Ireland":74,"United Kingdom":73,
  "Netherlands":70,"France":69,"Germany":67,"Austria":66,"Italy":63,"Belgium":68,
  "Sweden":68,"Finland":70,"Spain":56,"Portugal":54,"Greece":55,"Japan":58,
  "South Korea":62,"China":42,"United States":70,"Canada":66,"Czechia":52,
  "Czech Republic":52,"Hungary":46,"Poland":45,"Croatia":52,"Slovenia":54,
  "Estonia":55,"Argentina":36,"Brazil":38,"Uruguay":48,"Chile":46,"Peru":34,
  "Mexico":40,"Ecuador":38,"Cuba":40,"South Africa (Atlantic)":42,
  "South Africa":42,"Ghana":40,"Jordan":48,"India":24,"Nepal":28,"Bhutan":40,
  "Vietnam":34,"Indonesia":36,"Samoa":52,"Cuba ":40,
};
export const CITY_COST = {
  "London":85,"Geneva":120,"Zurich":124,"Paris":78,"Copenhagen":90,"Amsterdam":78,
  "Dublin":80,"Edinburgh":70,"Cambridge":74,"Oxford":74,"Tokyo":63,"Kyoto":58,
  "Osaka":58,"Hong Kong":78,"Sydney":80,"Melbourne":74,"Auckland":70,
  "Barcelona":58,"Madrid":58,"Lisbon":56,"Florence":62,"Rome":64,"Berlin":68,
  "Buenos Aires":36,"Cape Town":44,"Stockholm":70,"Munich":74,
};
export function costInfo(city, country) {
  const idx = CITY_COST[city] != null ? CITY_COST[city]
    : (COUNTRY_COST[country] != null ? COUNTRY_COST[country] : 55);
  // Map index → rough monthly student all-in (shared room + food + transit).
  // Calibrated so NYC-ish (100) ≈ $2300, mid (55) ≈ $1250, low (25) ≈ $620.
  const studentMo = Math.round((180 + idx * 21) / 10) * 10;
  let tier, tierColor;
  if (idx < 40) { tier = "Budget-friendly"; tierColor = "#16a34a"; }
  else if (idx < 60) { tier = "Moderate"; tierColor = "#7c4dff"; }
  else if (idx < 85) { tier = "Pricey"; tierColor = "#d97706"; }
  else { tier = "Expensive"; tierColor = "#dc2626"; }
  const vsNY = idx >= 100 ? `${idx - 100}% above NYC`
    : `${100 - idx}% below NYC`;
  // Category split — typical share of a study-abroad student's monthly budget.
  // Rent dominates and scales a bit harder with pricier cities; small extras
  // (phone, etc.) scale less. Rounded to the nearest $5 for readability.
  const r5 = (n) => Math.round(n / 5) * 5;
  const rentShare = 0.40 + (idx > 70 ? 0.05 : 0);          // pricier cities = rent-heavier
  const rent = r5(studentMo * rentShare);
  const food = r5(studentMo * 0.23);
  const transit = r5(studentMo * 0.07);
  const social = r5(studentMo * 0.13);                      // going out, culture, trips
  const phone = r5(28 + idx * 0.5);                          // utilities/phone, scales gently
  const misc = Math.max(0, studentMo - rent - food - transit - social - phone); // books, supplies, buffer
  const breakdown = [
    { key: "Rent (shared)", amt: rent, note: "Room in a shared flat or residence" },
    { key: "Food & groceries", amt: food, note: "Cooking in + occasional eating out" },
    { key: "Going out & culture", amt: social, note: "Cafés, nightlife, museums, day trips" },
    { key: "Transport", amt: transit, note: "Local monthly transit pass" },
    { key: "Phone & utilities", amt: phone, note: "SIM/data + share of bills" },
    { key: "Books & misc.", amt: misc, note: "Supplies, laundry, buffer" },
  ];
  // Typical housing arrangements most study-abroad providers (IES, CIEE,
  // IFSA, Arcadia, etc.) offer. Costs are modeled relative to the shared-rent
  // baseline; homestay usually bundles some meals so it offsets food spend.
  const housing = [
    { type: "Homestay", monthly: r5(rent * 0.95 + food * 0.55), icon: "home",
      desc: "Live with a local host family. Often includes some meals — strongest language & cultural immersion.",
      perk: "Some meals included" },
    { type: "Residence hall", monthly: r5(rent * 1.05), icon: "dorm",
      desc: "Student dorm or program residence with other international & local students. Social and simple.",
      perk: "Built-in community" },
    { type: "Shared apartment", monthly: r5(rent * 1.15), icon: "apt",
      desc: "A flat shared with other students. Most independence and privacy; you handle all your own meals.",
      perk: "Most independence" },
  ];
  return { idx, studentMo, tier, tierColor, vsNY, breakdown, housing };
}
