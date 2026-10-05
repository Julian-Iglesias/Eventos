import "dotenv/config"

export const config = {
  port: process.env.port|| 8080,
  nodeEnv: process.env.node_env|| "development",
  mongoUrl: process.env.mongo_url|| "",
  jwtSecret: process.env.jwt_secret
   || ""
}