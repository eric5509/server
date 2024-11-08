import {
  AccountNumberExists,
  convertToDate,
  ConvertToNumber,
  sendJsonResponse,
  trimValue,
} from "../../Lib/helper.js";
import { Transfer } from "../../Models/Transfer.js";

export const ProcessTransfer = async (req, res) => {
  let data;
  let Recipient;
  let Sender;
  let {
    senderAccountName,
    senderAccountNumber,
    senderBankName,
    recipientAccountName,
    recipientAccountNumber,
    recipientBankName,
    description,
    amount,
    date,
    status,
  } = req.body;

  senderBankName = senderBankName && senderBankName.toLowerCase();
  recipientBankName = recipientBankName && recipientBankName.toLowerCase();
  amount = Number(amount);
  console.log(recipientBankName, senderBankName, amount);

  if (
    !trimValue(senderAccountName) ||
    !trimValue(senderAccountNumber) ||
    !trimValue(senderBankName) ||
    !trimValue(recipientAccountName) ||
    !trimValue(recipientBankName) ||
    !trimValue(recipientAccountNumber) ||
    !trimValue(description) ||
    !trimValue(amount)
  )
    return sendJsonResponse(res, 400, "Please fill in all fields");

  if (isNaN(senderAccountNumber))
    return sendJsonResponse(res, 400, "Please Input a Valid Account Number");
  if (isNaN(recipientAccountNumber))
    return sendJsonResponse(res, 400, "Please Input a Valid Account Number");
  if (senderAccountNumber.length !== 10)
    return sendJsonResponse(res, 400, "Please Input a Valid Account Number");
  if (recipientAccountNumber.length !== 10)
    return sendJsonResponse(res, 400, "Please Input a Valid Account Number");

  if (isNaN(amount))
    return sendJsonResponse(res, 400, "Please Input a Valid Amount");

  const SenderIsACustomer = senderBankName == "first union";
  const RecipientIsACustomer = recipientBankName == "first union";

  if (SenderIsACustomer)
    Sender = await AccountNumberExists(senderAccountNumber);
  if (SenderIsACustomer && !Sender)
    return sendJsonResponse(res, 400, "Incorrect Bank Details for Sender");

  if (RecipientIsACustomer)
    Recipient = await AccountNumberExists(recipientAccountNumber);
  if (RecipientIsACustomer && !Recipient)
    return sendJsonResponse(res, 400, "Incorrect Bank Details for Recipient");

  if (senderAccountNumber === recipientAccountNumber)
    return sendJsonResponse(
      res,
      400,
      "Sender and recipient account numbers cannot be the same."
    );

  if (SenderIsACustomer && Sender.blocked)
    return sendJsonResponse(
      res,
      400,
      "Your account has been restricted from making transfers, contact the support team to opend your account"
    );
  const numberAmount = ConvertToNumber(amount);
  if (SenderIsACustomer && Sender.balance < numberAmount)
    return sendJsonResponse(
      res,
      400,
      "Insufficient Balance, please top up your account to continue"
    );
  if (SenderIsACustomer && Sender.balance >= numberAmount)
    Sender.balance -= numberAmount;
  if (RecipientIsACustomer) Recipient.balance += numberAmount;

  if (SenderIsACustomer && !RecipientIsACustomer) {
    data = {
      senderAccountName: `${Sender.firstName} ${Sender.middleName} ${Sender.lastName} `,
      senderAccountNumber,
      senderBankName,
      recipientAccountName,
      recipientAccountNumber,
      recipientBankName,
      description,
      amount,
      date: convertToDate(date),
      status,
      senderId: Sender._id,
    };
  }
  if (!SenderIsACustomer && RecipientIsACustomer) {
    data = {
      senderAccountName,
      senderAccountNumber,
      senderBankName,
      recipientAccountName: `${Recipient.firstName} ${Recipient.middleName} ${Recipient.lastName} `,
      recipientAccountNumber,
      recipientBankName,
      description,
      amount,
      date: convertToDate(date),
      status,
      recipeintId: Recipient._id,
    };
  }
  if (SenderIsACustomer && RecipientIsACustomer) {
    data = {
      senderAccountName: `${Sender.firstName} ${Sender.middleName} ${Sender.lastName} `,
      senderAccountNumber,
      senderBankName,
      recipientAccountName: `${Recipient.firstName} ${Recipient.middleName} ${Recipient.lastName} `,
      recipientAccountNumber,
      recipientBankName,
      description,
      amount,
      date: convertToDate(date),
      status,
      recipeintId: Recipient._id,
      senderId: Recipient._id,
    };
  }

  console.log(data)
  try {
    if (Sender) await Sender.save();
    if (Recipient) await Recipient.save();
    await Transfer.create(data);
    return sendJsonResponse(
      res,
      200,
      "Transfer completed successfully",
    );
  } catch (error) {
    return sendJsonResponse(res, 500, "Server Error, please try again later");
  }
};
