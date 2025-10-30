import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";
import { Navbar } from "@/components/navbar";

async function checkAuthAndRedirect() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/login");
  }
}

export default async function PrivateLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  await checkAuthAndRedirect();

  return (
    <div className="bg-secondary min-h-screen">
      <Navbar />
      <div className="container mx-auto p-4 md:p-0">{children}</div>
    </div>
  );
}
