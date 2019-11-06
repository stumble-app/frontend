import env from './.env.json';

export const MAPS_API_KEY = env.MAPS_API_KEY;
export const SERVER_ADDR = env.API_SERVER_ADDR;

// hardcoded values for Atlanta; replace later
export const INIT_LOCATION = {
  latitude: 33.749,
  longitude: -84.38798
};

export const PLACE_ID = 'ChIJjQmTaV0E9YgRC2MLmS_e_mY';
export const NAME = 'Atlanta';

export const PLACEHOLDER_IMG = 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/be/404_Store_Not_Found.jpg/1024px-404_Store_Not_Found.jpg';

// hardcoded tags
export const TAGS = [
  'Budget',
  'Walkable',
  'Historical',
  'Art & Architecture',
  'Local Approved',
  'Iconic',
  'Foodie'
];

export const FIREBASE_CONFIG = {
  apiKey: env.FIREBASE_API_KEY,
  authDomain: env.FIREBASE_AUTH_DOMAIN,
  databaseURL: env.FIREBASE_DB_URL,
  projectId: env.FIREBASE_PROJECT_ID,
  storageBucket: '',
  messagingSenderId: env.FIREBASE_MESSAGING_SENDER_ID,
  appId: env.FIREBASE_APP_ID,
  measurementId: env.FIREBASE_MEASUREMENT_ID
};
