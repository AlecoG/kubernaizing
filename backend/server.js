const express = require("express");
const cors = require('cors');
const mongoose = require("mongoose");
const port = process.env.PORT || 3001;
const mongoUri = process.env.MONGO_URI;
const routes = require("./routes");

async function main() {
  if (!mongoUri) {
    throw new Error("MONGO_URI must be configured");
  }

  await mongoose.connect(mongoUri, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  });

  const app = express();
  app.use(cors());
  app.use(express.json());

  app.get("/health/live", (_req, res) => res.sendStatus(200));
  app.get("/health/ready", (_req, res) => {
    res.sendStatus(mongoose.connection.readyState === 1 ? 200 : 503);
  });

  app.use("/api", routes);

  const server = app.listen(port, () => {
    console.log(`Server is listening on port: ${port}`);
  });

  const shutdown = async () => {
    server.close(async () => {
      await mongoose.disconnect();
      process.exit(0);
    });
  };

  process.on("SIGTERM", shutdown);
  process.on("SIGINT", shutdown);
}

main().catch((err) => {
  console.error("Unable to start API", err);
  process.exit(1);
});
