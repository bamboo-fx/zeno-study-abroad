// Country → continent bucket. Matches the four IDs used by CONTINENTS in
// options.js (europe | asia | oceania | americas). Anything not listed
// defaults to "europe" since that's where the bulk of approved programs live.
export const COUNTRY_CONTINENT = {
  // Europe
  "United Kingdom":"europe","Ireland":"europe","France":"europe","Spain":"europe","Italy":"europe",
  "Germany":"europe","Netherlands":"europe","Switzerland":"europe","Austria":"europe",
  "Czech Republic":"europe","Czechia":"europe","Hungary":"europe","Greece":"europe","Portugal":"europe",
  "Denmark":"europe","Sweden":"europe","Iceland":"europe","Norway":"europe","Finland":"europe",
  "Belgium":"europe","Poland":"europe","Croatia":"europe","Slovenia":"europe","Estonia":"europe",
  // Asia
  "Japan":"asia","South Korea":"asia","Korea, Republic of":"asia","China":"asia",
  "Hong Kong":"asia","Taiwan":"asia","Vietnam":"asia","India":"asia","Nepal":"asia",
  "Bhutan":"asia","Jordan":"asia","Singapore":"asia","Thailand":"asia","Indonesia":"asia",
  "Malaysia":"asia","Israel":"asia","Cambodia":"asia","Sri Lanka":"asia","United Arab Emirates":"asia",
  // Oceania
  "Australia":"oceania","New Zealand":"oceania","Samoa":"oceania","Fiji":"oceania",
  "Tanzania (Indian Ocean)":"oceania",
  // Americas
  "Argentina":"americas","Brazil":"americas","Chile":"americas","Peru":"americas","Ecuador":"americas",
  "Uruguay":"americas","Costa Rica":"americas","Panama":"americas","Mexico":"americas",
  "Cuba":"americas","Colombia":"americas","Bolivia":"americas","Guatemala":"americas",
  "Dominican Republic":"americas","Nicaragua":"americas","Canada":"americas","United States":"americas",
  // Africa: no dedicated continent bucket in the UI. Route all African
  // programs to "americas" for consistency — picking "Americas" then surfaces
  // the cross-cultural programs (Ghana, Cape Town, etc.) alongside Latin
  // America. Morocco stays with Europe since most Morocco programs are
  // Mediterranean-facing and pair with Spain/Portugal in vibe scoring.
  "Morocco":"europe","Egypt":"europe",
  "Ghana":"americas","Cameroon":"americas","Senegal":"americas",
  "Tanzania":"americas","Tanzania (Indian Ocean)":"americas",
  "Kenya":"americas","South Africa":"americas","South Africa (Atlantic)":"americas",
  "Ethiopia":"americas","Rwanda":"americas","Uganda":"americas","Botswana":"americas",
  // Caribbean
  "Turks & Caicos":"americas","Bahamas":"americas","Jamaica":"americas","Haiti":"americas",
};

export function continentOf(country) {
  return COUNTRY_CONTINENT[country] || "europe";
}

// Country → climate bucket key used by src/data/climate.js CLIM.
export const COUNTRY_CLIM = {
  "United Kingdom":"ukmar","Ireland":"ukmar","Netherlands":"ukmar",
  "France":"cont","Germany":"cont","Switzerland":"cont","Austria":"cont","Belgium":"cont",
  "Czech Republic":"cont","Czechia":"cont","Hungary":"cont","Poland":"cont","Slovenia":"cont",
  "Italy":"med","Spain":"med","Portugal":"med","Greece":"med","Croatia":"med","Morocco":"med","Jordan":"med",
  "Iceland":"arctic","Norway":"arctic","Sweden":"arctic","Finland":"arctic","Denmark":"arctic","Estonia":"arctic",
  "Japan":"easia","South Korea":"easia","China":"easia","Taiwan":"easia","Hong Kong":"easia",
  "Vietnam":"trop","Indonesia":"trop","Thailand":"trop","Singapore":"trop","Malaysia":"trop",
  "India":"trop","Cambodia":"trop","Sri Lanka":"trop","Philippines":"trop",
  "Cuba":"trop","Costa Rica":"trop","Panama":"trop","Mexico":"trop","Brazil":"trop",
  "Ghana":"trop","Cameroon":"trop","Senegal":"trop","Kenya":"trop","Uganda":"trop","Rwanda":"trop",
  "Turks & Caicos":"trop","Bahamas":"trop","Jamaica":"trop","Haiti":"trop",
  "Tanzania":"trop","Tanzania (Indian Ocean)":"trop",
  "Nepal":"alt","Bhutan":"alt","Peru":"alt","Ecuador":"alt","Bolivia":"alt",
  "Argentina":"latam","Uruguay":"latam","Chile":"latam",
  "Australia":"shemi","New Zealand":"shemi","South Africa":"shemi","South Africa (Atlantic)":"shemi","Samoa":"shemi",
  "United States":"natemp","Canada":"natemp",
};

export function climOf(country) {
  return COUNTRY_CLIM[country] || "cont";
}
