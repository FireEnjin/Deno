export default async function getTemplate({ db, response, params }: any) {
  if (!params?.templateId) throw new Error("No template found!");
  const template = await db.find("templates", params.templateId);
  return template?.html;
}
