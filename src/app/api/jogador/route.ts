// src/app/api/jogador/route.ts (GET)
import { db as prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

// Rota para listar todos os jogadores
export async function GET(request: NextRequest) {

  try {
    const jogadores = await prisma.jogador.findMany();
    return NextResponse.json(jogadores);
  } catch (error) {
    return NextResponse.json({ error: "Erro: Erro ao buscar jogadores." }, { status: 500 });
  }
}
