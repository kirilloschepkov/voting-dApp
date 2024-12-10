import { useState } from "react";
import { useScaffoldWriteContract } from "~~/hooks/scaffold-eth";

/**
 * Компонент для добавления нового кандидата в голосование.
 * Пользователь вводит имя кандидата, которое затем отправляется в смарт-контракт.
 */
export const AddCandidate = () => {
  const [name, setName] = useState(""); // Хранит имя кандидата, введённое пользователем.

  // Подготовка вызова смарт-контракта Voting.
  const { writeContractAsync } = useScaffoldWriteContract("Voting");

  // Обработчик отправки имени кандидата в контракт.
  const handleAddCandidate = async () => {
    try {
      await writeContractAsync({
        functionName: "addCandidate",
        args: [name],
      }); // Вызов функции addCandidate контракта с аргументом имени кандидата.
      alert("Кандидат добавлен!"); // Уведомление об успешной операции.
    } catch (error) {
      console.error(error); // Вывод ошибки в консоль.
      alert("Ошибка при добавлении кандидата."); // Уведомление об ошибке.
    }
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Имя кандидата" // Подсказка для поля ввода.
        value={name} // Значение из состояния.
        onChange={e => setName(e.target.value)} // Обновление состояния при вводе текста.
      />
      <button onClick={handleAddCandidate}>Добавить кандидата</button> {/* Кнопка для отправки данных. */}
    </div>
  );
};
