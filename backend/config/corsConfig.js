import cors from "cors";

const corsOptions = {
  origin: [
    "https://weed.fr4iserhome.com",
    "https://weedbackend.fr4iserhome.com",
    "http://172.30.0.3:29101/",
  ],
  optionsSuccessStatus: 200,
  methods: "GET,POST,PUT,DELETE,OPTIONS",
  credentials: true,
  allowedHeaders: [
    "Authorization",
    "Content-Type",
    "X-Requested-With",
    "Accept",
  ],
};

export default cors(corsOptions);
