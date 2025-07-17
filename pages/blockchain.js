import React, { useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';

const BlockchainExplorer = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(false);

    const handleSearch = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            // Mock API call - Replace with a real API for actual implementation
            const response = await axios.get(`/api/transactions/search`, {
                params: {
                    query: searchQuery,
                },
            });
            setTransactions(response.data.transactions);
        } catch (error) {
            console.error('Error fetching data', error);
        }
        setLoading(false);
    };

    const handleChange = (e) => {
        setSearchQuery(e.target.value);
    };

    return (
        <div className="blockchain-explorer">
            <h1>Blockchain Explorer</h1>
            <form onSubmit={handleSearch} className="search-form">
                <input
                    type="text"
                    placeholder="Search by TX hash or address..."
                    value={searchQuery}
                    onChange={handleChange}
                    required
                />
                <button type="submit">Search</button>
            </form>

            {loading ? (
                <div>Loading...</div>
            ) : (
                <motion.ul
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    {transactions.map((tx, idx) => (
                        <li key={idx} className="transaction-item">
                            <div><strong>TX Hash:</strong> {tx.hash}</div>
                            <div><strong>From:</strong> {tx.from}</div>
                            <div><strong>To:</strong> {tx.to}</div>
                            <div><strong>Amount:</strong> {tx.amount}</div>
                            <div><strong>Date:</strong> {tx.date}</div>
                        </li>
                    ))}
                </motion.ul>
            )}
        </div>
    );
};

export default BlockchainExplorer;
