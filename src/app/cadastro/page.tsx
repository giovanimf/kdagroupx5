import Container from "@/components/container";
import Header from "@/components/header";
import Link from "next/link";
import Form from "./components/form";
export default function Cadastro() {
  return (
    <Header>
      <Container>
        < Link href="/" > <span className="md:text-9xl text-5xl font-semibold font-chakra text-titlebase2 hover:text-colorMintGreen titleshadow">KDA GROUP - X5</span></Link >
        {/* Conteúdo */}
        <div className="md:max-w-screen-md w-full mx-auto p-4 md:p-4 flex flex-col gap-4 justify-center text-center rounded-md bg-colorMidnightNavy border-colorSlateBlue border-2">
          <h2 className="text-2xl font-bold text-white">Cadastro</h2>
          <Form />
        </div>
      </Container>
    </Header>
  );
}