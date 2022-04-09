import HandlebarsJS from "https://dev.jspm.io/handlebars@4.7.7";
import Database from "./database.ts";

export default async function renderHandlebarsTemplate(
  db: Database,
  templateId: string,
  payload?: any
) {
  const partials = await db.list("templates", [
    {
      key: "partial",
      conditional: "==",
      value: true,
    },
  ]);
  const template = await db.find("templates", templateId);
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

  return (HandlebarsJS as any).compile(
    (template?.html || "").replace(new RegExp("{{&gt;", "g"), "{{>")
  )(payload || {});
}
