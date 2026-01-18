import { Navigation } from "@/components/Navigation";
import { getUser } from "@/lib/auth/actions";

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getUser();

  return (
    <>
      <Navigation userEmail={user?.email} />
      <main className="max-w-2xl mx-auto px-4 py-8">
        {children}
      </main>
    </>
  );
}
