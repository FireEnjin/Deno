import "https://deno.land/x/xhr@0.1.1/mod.ts";
import HandlebarsJS from "https://dev.jspm.io/handlebars@4.7.7";
import { installGlobals } from "https://deno.land/x/virtualstorage@0.1.0/mod.ts";
import { Application, Router } from "https://deno.land/x/oak/mod.ts";
import Database from "./database.ts";
import getTemplate from "./routes/getTemplate.ts";
import routeHtml from "./routeHtml.ts";
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
const partials = await db.list("templates", [
  {
    key: "partial",
    conditional: "==",
    value: true,
  },
]);
for (const partial of partials) {
  (HandlebarsJS as any).registerPartial(partial?.id, partial?.html || "");
}
(HandlebarsJS as any).registerHelper("formatUSD", (amount: number) => {
  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  });

  return formatter.format(amount ? amount : 0);
});
const app = new Application();
const router = new Router();
router.get(
  "/",
  routeHtml(HandlebarsJS, db, async () => "Hello World\n")
);
router.get("/template/:templateId", routeHtml(HandlebarsJS, db, getTemplate));
app.use(router.routes());
app.listen({ port: 8000 });
