import { db as prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

// Rota para listar todos os jogadores
export async function GET(request: NextRequest) {
  try {
    const jogadores = await prisma.jogador.findMany();

    return new NextResponse(JSON.stringify(jogadores), {
      status: 200,
      headers: {
        "Cache-Control": "no-store, max-age=0", // Garante que os dados não sejam armazenados em cache
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    return new NextResponse(
      JSON.stringify({ error: "Erro: Erro ao buscar jogadores." }),
      {
        status: 500,
        headers: {
          "Cache-Control": "no-store, max-age=0", // Mesmo em erros, não cacheia
          "Content-Type": "application/json",
        },
      }
    );
  }
}
