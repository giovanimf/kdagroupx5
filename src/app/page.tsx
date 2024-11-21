import Container from "@/components/container";
import Header from "@/components/header";
import { getCurrentUser } from "@/lib/session";
import PainelHome from "@/components/painelhome";

export default async function Home() {
  const user = await getCurrentUser();
  return (
    <Header>
      <Container>
        <PainelHome />
      </Container>
    </Header>
  );
}
