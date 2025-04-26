import prisma from "@/lib/prisma";

export default async function Home() {
  const data = await prisma.user.findMany()
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <div>
          <h1>Hello from home</h1>
          <pre>{data[0].name}</pre>
        </div>
      </main>
    </div>
  );
}
