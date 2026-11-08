export interface ApiCategory {
  id: string;
  label: string;
  description: string;
}

export const API_CATEGORIES: ApiCategory[] = [
  {
    id: 'first-party',
    label: 'First-party',
    description: 'Stable static endpoints published directly by ORIZ.IN.',
  },
  {
    id: 'development',
    label: 'Development',
    description: 'Code, repositories, and test data for building software.',
  },
  {
    id: 'weather-earth',
    label: 'Weather & Earth',
    description: 'Forecasts, geoscience, and environmental observations.',
  },
  {
    id: 'finance',
    label: 'Finance',
    description: 'Reference rates and market data. Always verify terms and timeliness.',
  },
  {
    id: 'reference-data',
    label: 'Reference data',
    description: 'Countries, calendars, postal places, and development indicators.',
  },
  {
    id: 'culture-media',
    label: 'Culture & media',
    description: 'Public collections, images, and encyclopedic datasets.',
  },
];

export interface ApiEntry {
  slug: string;
  name: string;
  description: string;
  provider: string;
  category: string;
  baseUrl: string;
  docsUrl: string;
  auth: string;
  authNote: string;
  pricing: string;
  rateLimit: string;
  cors: string;
  format: string;
  license: string;
  termsUrl?: string;
  lastChecked: string;
  verification: string;
  exampleRequest: string;
  exampleResponse: string;
  exampleNote?: string;
  notes: string[];
  related?: string[];
  featured?: boolean;
  firstParty?: boolean;
}

const CHECKED = '2026-10-25';

