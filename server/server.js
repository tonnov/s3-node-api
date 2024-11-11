import express from "express";
import bucketRoutes from "../routes/bucket.routes.js";

const server = express();
server.use(express.json());

server.use("/api/bucket", bucketRoutes);

server.use((req, res) => {
  res.status(404).json({
    message: "Endpoint not found",
  });
});

export default server;
