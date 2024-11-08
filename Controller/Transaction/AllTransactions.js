import { convertToFormattedDate, sendJsonResponse } from "../../Lib/helper.js";
import { Transaction } from "../../Models/Transaction.js";

export const AllTransactions = async (req, res) => {
  const AllTransactions = await Transaction.find();
  const newTransactions = AllTransactions.map((transaction) => {
    return {
      ...transaction, date: convertToFormattedDate(transaction.date), 
    }
  })
  return sendJsonResponse(res, 200,'Transactions found', newTransactions);
};
