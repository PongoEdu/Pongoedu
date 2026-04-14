import type { GameTrack } from "./game.types";

export const quimicaTrack: GameTrack = {
  slug: "quimica",
  title: "Trilha de Química",
  accent: "from-sky-500/20 to-cyan-500/10",
  levels: [
    {
      id: "quimica-1",
      title: "Nível 1 - Átomo",
      description: "Introdução à estrutura atômica.",
      xp: 20,
    },
    {
      id: "quimica-2",
      title: "Nível 2 - Tabela Periódica",
      description: "Famílias e períodos.",
      xp: 25,
    },
    {
      id: "quimica-3",
      title: "Nível 3 - Ligações Químicas",
      description: "Iônica, covalente e metálica.",
      xp: 30,
    },
  ],
};

export const biologiaTrack: GameTrack = {
  slug: "biologia",
  title: "Trilha de Biologia",
  accent: "from-emerald-500/20 to-lime-500/10",
  levels: [
    {
      id: "biologia-1",
      title: "Nível 1 - Célula",
      description: "Estrutura e organelas.",
      xp: 20,
    },
    {
      id: "biologia-2",
      title: "Nível 2 - Tecidos",
      description: "Tipos de tecidos biológicos.",
      xp: 25,
    },
    {
      id: "biologia-3",
      title: "Nível 3 - Genética",
      description: "Conceitos básicos de hereditariedade.",
      xp: 30,
    },
  ],
};