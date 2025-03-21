import React from 'react';

const transactions = [
  {
    id: '1',
    title: 'Advanced Calculus Notes',
    amount: 399,
    date: '2024-02-15',
    status: 'completed',
  },
  {
    id: '2',
    title: 'Physics Mechanics Notes',
    amount: 299,
    date: '2024-02-10',
    status: 'completed',
  },
];

const TransactionHistory = () => {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Transaction History</h2>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-50">
              <th className="text-left p-4 border-b">Title</th>
              <th className="text-left p-4 border-b">Amount</th>
              <th className="text-left p-4 border-b">Date</th>
              <th className="text-left p-4 border-b">Status</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((transaction) => (
              <tr key={transaction.id} className="hover:bg-gray-50">
                <td className="p-4 border-b">{transaction.title}</td>
                <td className="p-4 border-b">₹{transaction.amount}</td>
                <td className="p-4 border-b">
                  {new Date(transaction.date).toLocaleDateString()}
                </td>
                <td className="p-4 border-b">
                  <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                    {transaction.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TransactionHistory;