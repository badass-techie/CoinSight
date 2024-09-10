require('dotenv').config();

const { Models, ORAPlugin, SimplePromptAddresses } = require("@ora-io/web3-plugin-ora");
const {Web3} = require("web3");
const PromptABI = require('./promptABI.js');
const web3 = new Web3("https://sepolia.drpc.org");
web3.registerPlugin(new ORAPlugin(SimplePromptAddresses.SEPOLIA));

const wallet = web3.eth.wallet.add('0x' + process.env.PRIVATE_KEY);

const TelegramBot = require('node-telegram-bot-api');
const token = process.env.BOT_TOKEN;
const bot = new TelegramBot(token, {polling: true});

const tokens = [
    [{text: 'BTC (Bitcoin)', callback_data: 'BTC'}],
    [{text: 'ETH (Ether)', callback_data: 'ETH'}],
    [{text: 'LINK (Chainlink)', callback_data: 'LINK'}],
    [{text: 'XAU (Gold)', callback_data: 'XAU'}]
];

let selectedToken = '';

bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, 'Please choose a token:', {
        reply_markup: {
            inline_keyboard: tokens
        }
    });
});

bot.on('callback_query', async (callbackQuery) => {
    const {Calendar} = await import('telegram-inline-calendar');
    const calendar = new Calendar(bot, {
        start_week_day: 1,
        week_day_names: ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'],
        month_names: [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
        ],
        min_date: new Date()
    });

    if (tokens.flat().find(token => token.callback_data === callbackQuery.data)) {
        // handle the token
        selectedToken = callbackQuery.data;
        calendar.startNavCalendar(callbackQuery.message);   //show the date picker
    } else {
        // handle the date
        let selectedDate = calendar.clickButtonCalendar(callbackQuery);

        if (selectedDate && selectedDate != '-1') {
            selectedDate = new Date(selectedDate);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
      
            if (selectedDate < today) {
                bot.sendMessage(callbackQuery.message.chat.id, 'Error: The selected date is in the past. Please enter /start to try again.');
            } else {
                bot.sendMessage(callbackQuery.message.chat.id, `You selected the date: ${selectedDate.toDateString()}`);
        
                // Dynamically import graphql-request
                const { request, gql } = await import('graphql-request');

                // Query the GraphQL API
                const endpoint = process.env.SUBGRAPH_ENDPOINT;
                const query = gql`
                {
                    prices(where: { token: "${selectedToken}/USD" }, orderBy: timestamp, orderDirection: desc, first: 10) {
                    id
                    token
                    price
                    timestamp
                    }
                }
                `;
        
                try {
                    const data = await request(endpoint, query);
                    const prices = data.prices.map(price => `$${(price.price / Math.pow(10, price.decimals)).toFixed(2)} on ${new Date(price.timestamp * 1000).toLocaleString()}`).join('\n');
                    if (!prices) {
                        throw new Error('No prices found for the selected token.');
                    }

                    bot.sendMessage(callbackQuery.message.chat.id, `Prices for ${selectedToken}:\n${prices}`);

                    const prompt = "Predict the price of " + selectedToken + " on " + selectedDate.toDateString() + " given the following previous prices:\n\n" + prices;
                    const fees = await web3.ora.estimateFee(Models.LLAMA2);

                    const contract = new web3.eth.Contract(PromptABI, SimplePromptAddresses.SEPOLIA);
                    contract.methods.calculateAIResult(Models.LLAMA2, prompt).send({
                        from: wallet[0].address,
                        value: fees
                      })
                        .on('receipt', async (receipt) => {
                            const result = await web3.ora.getAIResult(Models.LLAMA2, prompt);
                            bot.sendMessage(callbackQuery.message.chat.id, `Forecasted price on ${selectedDate.toDateString()}: ${result}`);
                        })
                } catch (error) {
                    console.error(error);
                    bot.sendMessage(callbackQuery.message.chat.id, 'Error fetching prices. Please try again later.');
                }
            }
        }
    }
});
