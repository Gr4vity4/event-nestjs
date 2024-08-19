export const allowedOrigins = [
  'https://event-nextjs-tau.vercel.app',
  'https://event.systemtechdesign.com',
  'https://systemtechdesign.com',
  'http://localhost:3001',
  'http://localhost:4001',
];

export const corsOptions = {
  origin: (origin, callback) => {
    if (!origin) {
      // Allow requests with no origin (like mobile apps or curl requests)
      return callback(null, true);
    }

    // Check against allowedOrigins for non-localhost origins
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  credentials: true,
};
