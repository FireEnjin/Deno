import renderHandlebarsTemplate from "../renderHandlebarsTemplate.ts";

export default async function getTemplate({ db, response, params }: any) {
  if (!params?.templateId) throw new Error("No template found!");
  return renderHandlebarsTemplate(db, params.templateId);
}
