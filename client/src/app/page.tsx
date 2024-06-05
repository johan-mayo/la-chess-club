import { Button } from "@/components/Button";
import { Container } from "@/components/Container";
import { Layout } from "@/components/Layout";
import { Photos } from "@/components/Photos";
import Link from "next/link";

export default function Home() {
  return (
    <Layout>
      <Photos />
      <Container className="mt-10">
        <h1 className="text-center text-2xl font-semibold">
          Good Vibes All Around, Join Us!
        </h1>
        <div className="my-10 flex flex-col items-center justify-between space-y-2">
          <Button>
            <Link href="/event">Join Event</Link>
          </Button>
          <Button>Check Us Out On Instagram</Button>
        </div>
        <hr />
        <h1 className="text-gray-500 text-center mt-2">
          © 2024 La Chess Club. All rights reserved.
        </h1>
      </Container>
    </Layout>
  );
}
