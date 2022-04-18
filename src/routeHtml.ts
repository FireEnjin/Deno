export default function routeHtml(
  db: any,
  routeFn: (context: any) => Promise<any>
) {
  return async ({ response, params }: any) => {
    response.headers.set("Content-Type", "text/html; charset=utf-8");
    response.body = await routeFn({ db, response, params });
  };
}
