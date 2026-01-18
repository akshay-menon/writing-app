import { getEntries } from "@/lib/entries/actions";
import { ArchiveClient } from "./ArchiveClient";

export default async function ArchivePage() {
  const entries = await getEntries();

  return <ArchiveClient initialEntries={entries} />;
}
