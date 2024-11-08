import {
  convertToFormattedDate,
  sendJsonResponse,
} from "../../../Lib/helper.js";
import { Account } from "../../../Models/Account.js";

export const GetAccounts = async (req, res) => {
  let Accounts = await Account.find().select("-__v -createdAt -updatedAt");
  Accounts = Accounts.map((account) => {
    const accountObj = account.toObject();
    const { _id, ...rest } = accountObj;
    return {
      ...rest,
      accountID: accountObj._id,
      birthDate: convertToFormattedDate(account.birthDate),
    };
  });

  return sendJsonResponse(res, 200, "Accounts found", Accounts);
};
