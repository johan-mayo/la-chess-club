import { SignIn } from "@clerk/nextjs";
import { Layout } from "@/components/Layout";
import { Container } from "@/components/Container";

export default function Page() {
  return (
    <Layout>
      <Container className="my-10">
        <div className="flex items-center justify-center w-full">
          <SignIn />
        </div>
      </Container>
    </Layout>
  );
}
