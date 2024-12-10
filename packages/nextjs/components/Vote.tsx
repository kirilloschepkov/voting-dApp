import { useState } from "react";
import { useScaffoldWriteContract } from "~~/hooks/scaffold-eth";

/**
 * Компонент для голосования за кандидата.
 * Пользователь вводит ID кандидата, за которого хочет проголосовать.
 */
export const Vote = () => {
  const [candidateId, setCandidateId] = useState(0); // Хранит ID кандидата, выбранного пользователем.

  // Подготовка вызова смарт-контракта Voting.
  const { writeContractAsync } = useScaffoldWriteContract("Voting");

  // Обработчик отправки голоса в контракт.
  const handleVote = async () => {
    try {
      await writeContractAsync({
        functionName: "vote",
        args: [candidateId as unknown as bigint],
      }); // Вызов функции vote контракта с аргументом ID кандидата.
      alert("Ваш голос принят!"); // Уведомление об успешной операции.
    } catch (error) {
      console.error(error); // Вывод ошибки в консоль.
      alert("Ошибка при голосовании."); // Уведомление об ошибке.
    }
  };

  return (
    <div>
      <input
        type="number"
        placeholder="ID кандидата" // Подсказка для поля ввода.
        value={candidateId} // Значение из состояния.
        onChange={e => setCandidateId(Number(e.target.value))} // Обновление состояния при вводе значения.
      />
      <button onClick={handleVote}>Проголосовать</button> {/* Кнопка для отправки данных. */}
    </div>
  );
};
