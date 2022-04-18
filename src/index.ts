import "https://deno.land/x/xhr@0.1.1/mod.ts";
import { installGlobals } from "https://deno.land/x/virtualstorage@0.1.0/mod.ts";
import { Application, Router } from "https://deno.land/x/oak/mod.ts";
import Database from "./database.ts";
import getTemplate from "./routes/getTemplate.ts";
import routeHtml from "./routeHtml.ts";
installGlobals();

const db = new Database({
  config: {
    apiKey: "AIzaSyAz5C9TRxQ9bUkTwVaD6Yc-Iisw57UslPM",
    authDomain: "fireenjin-live.firebaseapp.com",
    databaseURL: "https://fireenjin-live.firebaseio.com",
    projectId: "fireenjin-live",
    storageBucket: "fireenjin-live.appspot.com",
    messagingSenderId: "756564610596",
    appId: "1:756564610596:web:4fdf5a6ddfd319a93392b1",
    measurementId: "G-Q0ZHGFCQFN",
  },
});
const app = new Application();
const router = new Router();
router.get(
  "/",
  routeHtml(db, async () => "Hello World\n")
);
router.get("/template/:templateId", routeHtml(db, getTemplate));
app.use(router.routes());
app.listen({ port: 8000 });
