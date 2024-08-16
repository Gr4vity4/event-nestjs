export const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:3001',
  'https://event-nextjs-tau.vercel.app',
  'https://systemtechdesign.com',
];

export const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  credentials: true,
};
