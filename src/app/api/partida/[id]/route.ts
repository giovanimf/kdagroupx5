// app/api/partida/[id]/route.ts
import { db as prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// Obter os detalhes de uma partida
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  const { id } = params;

  try {
    const partida = await prisma.partida.findUnique({
      where: { id },
    });

    if (!partida) {
      return NextResponse.json({ error: "Partida não encontrada." }, { status: 404 });
    }

    return NextResponse.json(partida);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Erro ao buscar a partida." }, { status: 500 });
  }
}

// Atualizar uma partida existente e ajustar os dados dos jogadores
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  const { id } = params;

  try {
    const { mvpId, bagreId, vitoria, derrota, time1Ids, time2Ids } = await request.json();

    // Busca a partida atual para comparar com os dados antigos
    const partidaAntiga = await prisma.partida.findUnique({ where: { id } });

    if (!partidaAntiga) {
      return NextResponse.json({ error: "Partida não encontrada." }, { status: 404 });
    }

    const jogadoresPromises: any[] = [];

    // Reverter alterações antigas
    if (partidaAntiga.vitoria) {
      const antigosVencedores =
        partidaAntiga.vitoria === "time1" ? partidaAntiga.time1Ids : partidaAntiga.time2Ids;

      const antigosDerrotados =
        partidaAntiga.derrota === "time1" ? partidaAntiga.time1Ids : partidaAntiga.time2Ids;

      // Reverte vitórias
      for (const jogadorId of antigosVencedores) {
        jogadoresPromises.push(
          prisma.jogador.update({
            where: { id: jogadorId },
            data: {
              vitorias: { decrement: 1 },
            },
          })
        );
      }

      // Reverte derrotas (somente se o valor atual for maior que 0)
      for (const jogadorId of antigosDerrotados) {
        jogadoresPromises.push(
          prisma.jogador.update({
            where: { id: jogadorId },
            data: {
              derrotas: { decrement: 1 },
            },
          })
        );
      }
    }

    // Reverter MVP
    if (partidaAntiga.mvpId) {
      jogadoresPromises.push(
        prisma.jogador.update({
          where: { id: partidaAntiga.mvpId },
          data: {
            mvp: { decrement: 1 },
          },
        })
      );
    }

    // Reverter Bagre
    if (partidaAntiga.bagreId) {
      jogadoresPromises.push(
        prisma.jogador.update({
          where: { id: partidaAntiga.bagreId },
          data: {
            bagre: { decrement: 1 },
          },
        })
      );
    }

    // Executa as reversões
    await Promise.all(jogadoresPromises);

    // Aplicar novas alterações
    const novosVencedores = vitoria === "time1" ? time1Ids : time2Ids;
    const novosDerrotados = derrota === "time1" ? time1Ids : time2Ids;

    const novasAlteracoesPromises = [];

    // Atualiza vencedores
    for (const jogadorId of novosVencedores) {
      novasAlteracoesPromises.push(
        prisma.jogador.update({
          where: { id: jogadorId },
          data: {
            vitorias: { increment: 1 },
          },
        })
      );
    }

    // Atualiza derrotados
    for (const jogadorId of novosDerrotados) {
      novasAlteracoesPromises.push(
        prisma.jogador.update({
          where: { id: jogadorId },
          data: {
            derrotas: { increment: 1 },
          },
        })
      );
    }

    // Atualiza MVP
    if (mvpId) {
      novasAlteracoesPromises.push(
        prisma.jogador.update({
          where: { id: mvpId },
          data: {
            mvp: { increment: 1 },
          },
        })
      );
    }

    // Atualiza Bagre
    if (bagreId) {
      novasAlteracoesPromises.push(
        prisma.jogador.update({
          where: { id: bagreId },
          data: {
            bagre: { increment: 1 },
          },
        })
      );
    }

    // Executa todas as atualizações
    await Promise.all(novasAlteracoesPromises);

    // Atualiza os dados da partida
    const partidaAtualizada = await prisma.partida.update({
      where: { id },
      data: {
        mvpId,
        bagreId,
        vitoria,
        derrota,
      },
    });

    return NextResponse.json(partidaAtualizada);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Erro: Erro ao atualizar a partida." }, { status: 500 });
  }
}

// Deletar uma partida
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  const { id } = params;

  try {
    const partida = await prisma.partida.findUnique({ where: { id } });
    if (!partida) {
      return NextResponse.json({ error: "Partida não encontrada." }, { status: 404 });
    }

    const jogadoresPromises: any[] = [];
    const vencedores = partida.vitoria === "time1" ? partida.time1Ids : partida.time2Ids;
    const derrotados = partida.derrota === "time1" ? partida.time1Ids : partida.time2Ids;

    // Revertendo vitórias e derrotas para os vencedores e derrotados
    for (const jogadorId of vencedores) {
      const jogador = await prisma.jogador.findUnique({ where: { id: jogadorId } });
      if (jogador) {
        const vitoriasRevertidas = Math.max(0, (jogador.vitorias ?? 0) - 1); // Reverte vitória
        jogadoresPromises.push(
          prisma.jogador.update({
            where: { id: jogadorId },
            data: { vitorias: vitoriasRevertidas }, // Atualiza o valor de vitórias
          })
        );
      }
    }

    for (const jogadorId of derrotados) {
      const jogador = await prisma.jogador.findUnique({ where: { id: jogadorId } });
      if (jogador) {
        const derrotasRevertidas = Math.max(0, (jogador.derrotas ?? 0) - 1); // Reverte derrota
        jogadoresPromises.push(
          prisma.jogador.update({
            where: { id: jogadorId },
            data: { derrotas: derrotasRevertidas }, // Atualiza o valor de derrotas
          })
        );
      }
    }

    // Atualiza MVP e Bagre, se existirem
    if (partida.mvpId) {
      jogadoresPromises.push(
        prisma.jogador.update({
          where: { id: partida.mvpId },
          data: {
            mvp: { decrement: 1 },
          },
        })
      );
    }

    if (partida.bagreId) {
      jogadoresPromises.push(
        prisma.jogador.update({
          where: { id: partida.bagreId },
          data: {
            bagre: { decrement: 1 },
          },
        })
      );
    }

    // Executa as reversões de vitórias, derrotas, MVP e Bagre
    await Promise.all(jogadoresPromises);

    // Exclui a partida
    await prisma.partida.delete({ where: { id } });

    return NextResponse.json({ message: "Partida deletada com sucesso." });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Erro ao deletar a partida." }, { status: 500 });
  }
}