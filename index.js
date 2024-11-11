import server from "./server/server.js";
import "dotenv/config";

server.listen(process.env.SERVER_PORT, () => {
  console.log("Server running on port", process.env.SERVER_PORT);
});
