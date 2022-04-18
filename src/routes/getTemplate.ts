export default async function getTemplate({ db, response, params }: any) {
  if (!params?.templateId) throw new Error("No template found!");
  return db.find(params?.templateId);
}
