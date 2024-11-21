"use client";

import { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";
import { Jogador } from "@prisma/client";
import { useRouter } from "next/navigation";

// Função para buscar jogadores no banco de dados
const fetchJogadores = async (): Promise<Jogador[]> => {
  const response = await fetch("/api/jogador");
  const data = await response.json();
  return data;
};

const Sorteio = () => {
  const [jogadores, setJogadores] = useState<Jogador[]>([]);
  const [selecionados, setSelecionados] = useState<Jogador[]>([]);
  const [time1, setTime1] = useState<Jogador[]>([]);
  const [time2, setTime2] = useState<Jogador[]>([]);
  const router = useRouter();

  // Busca inicial de jogadores
  useEffect(() => {
    fetchJogadores().then(setJogadores);
  }, []);

  const handleSorteio = () => {
    // Verifica se há jogadores selecionados
    if (selecionados.length === 0) {
      alert("Selecione jogadores para o sorteio.");
      return;
    }

    // Faz o sorteio aleatório dos jogadores selecionados
    const shuffled = [...selecionados].sort(() => Math.random() - 0.5);
    const mid = Math.ceil(shuffled.length / 2); // Divisão dos times
    const newTime1 = shuffled.slice(0, mid);
    const newTime2 = shuffled.slice(mid);

    // Acrescenta os jogadores aos times, sem sobrescrever os jogadores já presentes
    setTime1((prevTime1) => [...prevTime1, ...newTime1.filter((j) => !prevTime1.some((existing) => existing.id === j.id))]);
    setTime2((prevTime2) => [...prevTime2, ...newTime2.filter((j) => !prevTime2.some((existing) => existing.id === j.id))]);

    // Remove os jogadores sorteados da lista de jogadores disponíveis
    const remainingJogadores = jogadores.filter(
      (jogador) => !selecionados.some((s) => s.id === jogador.id)
    );
    setJogadores(remainingJogadores);

    // Limpa a seleção após o sorteio
    setSelecionados([]);
  };

  const handleCriarPartida = async () => {
    // Verifica se há jogadores em ambos os times
    if (time1.length === 0 || time2.length === 0) {
      alert("Ambos os times precisam ter jogadores para criar uma partida.");
      return;
    }

    try {
      const response = await fetch("/api/partida", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          time1Ids: time1.map((jogador) => jogador.id),
          time2Ids: time2.map((jogador) => jogador.id),
        }),
      });

      // Se a resposta for bem-sucedida (status 2xx)
      if (response.ok) {
        const data = await response.json();
        alert("Partida criada com sucesso!");
        // Redireciona para a página de ranking
        router.push("/partidas");
      } else {
        // Caso a resposta não seja 2xx, exibe um erro
        alert("Erro ao criar partida. Tente novamente.");
      }
    } catch (error) {
      // Caso ocorra algum erro na requisição
      console.error("Erro ao criar a partida:", error);
      alert("Erro ao criar partida. Tente novamente.");
    }
  };

  const onDragEnd = (result: DropResult) => {
    const { source, destination } = result;

    // Se o item não foi solto em um destino válido
    if (!destination) return;

    // Se o jogador foi arrastado para os times, ele precisa ser removido da tabela de "Jogadores"
    if (destination.droppableId === "time1" || destination.droppableId === "time2") {
      const jogador = jogadores.find((j) => j.id.toString() === source.droppableId);
      if (jogador) {
        // Remove o jogador da lista de jogadores
        setJogadores((prevJogadores) => prevJogadores.filter((j) => j.id !== jogador.id));
      }
    }

    const lists: { [key: string]: Jogador[] } = {
      jogadores: [...jogadores],
      time1: [...time1],
      time2: [...time2],
    };

    const sourceList = lists[source.droppableId];
    const destList = lists[destination.droppableId];

    // Remover o item da lista de origem
    const [moved] = sourceList.splice(source.index, 1);

    // Adicionar o item na lista de destino
    destList.splice(destination.index, 0, moved);

    // Atualizar os estados
    setJogadores(lists.jogadores);
    setTime1(lists.time1);
    setTime2(lists.time2);
  };

  const handleSelecionarJogador = (jogador: Jogador) => {
    const isSelected = selecionados.some((j) => j.id === jogador.id);

    // Se o jogador já está selecionado, remove ele da lista de selecionados
    if (isSelected) {
      setSelecionados(selecionados.filter((j) => j.id !== jogador.id));

      // Também remove o jogador dos times, se ele estiver lá
      setTime1(time1.filter((j) => j.id !== jogador.id));
      setTime2(time2.filter((j) => j.id !== jogador.id));
    } else {
      // Caso contrário, adiciona o jogador aos selecionados
      setSelecionados([...selecionados, jogador]);
    }
  };

  const handleReset = async () => {
    // Resetar os times e a seleção
    setTime1([]);
    setTime2([]);
    setSelecionados([]);

    // Recarregar todos os jogadores
    const allJogadores = await fetchJogadores();
    setJogadores(allJogadores);
  };

  const handleMoveBackToJogadores = (jogador: Jogador, fromTime: "time1" | "time2") => {
    // Remover o jogador do time correspondente
    if (fromTime === "time1") {
      setTime1(time1.filter((j) => j.id !== jogador.id));
    } else if (fromTime === "time2") {
      setTime2(time2.filter((j) => j.id !== jogador.id));
    }

    // Adicionar o jogador de volta à lista de jogadores, caso ele não esteja duplicado
    setJogadores((prevJogadores) => {
      if (!prevJogadores.some((j) => j.id === jogador.id)) {
        return [...prevJogadores, jogador];
      }
      return prevJogadores;
    });
  };

  return (
    <div>
      <h1 className="text-center text-2xl font-bold mb-4 text-white">Sorteio de Times</h1>

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex flex-row gap-4">
          {/* Jogadores Disponíveis */}
          <Droppable droppableId="jogadores">
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className="p-4 rounded-md bg-colorDeepCharcoal border-colorSlateBlue border-2 w-2/4"
              >             <h2 className="text-center text-xl font-bold mb-4">Jogadores</h2>
                <div className="grid grid-cols-2 gap-4">
                  {jogadores.map((jogador, index) => {
                    const isSelected = selecionados.some((j) => j.id === jogador.id);
                    return (
                      <Draggable key={jogador.id} draggableId={jogador.id.toString()} index={index}>
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={`p-2 mb-2 text-center rounded cursor-pointer text-black ${isSelected ? "bg-colorMintGreen" : "bg-colorSkyBlue"
                              }`}
                            onClick={() => handleSelecionarJogador(jogador)} // Seleciona ou deseleciona o jogador
                          >
                            {jogador.nome}
                          </div>
                        )}
                      </Draggable>
                    );
                  })}
                  {provided.placeholder}
                </div>

              </div>
            )}
          </Droppable>

          {/* Time 1 */}
          <Droppable droppableId="time1">
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className="p-4 rounded-md bg-colorDeepCharcoal border-blue-500 border-2 w-1/4"
              >
                <h2 className="text-center text-xl font-bold mb-4">Time 1</h2>
                <div className="flex flex-col gap-4">
                  {time1.map((jogador, index) => (
                    <Draggable key={jogador.id} draggableId={jogador.id.toString()} index={index}>
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className="p-2 mb-2 text-black bg-colorSkyBlue text-center rounded"
                        >
                          {jogador.nome}
                          <button
                            onClick={() => handleMoveBackToJogadores(jogador, "time1")}
                            className="ml-2 p-1 text-xs bg-red-500 text-white rounded"
                          >
                            Remover
                          </button>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              </div>
            )}
          </Droppable>

          {/* Time 2 */}
          <Droppable droppableId="time2">
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className="p-4 rounded-md bg-colorDeepCharcoal border-red-500 border-2 w-1/4"
              >
                <h2 className="text-center text-xl font-bold mb-4">Time 2</h2>
                <div className="flex flex-col gap-4">
                  {time2.map((jogador, index) => (
                    <Draggable key={jogador.id} draggableId={jogador.id.toString()} index={index}>
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className="p-2 mb-2 text-black bg-colorSkyBlue text-center rounded"
                        >
                          {jogador.nome}
                          <button
                            onClick={() => handleMoveBackToJogadores(jogador, "time2")}
                            className="ml-2 p-1 text-xs bg-red-500 text-white rounded"
                          >
                            Remover
                          </button>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              </div>
            )}
          </Droppable>
        </div>

        {/* Buttons for actions */}
        <div className="flex justify-center mt-4 space-x-4">
          <button
            className="p-2 text-black bg-green-500 font-bold rounded cursor-pointer"
            onClick={handleSorteio}
          >
            Gerar Sorteio
          </button>
          <button
            className="p-2 text-black bg-blue-500 font-bold rounded cursor-pointer"
            onClick={handleCriarPartida}
          >
            Criar Partida
          </button>
          <button
            className="p-2 text-black bg-orange-500 font-bold rounded cursor-pointer"
            onClick={handleReset}
          >
            Resetar
          </button>
        </div>
      </DragDropContext>
    </div>
  );
};

export default Sorteio;
