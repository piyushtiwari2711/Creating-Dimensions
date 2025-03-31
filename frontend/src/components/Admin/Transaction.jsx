import React, { useState,useEffect } from 'react';
import { IndianRupee, Calendar, User, FileText, CreditCard, CheckCircle, Clock } from 'lucide-react';
import { useAdmin } from "../../context/AdminContext";
const TransactionSkeleton = () => (
  <div className="animate-pulse bg-white rounded-lg shadow-sm p-4 space-y-3">
    <div className="flex items-center space-x-3">
      <div className="h-4 bg-gray-200 rounded w-24"></div>
      <div className="h-4 bg-gray-200 rounded w-32 ml-auto"></div>
    </div>
    <div className="space-y-2">
      <div className="h-4 bg-gray-200 rounded w-40"></div>
      <div className="h-4 bg-gray-200 rounded w-32"></div>
    </div>
    <div className="flex justify-between items-center">
      <div className="h-4 bg-gray-200 rounded w-20"></div>
      <div className="h-4 bg-gray-200 rounded w-16"></div>
    </div>
  </div>
);

function Transaction() {
  const {loading,transactions,transactionHistory} = useAdmin();

  useEffect(() => {
    transactionHistory();
  }, [])
  

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-4 sm:p-6 bg-gray-50 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
              <IndianRupee className="text-indigo-600" />
              Transaction History
            </h2>
          </div>
          
          <div className="p-4 sm:p-6 space-y-4">
            {loading ? (
              <>
                <TransactionSkeleton />
                <TransactionSkeleton />
                <TransactionSkeleton />
              </>
            ) : (
              <div className="grid gap-4">
                {transactions.map((transaction) => (
                  <div
                    key={transaction.id}
                    className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow duration-200"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center text-sm text-gray-500 gap-1">
                        <Calendar size={16} />
                        {new Date(transaction.createdAt._seconds * 1000).toLocaleDateString()}
                      </div>
                      <span className={`px-2.5 py-0.5 inline-flex items-center gap-1 text-xs font-medium rounded-full ${
                        transaction.status === 'paid'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {transaction.status === 'paid' ? <CheckCircle size={14} /> : <Clock size={14} />}
                        {transaction.status}
                      </span>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <User size={16} className="text-gray-400" />
                        <span className="text-sm font-medium text-gray-900">
                          {transaction.buyerName}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <FileText size={16} className="text-gray-400" />
                        <span className="text-sm text-gray-700">
                          {transaction.noteTitle}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <CreditCard size={16} className="text-gray-400" />
                        <span className="text-sm font-medium text-gray-900">
                          {(transaction.amount / 100).toFixed(2)} {transaction.currency}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Transaction;
