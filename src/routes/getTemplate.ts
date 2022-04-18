export default async function getTemplate({ db, response, params }: any) {
  if (!params?.templateId) throw new Error("No template found!");
  const template = await db.find(params?.templateId);
  return template?.html || "^_^";
}
