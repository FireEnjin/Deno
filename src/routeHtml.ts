export default function routeHtml(
  handlebars: any,
  db: any,
  routeFn: (context: any) => Promise<any>
) {
  return async ({ response, params }: any) => {
    response.headers.set("Content-Type", "text/html; charset=utf-8");
    response.body = await routeFn({ handlebars, db, response, params });
  };
}
