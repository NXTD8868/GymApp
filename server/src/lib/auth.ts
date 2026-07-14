import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { client,db } from "./db.ts";
export const auth = betterAuth({
    database: mongodbAdapter(db, {
        client, // optional, but without it database transactions are disabled
    }),
    emailAndPassword: { 
    enabled: true, 
  }, 
    trustedOrigins: ["http://localhost:8081"],

});

