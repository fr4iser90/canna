import helmet from "helmet";

const helmetConfig = () => {
  return helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: [
          "'self'",
          "https://weed.fr4iserhome.com",
          "https://cdnjs.cloudflare.com",
          "https://cdn.jsdelivr.net",
          (req, res) => `'nonce-${res.locals.nonce}'`,
        ],
        styleSrc: [
          "'self'",
          "https://cdnjs.cloudflare.com",
          "https://cdn.jsdelivr.net",
        ],
        imgSrc: ["'self'", "data:"],
        connectSrc: [
          "'self'",
          "http://172.30.0.3:29101",
          "http://172.30.0.4",
          "https://weed.fr4iserhome.com",
          "https://weedbackend.fr4iserhome.com",
        ],
        fontSrc: ["'self'", "https://cdnjs.cloudflare.com", "data:"],
        objectSrc: ["'none'"],
        mediaSrc: ["'self'"],
        frameSrc: ["'self'"],
      },
    },
    hsts: {
      maxAge: 31536000, // 1 year in seconds
      includeSubDomains: true,
      preload: true,
    },
    xssFilter: true,
    noSniff: true,
    frameguard: {
      action: "deny",
    },
  });
};

export default helmetConfig;
