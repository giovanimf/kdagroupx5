import { db as prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

// Criar uma nova partida
export async function POST(request: NextRequest) {
  const { time1Ids, time2Ids } = await request.json();

  try {
    const partida = await prisma.partida.create({
      data: {
        time1Ids,
        time2Ids,
        vitoria: null,
        derrota: null,
      },
    });

    return NextResponse.json(partida);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Erro: Erro ao criar a partida." }, { status: 500 });
  }
}

// Buscar todas as partidas
export async function GET() {
  try {
    const partidas = await prisma.partida.findMany({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(partidas);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Erro: Erro ao buscar as partidas." }, { status: 500 });
  }
}
