"use client";

/**
 * Главная страница приложения голосования.
 * Содержит компоненты для добавления кандидатов и голосования.
 */
import React, { useState } from "react";
import { useScaffoldWriteContract } from "~~/hooks/scaffold-eth";

const VotingApp = () => {
  const [candidateName, setCandidateName] = useState("");
  const [voteCandidateId, setVoteCandidateId] = useState("");
  const [votingDuration, setVotingDuration] = useState("");

  const { writeContractAsync } = useScaffoldWriteContract("Voting");
  return (
    <div className="flex flex-col items-center space-y-6 p-4">
      <h1 className="text-3xl font-bold text-primary">Voting DApp</h1>

      <section className="w-full max-w-md space-y-4 p-4 bg-base-200 rounded-lg shadow-lg">
        <h2 className="text-xl font-semibold">Add Candidate</h2>
        <input
          type="text"
          placeholder="Candidate Name"
          className="input input-bordered w-full"
          value={candidateName}
          onChange={e => setCandidateName(e.target.value)}
        />
        <button
          className="btn btn-primary w-full"
          onClick={() =>
            writeContractAsync({
              functionName: "addCandidate",
              args: [candidateName],
            })
          }
        >
          Add Candidate
        </button>
      </section>

      <section className="w-full max-w-md space-y-4 p-4 bg-base-200 rounded-lg shadow-lg">
        <h2 className="text-xl font-semibold">Start Voting</h2>
        <input
          type="number"
          placeholder="Duration (seconds)"
          className="input input-bordered w-full"
          value={votingDuration}
          onChange={e => setVotingDuration(e.target.value)}
        />
        <button
          className="btn btn-primary w-full"
          onClick={() =>
            writeContractAsync({
              functionName: "startVoting",
              args: [BigInt(votingDuration)],
            })
          }
        >
          Start Voting
        </button>
      </section>

      <section className="w-full max-w-md space-y-4 p-4 bg-base-200 rounded-lg shadow-lg">
        <h2 className="text-xl font-semibold">End Voting</h2>
        <button
          className="btn btn-warning w-full"
          onClick={() =>
            writeContractAsync({
              functionName: "endVoting",
            })
          }
        >
          End Voting
        </button>
      </section>

      <section className="w-full max-w-md space-y-4 p-4 bg-base-200 rounded-lg shadow-lg">
        <h2 className="text-xl font-semibold">Vote for Candidate</h2>
        <input
          type="number"
          placeholder="Candidate ID"
          className="input input-bordered w-full"
          value={voteCandidateId}
          onChange={e => setVoteCandidateId(e.target.value)}
        />
        <button
          className="btn btn-primary w-full"
          onClick={() =>
            writeContractAsync({
              functionName: "vote",
              args: [BigInt(voteCandidateId)],
            })
          }
        >
          Vote
        </button>
      </section>
    </div>
  );
};

export default VotingApp;
