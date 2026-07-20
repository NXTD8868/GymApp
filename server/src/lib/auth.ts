import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { client,db } from "./db.ts";
import { expo } from "@better-auth/expo";
export const auth = betterAuth({
    database: mongodbAdapter(db, {
        client, // optional, but without it database transactions are disabled
    }),
    plugins: [expo()],
    emailAndPassword: { 
    enabled: true, 
  }, 
    trustedOrigins: ["http://localhost:8081",
                    "gymapp://",
                    'exp://',]
});

