import "https://deno.land/x/xhr@0.1.1/mod.ts";
import { installGlobals } from "https://deno.land/x/virtualstorage@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.125.0/http/server.ts";
import Database from "./database.ts";
installGlobals();

const db = new Database({
  config: {
    apiKey: "AIzaSyCnvI_B2nolJRcMfCL8RnsvC5aKkNEL7sU",
    authDomain: "fireenjin-mx.firebaseapp.com",
    databaseURL: "https://fireenjin-mx-default-rtdb.firebaseio.com",
    projectId: "fireenjin-mx",
    storageBucket: "fireenjin-mx.appspot.com",
    messagingSenderId: "823412030856",
    appId: "1:823412030856:web:0e0b2ae046ef913b4e4e3d",
    measurementId: "G-04DJ99NMQH",
  },
});

console.log("http://localhost:8000/");
serve(
  async (req: Request) => {
    console.log(await db.find("templates", "test"));
    //await db.collection("templates").doc("test").get());

    return new Response("Hello World\n");
  },
  { port: 8000 }
);
