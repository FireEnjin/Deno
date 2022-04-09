import HandlebarsJS from "https://dev.jspm.io/handlebars@4.7.7";
import Database from "./database.ts";

export default async function renderHandlebarsTemplate(
  db: Database,
  templateId: string,
  payload?: any
) {
  const template = await db.find("templates", templateId);

  return (HandlebarsJS as any).compile(
    (template?.html || "").replace(new RegExp("{{&gt;", "g"), "{{>")
  )(payload || {});
}
