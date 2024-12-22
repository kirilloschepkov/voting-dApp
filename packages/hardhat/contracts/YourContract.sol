// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract Voting is Ownable {
    using Counters for Counters.Counter;

    // Перечисление статусов голосования
    enum VotingStatus { NotStarted, InProcess, Ended }

    // Структура кандидата
    struct Candidate {
        uint id; // ID кандидата
        string name; // Имя кандидата
        uint voteCount; // Количество голосов, полученных кандидатом
    }

    // Структура голосующего
    struct Voter {
        bool hasVoted; // Флаг, указывающий, голосовал ли пользователь
        uint candidateId; // ID кандидата, за которого был подан голос
    }

    Counters.Counter private _candidateIds; // Счетчик для ID кандидатов
    mapping(uint => Candidate) public candidates; // Список всех кандидатов
    mapping(address => Voter) public voters; // Список всех голосующих

    VotingStatus public votingStatus; // Текущий статус голосования
    uint public startTime; // Время начала голосования
    uint public endTime; // Время окончания голосования

    // События для отслеживания действий
    event CandidateAdded(uint candidateId, string name); // Событие: добавлен новый кандидат
    event VoteCasted(address voter, uint candidateId); // Событие: подан голос
    event VotingStarted(uint startTime, uint endTime); // Событие: голосование началось
    event VotingEnded(uint endTime); // Событие: голосование завершено

    // Модификатор: проверка, что действие выполняется в период голосования
    modifier onlyDuringVoting() {
        require(votingStatus == VotingStatus.InProcess, "Voting has not started yet or has already ended.");
        require(block.timestamp >= startTime && block.timestamp <= endTime, "Voting is outside the allowed timeframe.");
        _;
    }

    // Модификатор: проверка, что действие выполняется до начала голосования
    modifier onlyBeforeVoting() {
        require(votingStatus == VotingStatus.NotStarted, "Voting has already started.");
        _;
    }

    // Модификатор: проверка, что действие выполняется после завершения голосования
    modifier onlyAfterVoting() {
        require(votingStatus == VotingStatus.Ended, "Voting has not ended yet.");
        _;
    }

    // Функция добавления нового кандидата (только владелец, до начала голосования)
    function addCandidate(string memory name) external onlyOwner onlyBeforeVoting {
        _candidateIds.increment(); // Увеличиваем счетчик кандидатов
        uint candidateId = _candidateIds.current(); // Получаем новый ID кандидата
        candidates[candidateId] = Candidate(candidateId, name, 0); // Создаем нового кандидата

        emit CandidateAdded(candidateId, name); // Генерируем событие о добавлении кандидата
    }

    // Функция запуска голосования (только владелец, до начала голосования)
    function startVoting(uint duration) external onlyOwner onlyBeforeVoting {
        require(_candidateIds.current() > 0, "No candidates available."); // Проверяем, что есть кандидаты

        votingStatus = VotingStatus.InProcess; // Устанавливаем статус голосования "Идет"
        startTime = block.timestamp; // Устанавливаем время начала голосования
        endTime = block.timestamp + duration; // Устанавливаем время окончания голосования

        emit VotingStarted(startTime, endTime); // Генерируем событие о начале голосования
    }

    // Функция завершения голосования (только владелец, во время голосования)
    function endVoting() external onlyOwner {
        require(votingStatus == VotingStatus.InProcess, "Voting has not started yet or has already ended.");
        votingStatus = VotingStatus.Ended; // Устанавливаем статус голосования "Завершено"

        emit VotingEnded(block.timestamp); // Генерируем событие о завершении голосования
    }

    // Функция для голосования (в период голосования)
    function vote(uint candidateId) external onlyDuringVoting {
        require(!voters[msg.sender].hasVoted, "You have already voted."); // Проверяем, что пользователь еще не голосовал
        require(candidates[candidateId].id != 0, "Candidate does not exist."); // Проверяем, что кандидат существует

        voters[msg.sender] = Voter(true, candidateId); // Записываем факт голосования
        candidates[candidateId].voteCount++; // Увеличиваем счетчик голосов у кандидата

        emit VoteCasted(msg.sender, candidateId); // Генерируем событие о подаче голоса
    }

    // Функция получения результатов голосования (после завершения голосования)
    function getResults() external view onlyAfterVoting returns (Candidate[] memory) {
        uint totalCandidates = _candidateIds.current(); // Получаем количество кандидатов
        Candidate[] memory results = new Candidate[](totalCandidates); // Создаем массив для результатов

        for (uint i = 1; i <= totalCandidates; i++) {
            results[i - 1] = candidates[i]; // Заполняем массив результатами
        }

        return results; // Возвращаем массив результатов
    }
}