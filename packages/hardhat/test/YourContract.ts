import { ethers } from "hardhat";
import { expect } from "chai";
import { Voting } from "../typechain-types";

describe("Voting", function () {
  let votingContract: Voting;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let owner: any;
  let addr1: any;
  let addr2: any;

  beforeEach(async () => {
    // Получение аккаунтов
    [owner, addr1, addr2] = await ethers.getSigners();

    // Развертывание контракта
    const VotingFactory = await ethers.getContractFactory("Voting");
    votingContract = await VotingFactory.deploy();
  });

  it("Должен позволять владельцу добавлять кандидатов", async function () {
    await votingContract.addCandidate("Alice");
    await votingContract.addCandidate("Bob");

    const candidate1 = await votingContract.candidates(1);
    const candidate2 = await votingContract.candidates(2);

    expect(candidate1.name).to.equal("Alice");
    expect(candidate2.name).to.equal("Bob");
  });

  it("Должен запрещать добавление кандидатов не владельцем", async function () {
    await expect(votingContract.connect(addr1).addCandidate("Alice")).to.be.revertedWith("Ownable: caller is not the owner");
  });

  it("Должен позволять начать голосование только владельцу", async function () {
    await votingContract.addCandidate("Alice");
    await votingContract.startVoting(3600); // Длительность 1 час

    const votingStatus = await votingContract.votingStatus();
    expect(votingStatus).to.equal(1); // Status: Ongoing
  });

  it("Должен запрещать голосовать до начала голосования", async function () {
    await votingContract.addCandidate("Alice");
    await expect(votingContract.vote(1)).to.be.revertedWith("Voting has not started yet or has already ended.");
  });

  it("Должен позволять голосовать во время голосования", async function () {
    await votingContract.addCandidate("Alice");
    await votingContract.startVoting(3600);

    await votingContract.connect(addr1).vote(1);

    const voter = await votingContract.voters(addr1.address);
    expect(voter.hasVoted).to.equal(true);
    expect(voter.candidateId).to.equal(1);

    const candidate = await votingContract.candidates(1);
    expect(candidate.voteCount).to.equal(1);
  });

  it("Должен запрещать голосовать дважды", async function () {
    await votingContract.addCandidate("Alice");
    await votingContract.startVoting(3600);

    await votingContract.connect(addr1).vote(1);

    await expect(votingContract.connect(addr1).vote(1)).to.be.revertedWith("You have already voted.");
  });

  it("Должен корректно завершать голосование", async function () {
    await votingContract.addCandidate("Alice");
    await votingContract.startVoting(3600);

    await votingContract.endVoting();

    const votingStatus = await votingContract.votingStatus();
    expect(votingStatus).to.equal(2); // Status: Ended
  });

  it("Должен возвращать результаты после завершения голосования", async function () {
    await votingContract.addCandidate("Alice");
    await votingContract.addCandidate("Bob");

    await votingContract.startVoting(3600);
    await votingContract.connect(addr1).vote(1);
    await votingContract.connect(addr2).vote(2);

    await votingContract.endVoting();

    const results = await votingContract.getResults();
    expect(results[0].voteCount).to.equal(1); // Голоса за Alice
    expect(results[1].voteCount).to.equal(1); // Голоса за Bob
  });

  it("Должен запрещать голосовать после завершения голосования", async function () {
    await votingContract.addCandidate("Alice");
    await votingContract.startVoting(3600);
    await votingContract.endVoting();

    await expect(votingContract.connect(addr1).vote(1)).to.be.revertedWith(
      "Voting has not started yet or has already ended.",
    );
  });
});
