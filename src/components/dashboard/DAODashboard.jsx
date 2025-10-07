import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MdHowToVote, MdGavel, MdAdd, MdClose } from "react-icons/md";

const DAODashboard = ({ dao, token, signer }) => {
  const [proposals, setProposals] = useState([]);
  const [selectedProposal, setSelectedProposal] = useState(null);
  const [voteAmount, setVoteAmount] = useState("");
  const [voteSupport, setVoteSupport] = useState(true);
  const [loading, setLoading] = useState(false);
  const [showCreate, setShowCreate] = useState(false);

  // Proposal creation state
  const [target, setTarget] = useState("");
  const [calldata, setCalldata] = useState("");
  const [value, setValue] = useState("0");
  const [description, setDescription] = useState("");

  // === Load Proposals ===
  const fetchProposals = async () => {
    if (!dao) return;
    const count = await dao.proposalCount();
    const loaded = [];
    for (let i = 1; i <= count; i++) {
      const p = await dao.proposals(i);
      const [forVotes, againstVotes] = await dao.getProposalVotes(i);
      const state = await dao.state(i);

      loaded.push({
        id: i,
        title: p.description,
        description: p.description,
        proposer: p.proposer,
        startTime: new Date(Number(p.startTime) * 1000),
        endTime: new Date(Number(p.endTime) * 1000),
        forVotes: Number(forVotes),
        againstVotes: Number(againstVotes),
        status: state,
      });
    }
    setProposals(loaded);
  };

  useEffect(() => {
    fetchProposals();
  }, [dao]);

  // === DAO Actions ===
  const castVote = async () => {
    if (!dao || !selectedProposal) return;
    setLoading(true);
    try {
      // First approve the DAO to spend voting tokens
      await (await token.approve(dao.target, voteAmount)).wait();

      // Then vote
      await (await dao.vote(selectedProposal.id, voteSupport, voteAmount)).wait();
      await fetchProposals();
      setSelectedProposal(null);
    } finally {
      setLoading(false);
    }
  };

  const queueProposal = async (proposalId) => {
    setLoading(true);
    try {
      await (await dao.queue(proposalId)).wait();
      await fetchProposals();
    } finally {
      setLoading(false);
    }
  };

  const executeProposal = async (proposalId) => {
    setLoading(true);
    try {
      await (await dao.execute(proposalId)).wait();
      await fetchProposals();
    } finally {
      setLoading(false);
    }
  };

  const createProposal = async () => {
    if (!dao) return;
    setLoading(true);
    try {
      await (
        await dao.propose(
          [target],
          [calldata],
          [value],
          description
        )
      ).wait();
      await fetchProposals();
      setShowCreate(false);
      setTarget("");
      setCalldata("");
      setValue("0");
      setDescription("");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl sm:text-2xl dark:text-white font-bold pb-[700px]">DAO Dashboard (coming soon)</h1>
        {/* <button
          onClick={() => setShowCreate(true)}
          className="flex items-center bg-blue-500 text-white px-3 py-2 rounded-lg shadow-md"
        >
          <MdAdd className="mr-1" /> New Proposal
        </button> */}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {proposals.map((p) => (
          <motion.div
            key={p.id}
            className="bg-white shadow-md p-4 rounded-xl"
            whileHover={{ scale: 1.02 }}
          >
            <h2 className="text-lg font-semibold">{p.title}</h2>
            <p>{p.description}</p>
            <p>Status: {p.status}</p>
            <p>
              For: {p.forVotes} | Against: {p.againstVotes}
            </p>
            <div className="flex gap-2 mt-2">
              <button
                onClick={() => setSelectedProposal(p)}
                className="px-2 py-1 bg-green-500 text-white rounded-md flex items-center"
              >
                <MdHowToVote className="mr-1" /> Vote
              </button>
              <button
                onClick={() => queueProposal(p.id)}
                className="px-2 py-1 bg-yellow-500 text-white rounded-md flex items-center"
              >
                <MdAdd className="mr-1" /> Queue
              </button>
              <button
                onClick={() => executeProposal(p.id)}
                className="px-2 py-1 bg-purple-600 text-white rounded-md flex items-center"
              >
                <MdGavel className="mr-1" /> Execute
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* === Vote Modal === */}
      <AnimatePresence>
        {selectedProposal && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="bg-white p-6 rounded-xl shadow-xl w-96">
              <h2 className="text-lg font-bold">
                Vote on {selectedProposal.title}
              </h2>
              <input
                type="number"
                placeholder="Vote amount"
                value={voteAmount}
                onChange={(e) => setVoteAmount(e.target.value)}
                className="w-full border p-2 mt-2"
              />
              <div className="flex gap-2 mt-2">
                <button
                  onClick={() => setVoteSupport(true)}
                  className={`flex-1 px-3 py-2 rounded ${
                    voteSupport ? "bg-green-500 text-white" : "bg-gray-200"
                  }`}
                >
                  For
                </button>
                <button
                  onClick={() => setVoteSupport(false)}
                  className={`flex-1 px-3 py-2 rounded ${
                    !voteSupport ? "bg-red-500 text-white" : "bg-gray-200"
                  }`}
                >
                  Against
                </button>
              </div>
              <div className="flex justify-end gap-2 mt-4">
                <button onClick={() => setSelectedProposal(null)}>
                  <MdClose />
                </button>
                <button onClick={castVote} disabled={loading}>
                  {loading ? "Voting..." : "Submit Vote"}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* === Proposal Creation Modal === */}
      <AnimatePresence>
        {showCreate && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="bg-white p-6 rounded-xl shadow-xl w-96">
              <h2 className="text-lg font-bold mb-2">Create Proposal</h2>
              <input
                type="text"
                placeholder="Target contract"
                value={target}
                onChange={(e) => setTarget(e.target.value)}
                className="w-full border p-2 mt-2"
              />
              <input
                type="text"
                placeholder="Calldata (hex-encoded)"
                value={calldata}
                onChange={(e) => setCalldata(e.target.value)}
                className="w-full border p-2 mt-2"
              />
              <input
                type="text"
                placeholder="ETH value (wei)"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                className="w-full border p-2 mt-2"
              />
              <textarea
                placeholder="Proposal description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full border p-2 mt-2"
              />
              <div className="flex justify-end gap-2 mt-4">
                <button onClick={() => setShowCreate(false)}>
                  <MdClose />
                </button>
                <button onClick={createProposal} disabled={loading}>
                  {loading ? "Creating..." : "Submit Proposal"}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DAODashboard;
