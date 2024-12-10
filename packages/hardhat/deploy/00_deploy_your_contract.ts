// Импорт типа DeployFunction из hardhat-deploy для декларации функции деплоя.
import { DeployFunction } from "hardhat-deploy/types";

// Импорт среды выполнения Hardhat (HRE), которая предоставляет доступ к утилитам и контексту выполнения.
import { HardhatRuntimeEnvironment } from "hardhat/types";

// Определение функции деплоя контракта Voting.
// Тип DeployFunction используется для обеспечения совместимости с hardhat-deploy.
const deployVoting: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  // Деструктуризация объектов deployments и getNamedAccounts из среды выполнения Hardhat.
  // deployments содержит утилиты для развертывания контрактов.
  // getNamedAccounts позволяет получить заранее определённые аккаунты.
  const { deployments, getNamedAccounts } = hre;

  // Извлечение функции deploy из объекта deployments.
  const { deploy } = deployments;

  // Получение аккаунта деплойера (откуда будет развернут контракт).
  const { deployer } = await getNamedAccounts();

  // Развертывание контракта Voting.
  // Аргументы:
  // - from: адрес аккаунта, который будет использоваться для деплоя.
  // - args: массив аргументов для конструктора контракта (здесь пустой, т.к. конструктор без параметров).
  // - log: если true, Hardhat будет выводить информацию о деплое в консоль.
  await deploy("Voting", {
    from: deployer,
    args: [], // Контракт не требует параметров конструктора.
    log: true, // Логирование процесса деплоя.
  });
};

// Экспорт функции деплоя для использования в сценариях Hardhat.
export default deployVoting;

// Тег функции деплоя, позволяющий запускать её из командной строки с указанием этого тега.
// Например: `npx hardhat deploy --tags Voting`
deployVoting.tags = ["Voting"];