export const APIS: ApiEntry[] = [
  {
    slug: 'oriz-static-data',
    name: 'ORIZ.IN Static Data Endpoints',
    description:
      'Versioned JSON files generated from the same registries that power this site: tools, categories, APIs, learning paths, glossary terms, and article metadata.',
    provider: 'ORIZ.IN',
    category: 'first-party',
    baseUrl: 'https://oriz.in/data/',
    docsUrl: '/developers/',
    auth: 'None',
    authNote:
      'No account or key is required. These are static files on Cloudflare Pages, not dynamic database queries.',
    pricing: 'Free.',
    rateLimit:
      'No application-level rate limit. Cloudflare and normal caching behavior apply; cache responses and avoid aggressive polling.',
    cors: 'Allowed: the generated headers expose /data/* to browser requests.',
    format: 'JSON',
    license:
      'Metadata is published under CC BY 4.0. The generator code is MIT licensed. Article bodies are not included.',
    termsUrl: 'https://oriz.in/terms/',
    lastChecked: CHECKED,
    verification:
      'First-party endpoints generated from the repository registries at build time. Rebuilt on every deployment.',
    exampleRequest: 'curl https://oriz.in/data/tools.json',
    exampleResponse: `{
  "version": "1.0",
  "generated": "2026-10-25T00:00:00.000Z",
  "count": 50,
  "tools": [
    {
      "slug": "json-formatter",
      "title": "JSON Formatter & Validator",
      "category": "data-formats",
      "status": "stable",
      "url": "https://oriz.in/tools/json-formatter/"
    }
  ]
}`,
    exampleNote:
      'Illustrative shape produced by the build. The generated timestamp and counts reflect the deployment.',
    notes: [
      'The files are generated at build time; there is no query language or write API.',
      'Treat schema version 1.0 as a public contract and watch the README before relying on it in automation.',
      'No article content, personal data, analytics data, or credentials are exposed.',
    ],
    related: ['github-rest', 'dummyjson'],
    featured: true,
    firstParty: true,
  },
  {
    slug: 'github-rest',
    name: 'GitHub REST API',
    description:
      'Query public repositories, issues, users, releases, and other GitHub resources over a well-documented REST interface.',
    provider: 'GitHub',
    category: 'development',
    baseUrl: 'https://api.github.com',
    docsUrl: 'https://docs.github.com/en/rest',
    auth: 'Optional token',
    authNote:
      'Unauthenticated requests are allowed at a low rate. A personal access token raises limits and is required for private data and write operations.',
    pricing:
      'Free REST API. GitHub plan limits and terms still apply.',
    rateLimit:
      '60 requests per hour per IP unauthenticated; 5,000 per hour for authenticated users (verified response header reported 60 at review).',
    cors: 'Allowed (Access-Control-Allow-Origin: * observed).',
    format: 'JSON',
    license:
      'API use is governed by GitHub’s terms. Repository content keeps its own license.',
    termsUrl:
      'https://docs.github.com/en/site-policy/github-terms/github-terms-of-service',
    lastChecked: CHECKED,
    verification:
      'Endpoint and CORS headers tested on 2026-10-25 with an unauthenticated request.',
    exampleRequest: 'curl -H "Accept: application/vnd.github+json" https://api.github.com/repos/withastro/astro',
    exampleResponse: `{
  "id": 348060227,
  "name": "astro",
  "full_name": "withastro/astro",
  "private": false,
  "owner": {
    "login": "withastro"
  }
}`,
    exampleNote: 'Trimmed response; a real repository object contains many more fields.',
    notes: [
      'Use conditional requests and cache responses to stay within limits.',
      'The unauthenticated limit is shared by the IP address, not just your application.',
      'Do not expose personal access tokens in client-side code.',
    ],
    related: ['jsonplaceholder', 'oriz-static-data'],
    featured: true,
  },
  {
    slug: 'open-meteo',
    name: 'Open-Meteo',
    description:
      'Free weather forecasts and historical weather data for coordinates worldwide, with hourly and daily variables and no API key.',
    provider: 'Open-Meteo',
    category: 'weather-earth',
    baseUrl: 'https://api.open-meteo.com',
    docsUrl: 'https://open-meteo.com/en/docs',
    auth: 'None',
    authNote: 'No account or key is required for the free endpoint.',
    pricing:
      'Free for non-commercial use. Commercial use requires the provider’s commercial plan.',
    rateLimit:
      'No published per-minute quota was found in the public documentation review; fair-use limits and licensing terms apply.',
    cors: 'Allowed (Access-Control-Allow-Origin: * observed).',
    format: 'JSON',
    license:
      'Weather data sources carry their own attribution and licensing requirements; see the provider documentation before redistribution.',
    termsUrl: 'https://open-meteo.com/en/license',
    lastChecked: CHECKED,
    verification:
      'Forecast endpoint and CORS headers tested on 2026-10-25.',
    exampleRequest:
      'curl "https://api.open-meteo.com/v1/forecast?latitude=51.5074&longitude=-0.1278&current=temperature_2m,wind_speed_10m"',
    exampleResponse: `{
  "latitude": 51.51147,
  "longitude": -0.13078308,
  "timezone": "GMT",
  "current_units": {
    "temperature_2m": "°C",
    "wind_speed_10m": "km/h"
  },
  "current": {
    "time": "2026-10-25T03:45",
    "temperature_2m": 10.6,
    "wind_speed_10m": 23.0
  }
}`,
    exampleNote: 'Trimmed live response from the verification request.',
    notes: [
      'Specify only the variables you need; response size and computation time grow with the request.',
      'Time zone defaults vary; pass a timezone explicitly if your UI displays local dates.',
      'Attribution to the underlying weather models is required by their licenses.',
    ],
    related: ['usgs-earthquakes'],
    featured: true,
  },
  {
    slug: 'usgs-earthquakes',
    name: 'USGS Earthquake Catalog',
    description:
      'GeoJSON earthquake feeds from the U.S. Geological Survey, including magnitude, location, alert level, and tsunami flags.',
    provider: 'U.S. Geological Survey',
    category: 'weather-earth',
    baseUrl: 'https://earthquake.usgs.gov',
    docsUrl: 'https://earthquake.usgs.gov/fdsnws/event/1/',
    auth: 'None',
    authNote: 'Public feeds require no key.',
    pricing: 'Free public data.',
    rateLimit:
      'No API key or published per-request quota for the summary feeds; avoid excessive polling and cache results.',
    cors: 'Allowed (Access-Control-Allow-Origin: * observed).',
    format: 'GeoJSON',
    license:
      'USGS information is generally public domain; review the USGS copyright and credit policy for attribution details.',
    termsUrl:
      'https://www.usgs.gov/information-policies-and-instructions/copyrights-and-credits',
    lastChecked: CHECKED,
    verification:
      'Significant-earthquakes feed and CORS headers tested on 2026-10-25.',
    exampleRequest:
      'curl https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_month.geojson',
    exampleResponse: `{
  "type": "FeatureCollection",
  "metadata": {
    "title": "USGS Significant Earthquakes, Past Month",
    "count": 21,
    "status": 200
  },
  "features": [
    {
      "type": "Feature",
      "properties": {
        "mag": 6.5,
        "place": "Bonin Islands, Japan region",
        "alert": "green",
        "tsunami": 1
      }
    }
  ]
}`,
    exampleNote:
      'Trimmed live response. Feed contents change continuously; the example is not a current alert.',
    notes: [
      'These feeds are summaries, not a substitute for official emergency guidance.',
      'Event counts and properties change as agencies review data.',
      'GeoJSON uses longitude, latitude ordering in coordinates.',
    ],
    related: ['open-meteo', 'world-bank'],
  },
  {
    slug: 'frankfurter',
    name: 'Frankfurter Exchange Rates',
    description:
      'Exchange rate data published by the European Central Bank, exposed as a simple JSON API with no key and no account.',
    provider: 'Frankfurter',
    category: 'finance',
    baseUrl: 'https://api.frankfurter.dev/v1',
    docsUrl: 'https://frankfurter.dev/',
    auth: 'None',
    authNote: 'No key is required.',
    pricing: 'Free, open-source project.',
    rateLimit:
      'No published application-level quota was found; cache rates and avoid polling in a loop.',
    cors: 'Allowed (Access-Control-Allow-Origin: * observed).',
    format: 'JSON',
    license:
      'Data originates from the European Central Bank and partner central banks; see the project documentation and ECB terms.',
    termsUrl: 'https://frankfurter.dev/',
    lastChecked: CHECKED,
    verification:
      'Latest-rates endpoint tested on 2026-10-25. The legacy api.frankfurter.app host redirected to api.frankfurter.dev/v1 during testing.',
    exampleRequest:
      'curl "https://api.frankfurter.dev/v1/latest?from=USD&to=EUR"',
    exampleResponse: `{
  "amount": 1.0,
  "base": "USD",
  "date": "2026-10-23",
  "rates": {
    "EUR": 0.89342
  }
}`,
    exampleNote:
      'Live response at review. Rates are reference rates, not transaction quotes.',
    notes: [
      'ECB reference rates are normally published on working days, not in real time.',
      'Use the new api.frankfurter.dev/v1 base; the old host redirects.',
      'Do not present reference rates as guaranteed conversion prices.',
    ],
    related: ['coingecko', 'world-bank'],
    featured: true,
  },
  {
    slug: 'coingecko',
    name: 'CoinGecko Public API',
    description:
      'Cryptocurrency prices, market data, and metadata. Useful for dashboards and experiments, with changing rate limits and terms.',
    provider: 'CoinGecko',
    category: 'finance',
    baseUrl: 'https://api.coingecko.com/api/v3',
    docsUrl: 'https://docs.coingecko.com/',
    auth: 'Optional API key',
    authNote:
      'The public endpoint responded without a key at review. A Demo API key and paid plans are recommended for production and higher limits.',
    pricing:
      'Free public/Demo access exists with limits; paid plans are available. Verify current terms before commercial use.',
    rateLimit:
      'Public rate limits apply and can change. Response headers and documentation are authoritative.',
    cors: 'Allowed (Access-Control-Allow-Origin: * observed).',
    format: 'JSON',
    license:
      'API data and usage are subject to CoinGecko’s terms; attribution requirements apply.',
    termsUrl: 'https://www.coingecko.com/en/api_terms',
    lastChecked: CHECKED,
    verification:
      'Simple price endpoint and CORS headers tested on 2026-10-25 without a key.',
    exampleRequest:
      'curl "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd"',
    exampleResponse: `{
  "bitcoin": {
    "usd": 80809
  }
}`,
    exampleNote:
      'Live value at review. Prices change constantly and this is not investment advice.',
    notes: [
      'This is not a trading or settlement feed; latency and coverage vary.',
      'Cache responses and respect rate-limit headers.',
      'Display attribution according to the provider’s terms.',
    ],
    related: ['frankfurter'],
  },
  {
    slug: 'nager-date',
    name: 'Nager.Date Public Holidays',
    description:
      'Public holiday data by country and year, including localized names, holiday types, and subdivisions where available.',
    provider: 'Nager.Date',
    category: 'reference-data',
    baseUrl: 'https://date.nager.at/api/v3',
    docsUrl: 'https://date.nager.at/Api',
    auth: 'None',
    authNote: 'Public holiday endpoints work without a key.',
    pricing: 'Free public service.',
    rateLimit:
      'No exact quota was published in the documentation reviewed; be conservative, cache yearly results, and do not poll.',
    cors: 'Allowed (Access-Control-Allow-Origin: * observed).',
    format: 'JSON',
    license:
      'Check the service documentation for data provenance and reuse terms.',
    termsUrl: 'https://date.nager.at/Api',
    lastChecked: CHECKED,
    verification:
      'US 2026 public holiday endpoint and CORS headers tested on 2026-10-25.',
    exampleRequest:
      'curl https://date.nager.at/api/v3/PublicHolidays/2026/US',
    exampleResponse: `[
  {
    "date": "2026-01-01",
    "localName": "New Year's Day",
    "name": "New Year's Day",
    "countryCode": "US",
    "global": true,
    "types": ["Public", "Bank"]
  }
]`,
    exampleNote: 'First record of the live response, trimmed for clarity.',
    notes: [
      'Public holiday calendars are not the same as business closure calendars.',
      'Subnational holidays may vary; inspect the counties field where present.',
      'Cache a year at a time instead of requesting it on every page view.',
    ],
    related: ['zippopotam', 'world-bank'],
  },
  {
    slug: 'zippopotam',
    name: 'Zippopotam.us',
    description:
      'A small postal-code lookup API that returns place names, states, and approximate coordinates for supported countries.',
    provider: 'Zippopotam.us',
    category: 'reference-data',
    baseUrl: 'https://api.zippopotam.us',
    docsUrl: 'https://api.zippopotam.us/',
    auth: 'None',
    authNote: 'No key is required.',
    pricing: 'Free public service.',
    rateLimit:
      'No documented quota was found at review; cache lookups and avoid bulk crawling.',
    cors: 'Allowed (Access-Control-Allow-Origin: * observed).',
    format: 'JSON',
    license:
      'Postal data availability and terms vary by country; check the project site.',
    termsUrl: 'https://api.zippopotam.us/',
    lastChecked: CHECKED,
    verification:
      'US 90210 lookup and CORS headers tested on 2026-10-25.',
    exampleRequest: 'curl https://api.zippopotam.us/us/90210',
    exampleResponse: `{
  "country": "United States",
  "country abbreviation": "US",
  "post code": "90210",
  "places": [
    {
      "place name": "Beverly Hills",
      "state": "California",
      "state abbreviation": "CA",
      "latitude": "34.0901",
      "longitude": "-118.4065"
    }
  ]
}`,
    exampleNote: 'Live response at review.',
    notes: [
      'Coverage is not universal; unsupported country or code combinations fail.',
      'Coordinates are approximate and should not be used for navigation.',
      'A postal code can map to multiple places, so treat the result as a list.',
    ],
    related: ['nager-date'],
  },
  {
    slug: 'world-bank',
    name: 'World Bank Open Data API',
    description:
      'Country metadata and development indicators from the World Bank, available as JSON or XML with pagination.',
    provider: 'World Bank',
    category: 'reference-data',
    baseUrl: 'https://api.worldbank.org/v2',
    docsUrl:
      'https://datahelpdesk.worldbank.org/knowledgebase/articles/889392',
    auth: 'None',
    authNote: 'No key is required for the public API.',
    pricing: 'Free public data.',
    rateLimit:
      'No key and no published per-request quota for normal use; paginate deliberately and cache.',
    cors: 'Allowed (Access-Control-Allow-Origin: * observed).',
    format: 'JSON and XML',
    license:
      'World Bank datasets have their own terms; attribution and license requirements vary by dataset.',
    termsUrl:
      'https://www.worldbank.org/en/about/legal/terms-of-use-for-datasets',
    lastChecked: CHECKED,
    verification:
      'Country metadata endpoint and CORS headers tested on 2026-10-25.',
    exampleRequest: 'curl "https://api.worldbank.org/v2/country/US?format=json"',
    exampleResponse: `[
  {
    "page": 1,
    "pages": 1,
    "per_page": "50",
    "total": 1
  },
  [
    {
      "id": "USA",
      "iso2Code": "US",
      "name": "United States",
      "region": { "value": "North America" },
      "incomeLevel": { "value": "High income" },
      "capitalCity": "Washington D.C."
    }
  ]
]`,
    exampleNote:
      'Trimmed live response. The API returns a metadata array followed by the data array.',
    notes: [
      'The two-element top-level array shape is easy to miss in parsers.',
      'Use the format query parameter explicitly.',
      'Indicators update on different schedules; record the observation period.',
    ],
    related: ['nager-date', 'frankfurter'],
  },
  {
    slug: 'artic-institute',
    name: 'Art Institute of Chicago API',
    description:
      'Collection metadata and IIIF image references for artworks in the Art Institute of Chicago, including titles, artists, dates, and license fields.',
    provider: 'Art Institute of Chicago',
    category: 'culture-media',
    baseUrl: 'https://api.artic.edu/api/v1',
    docsUrl: 'https://api.artic.edu/docs/',
    auth: 'None',
    authNote: 'No key is required for the public API.',
    pricing: 'Free.',
    rateLimit:
      'No published per-request quota was found at review; use filters and cache. Images are served separately through IIIF.',
    cors: 'Allowed (Access-Control-Allow-Origin: * observed).',
    format: 'JSON',
    license:
      'Response metadata includes its own license information. Artwork images and descriptions may carry different rights; check each record.',
    termsUrl: 'https://www.artic.edu/terms',
    lastChecked: CHECKED,
    verification:
      'Artwork metadata endpoint and CORS headers tested on 2026-10-25.',
    exampleRequest:
      'curl "https://api.artic.edu/api/v1/artworks/129884?fields=id,title,artist_display,date_display,image_id"',
    exampleResponse: `{
  "data": {
    "id": 129884,
    "title": "Starry Night and the Astronauts",
    "date_display": "1972",
    "artist_display": "Alma Thomas\\nAmerican, 1891–1978",
    "image_id": "e966799b-97ee-1cc6-bd2f-a94b4b8bb8f9"
  },
  "info": {
    "license_text": "The description field is licensed under CC BY 4.0... All other data is CC0..."
  }
}`,
    exampleNote:
      'Trimmed live response. The license text is authoritative in the full record.',
    notes: [
      'Request only the fields you need with the fields parameter.',
      'Image licensing is not implied by metadata licensing.',
      'Use the IIIF image service for image delivery rather than hotlinking unpredictable sizes.',
    ],
    related: ['pokeapi'],
  },
  {
    slug: 'pokeapi',
    name: 'PokéAPI',
    description:
      'A community-built REST API for Pokémon species, moves, abilities, types, and game metadata. Useful for learning and experimentation.',
    provider: 'PokéAPI',
    category: 'culture-media',
    baseUrl: 'https://pokeapi.co/api/v2',
    docsUrl: 'https://pokeapi.co/docs/v2',
    auth: 'None',
    authNote: 'No key is required.',
    pricing: 'Free, community-supported.',
    rateLimit:
      'No fixed public rate limit is documented; the project asks clients to cache aggressively and be considerate.',
    cors: 'Allowed (Access-Control-Allow-Origin: * observed).',
    format: 'JSON',
    license:
      'The API code is open source. Pokémon names, characters, and imagery remain the property of their respective rights holders.',
    termsUrl: 'https://pokeapi.co/docs/v2',
    lastChecked: CHECKED,
    verification:
      'Pokémon endpoint and CORS headers tested on 2026-10-25.',
    exampleRequest: 'curl https://pokeapi.co/api/v2/pokemon/pikachu',
    exampleResponse: `{
  "id": 25,
  "name": "pikachu",
  "base_experience": 112,
  "height": 4,
  "weight": 60,
  "is_default": true
}`,
    exampleNote: 'Trimmed live response. Measurements use decimetres and hectograms.',
    notes: [
      'Cache resource responses; many fields are effectively static.',
      'Respect the Pokémon rights holders when displaying names, sprites, or artwork.',
      'The data is fan-maintained; verify edge cases against official sources if it matters.',
    ],
    related: ['artic-institute'],
  },
  {
    slug: 'jsonplaceholder',
    name: 'JSONPlaceholder',
    description:
      'A disposable fake REST API for prototypes and tests, with predictable posts, comments, users, albums, and photos.',
    provider: 'JSONPlaceholder',
    category: 'development',
    baseUrl: 'https://jsonplaceholder.typicode.com',
    docsUrl: 'https://jsonplaceholder.typicode.com/',
    auth: 'None',
    authNote: 'No key is required.',
    pricing: 'Free testing service.',
    rateLimit:
      'It is a shared demonstration service with no SLA. Do not use it for production data or high-volume traffic.',
    cors: 'Allowed (origin-specific CORS response observed).',
    format: 'JSON',
    license:
      'Review the project’s own terms and repository for licensing details. The sample content is not real user data.',
    termsUrl: 'https://jsonplaceholder.typicode.com/',
    lastChecked: CHECKED,
    verification:
      'Post endpoint and CORS headers tested on 2026-10-25.',
    exampleRequest: 'curl https://jsonplaceholder.typicode.com/posts/1',
    exampleResponse: `{
  "userId": 1,
  "id": 1,
  "title": "sunt aut facere repellat provident occaecati excepturi optio reprehenderit",
  "body": "quia et suscipit..."
}`,
    exampleNote: 'Trimmed live response. All content is fictional test data.',
    notes: [
      'Writes are simulated or discarded; do not expect persistence.',
      'The endpoint is popular and can be slow; never make it a dependency of production pages.',
      'Use local fixtures for automated tests when determinism matters.',
    ],
    related: ['dummyjson', 'github-rest'],
  },
  {
    slug: 'dummyjson',
    name: 'DummyJSON',
    description:
      'Fake e-commerce data for building and testing interfaces: products, carts, users, posts, and more with realistic JSON shapes.',
    provider: 'DummyJSON',
    category: 'development',
    baseUrl: 'https://dummyjson.com',
    docsUrl: 'https://dummyjson.com/docs',
    auth: 'None',
    authNote:
      'Public sample endpoints work without a key. Some simulated auth flows are documented separately.',
    pricing: 'Free for testing and demos.',
    rateLimit:
      'Response headers reported a rate limit of 100 during review; the documentation is authoritative for the current window and rules.',
    cors: 'Allowed (origin-specific CORS response observed).',
    format: 'JSON',
    license:
      'Sample data and service usage are subject to the project’s documentation and terms.',
    termsUrl: 'https://dummyjson.com/docs',
    lastChecked: CHECKED,
    verification:
      'Product endpoint and CORS headers tested on 2026-10-25.',
    exampleRequest: 'curl https://dummyjson.com/products/1',
    exampleResponse: `{
  "id": 1,
  "title": "Essence Mascara Lash Princess",
  "description": "The Essence Mascara Lash Princess is a popular mascara...",
  "category": "beauty"
}`,
    exampleNote: 'Trimmed live response. Products and reviews are fictional.',
    notes: [
      'Fake data is suitable for UI tests, not for factual claims.',
      'Check rate-limit headers and avoid live calls in production pages.',
      'Some endpoints simulate authentication; do not treat them as a security model.',
    ],
    related: ['jsonplaceholder', 'oriz-static-data'],
  },
];

export const FEATURED_APIS = APIS.filter((api) => api.featured);

export function getApi(slug: string): ApiEntry | undefined {
  return APIS.find((api) => api.slug === slug);
}

export function getApiCategory(id: string): ApiCategory | undefined {
  return API_CATEGORIES.find((category) => category.id === id);
}
