import React from 'react';

const TransactionTable = ({ transactions, searchQuery }) => {
  const filteredTransactions = transactions.filter(transaction =>
    transaction.custom_order_id.toLowerCase().includes(searchQuery.toLowerCase())
  ).map((tx, index) => ({
    srNo: index + 1,
    instituteName: 'N/A', // Assuming data is not available
    date: tx.payment_time || new Date().toISOString(),
    orderId: tx.custom_order_id,
    orderAmount: tx.order_amount,
    transactionAmount: tx.transaction_amount || 'N/A',
    paymentMethod: tx.gateway,
    status: tx.status,
    studentName: 'N/A', // Assuming data is not available
    phoneNo: 'N/A', // Assuming data is not available
  }));

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200">
      <table className="min-w-full bg-white text-sm">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-2 text-left text-gray-600 font-semibold rounded-tl-lg">Sr.No</th>
            <th className="px-4 py-2 text-left text-gray-600 font-semibold">Institute Name</th>
            <th className="px-4 py-2 text-left text-gray-600 font-semibold">Date & Time</th>
            <th className="px-4 py-2 text-left text-gray-600 font-semibold">Order ID</th>
            <th className="px-4 py-2 text-left text-gray-600 font-semibold">Order Amt</th>
            <th className="px-4 py-2 text-left text-gray-600 font-semibold">Transaction Amt</th>
            <th className="px-4 py-2 text-left text-gray-600 font-semibold">Payment Method</th>
            <th className="px-4 py-2 text-left text-gray-600 font-semibold">Status</th>
            <th className="px-4 py-2 text-left text-gray-600 font-semibold">Student Name</th>
            <th className="px-4 py-2 text-left text-gray-600 font-semibold rounded-tr-lg">Phone No.</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {filteredTransactions.length > 0 ? (
            filteredTransactions.map((tx, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="px-4 py-2">{tx.srNo}</td>
                <td className="px-4 py-2">{tx.instituteName}</td>
                <td className="px-4 py-2">{new Date(tx.date).toLocaleString()}</td>
                <td className="px-4 py-2 font-mono text-gray-500">{tx.orderId}</td>
                <td className="px-4 py-2">{tx.orderAmount}</td>
                <td className="px-4 py-2">{tx.transactionAmount}</td>
                <td className="px-4 py-2">{tx.paymentMethod}</td>
                <td className="px-4 py-2">
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${tx.status === 'SUCCESS' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                    {tx.status}
                  </span>
                </td>
                <td className="px-4 py-2">{tx.studentName}</td>
                <td className="px-4 py-2">{tx.phoneNo}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="10" className="px-4 py-4 text-center text-gray-500">
                No transactions found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default TransactionTable;
