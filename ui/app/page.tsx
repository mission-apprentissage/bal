import { NotionAPI } from "notion-client";

import { Doc } from "@/app/components/NotionDoc";

export const revalidate = 60;

const fetchData = async () => {
  const notion = new NotionAPI();
  const recordMap = await notion.getPage("HOME_PAGE-ea731d06bf2e4e0f8bcb5945b28c5a8c");
  return recordMap;
};

export default async function Home() {
  const recordMap = await fetchData();
  return <Doc recordMap={recordMap} />;
}
