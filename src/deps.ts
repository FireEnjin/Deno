import "https://deno.land/x/xhr@0.1.1/mod.ts";
import { installGlobals } from "https://deno.land/x/virtualstorage@0.1.0/mod.ts";
import { Application, Router } from "https://deno.land/x/oak/mod.ts";
import Database from "./database.ts";
import getTemplate from "./routes/getTemplate.ts";
import routeHtml from "./routeHtml.ts";
