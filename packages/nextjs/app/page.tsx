"use client";

import { AddCandidate } from "~~/components/AddCandidate";
import { Vote } from "~~/components/Vote";

/**
 * Главная страница приложения голосования.
 * Содержит компоненты для добавления кандидатов и голосования.
 */
export default function Home() {
  return (
    <div>
      <h1>Голосование</h1> {/* Заголовок страницы. */}
      <AddCandidate /> {/* Компонент добавления кандидатов. */}
      <Vote /> {/* Компонент голосования. */}
    </div>
  );
}
