import React, { useEffect } from "react";
import { useNotes } from "../context/NotesContext";
import { CreditCard, AlertCircle } from "lucide-react";

const TransactionSkeleton = ({ isMobile }) => {
  if (isMobile) {
    return (
      <div className="animate-pulse bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-4">
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-3"></div>
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/3"></div>
          <div className="h-6 bg-gray-200 rounded w-1/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  return (
    <tr className="animate-pulse">
      <td className="p-4 border-b">
        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
      </td>
      <td className="p-4 border-b">
        <div className="h-4 bg-gray-200 rounded w-20"></div>
      </td>
      <td className="p-4 border-b">
        <div className="h-4 bg-gray-200 rounded w-24"></div>
      </td>
      <td className="p-4 border-b">
        <div className="h-6 bg-gray-200 rounded w-20"></div>
      </td>
      <td className="p-4 border-b">
        <div className="h-4 bg-gray-200 rounded w-32"></div>
      </td>
    </tr>
  );
};

const TransactionHistory = () => {
  const { transactionHistory, transactions, loading, error } = useNotes();

  useEffect(() => {
    transactionHistory();
  }, []);

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "completed":
        return "bg-green-100 text-green-800 border border-green-200";
      case "pending":
        return "bg-yellow-100 text-yellow-800 border border-yellow-200";
      case "failed":
        return "bg-red-100 text-red-800 border border-red-200";
      case "paid":
        return "bg-blue-100 text-blue-800 border border-blue-200";
      default:
        return "bg-gray-100 text-gray-800 border border-gray-200";
    }
  };

  if (error) {
    return (
      <div className="p-6 flex items-center justify-center">
        <div className="bg-red-50 text-red-800 rounded-lg p-4 flex items-center gap-2 max-w-lg">
          <AlertCircle className="w-5 h-5" />
          <p>Error fetching transactions: {error}</p>
        </div>
      </div>
    );
  }

  const renderMobileView = () => (
    <div className="space-y-4">
      {loading ? (
        Array(3)
          .fill(null)
          .map((_, index) => (
            <TransactionSkeleton key={index} isMobile={true} />
          ))
      ) : transactions.length > 0 ? (
        transactions.map((transaction) => (
          <div
            key={transaction.id}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-4"
          >
            <div className="font-medium text-gray-900 mb-3 break-words">
              {transaction.noteTitle}
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <div className="text-sm text-gray-500">Amount</div>
                <div className="font-medium text-gray-900">
                  ₹{transaction.amount}
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Date</div>
                <div className="text-gray-600">
                  {new Date(
                    transaction.createdAt._seconds * 1000
                  ).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Status</div>
                <span
                  className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                    transaction.status
                  )}`}
                >
                  {transaction.status}
                </span>
              </div>
              <div>
                <div className="text-sm text-gray-500">Payment ID</div>
                <div className="font-mono text-sm text-gray-600 break-all">
                  {transaction.paymentId || "N/A"}
                </div>
              </div>
            </div>
          </div>
        ))
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
          <div className="flex flex-col items-center gap-2 text-gray-500">
            <CreditCard className="w-8 h-8" />
            <p>No transactions found</p>
          </div>
        </div>
      )}
    </div>
  );

  const renderDesktopView = () => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr className="bg-gray-50">
              <th className="text-left p-4 text-sm font-medium text-gray-600">
                Note Title
              </th>
              <th className="text-left p-4 text-sm font-medium text-gray-600 whitespace-nowrap">
                Amount
              </th>
              <th className="text-left p-4 text-sm font-medium text-gray-600 whitespace-nowrap">
                Date
              </th>
              <th className="text-left p-4 text-sm font-medium text-gray-600 whitespace-nowrap">
                Status
              </th>
              <th className="text-left p-4 text-sm font-medium text-gray-600">
                Payment ID
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {loading ? (
              Array(5)
                .fill(null)
                .map((_, index) => (
                  <TransactionSkeleton key={index} isMobile={false} />
                ))
            ) : transactions.length > 0 ? (
              transactions.map((transaction) => (
                <tr
                  key={transaction.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="p-4 text-gray-900 max-w-xs">
                    <div className="break-words">{transaction.noteTitle}</div>
                  </td>
                  <td className="p-4 font-medium text-gray-900 whitespace-nowrap">
                    ₹{transaction.amount}
                  </td>
                  <td className="p-4 text-gray-600 whitespace-nowrap">
                    {new Date(
                      transaction.createdAt._seconds * 1000
                    ).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>
                  <td className="p-4 whitespace-nowrap">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                        transaction.status
                      )}`}
                    >
                      {transaction.status}
                    </span>
                  </td>
                  <td className="p-4 font-mono text-sm text-gray-600">
                    <div className="break-all">
                      {transaction.paymentId || "N/A"}
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="p-8 text-center">
                  <div className="flex flex-col items-center gap-2 text-gray-500">
                    <CreditCard className="w-8 h-8" />
                    <p>No transactions found</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center gap-3 mb-8">
        <CreditCard className="w-6 h-6 text-gray-700" />
        <h2 className="text-2xl font-bold text-gray-900">
          Transaction History
        </h2>
      </div>

      <div className="md:hidden">{renderMobileView()}</div>
      <div className="hidden md:block">{renderDesktopView()}</div>
    </div>
  );
};

export default TransactionHistory;
