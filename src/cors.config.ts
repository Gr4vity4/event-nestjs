export const allowedOrigins = [
  'https://event-nextjs-tau.vercel.app',
  'https://systemtechdesign.com',
];

export const corsOptions = {
  origin: (origin, callback) => {
    if (!origin) {
      // Allow requests with no origin (like mobile apps or curl requests)
      return callback(null, true);
    }

    // Parse the origin
    try {
      const url = new URL(origin);

      // Allow all localhost origins regardless of port
      if (url.hostname === 'localhost') {
        return callback(null, true);
      }
    } catch (error) {
      // If origin is not a valid URL, it will be caught here
      return callback(new Error('Not allowed by CORS'));
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
