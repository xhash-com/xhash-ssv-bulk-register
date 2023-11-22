import axios from "axios";
import {chat_id, TelegramToken} from "../config";

export const NoticeWarning = async (message: string) => {
  return await sendTelegram(MessageFormat('WARNING', message))
}

const sendTelegram = async (text: string) => {
  const telegramURL = `https://api.telegram.org/bot${TelegramToken}/sendMessage?chat_id=${chat_id}&text=${text}&parse_mode=HTML`
  return (await axios.get(telegramURL)).data
}

const MessageFormat = (status: string, message: string): string => {
  return encodeURI(
      "[XHash流动性质押]" +
      `\n状态：<strong>${status}</strong>` +
      `\n<pre>${message}</pre>`
  );
}
