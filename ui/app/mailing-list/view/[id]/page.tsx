import { MailingListView } from "./_components/MailingListView";

export default async function ViewMailingListPage(props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params;

  return (
    <>
      <MailingListView id={id} />
    </>
  );
}
