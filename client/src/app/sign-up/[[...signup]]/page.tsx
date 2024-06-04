import { SignUp } from "@clerk/nextjs";
import { Layout } from "@/components/Layout";
import { Container } from "@/components/Container";

export default function Page() {
  return (
    <Layout>
      <Container className="my-4">
        <div className="flex items-center justify-center w-full">
          <SignUp />
        </div>
      </Container>
    </Layout>
  );
}
