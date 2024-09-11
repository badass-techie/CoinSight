# CoinSight: Cryptocurrency Price Prediction Bot - ETHSafari 2024 Hackathon

1. [Project Overview](#project-overview)
2. [Inspiration](#inspiration)
3. [Features](#features)
4. [How It Works](#how-it-works)
5. [Demo](#demo)
6. [Live Deployment](#live-deployment)
7. [Tech Stack](#tech-stack)
8. [Challenges Faced](#challenges-faced)
9. [Team Members](#team-members)

## Project Overview

CoinSight is a Telegram bot designed to provide cryptocurrency traders with a reliable and efficient tool for accessing historical price data and future price predictions. This enables users to make more informed decisions about their investments.


## Inspiration

The main inspiration behind CoinSight was the need for a reliable and efficient tool that cryptocurrency traders could use to:

1. Access historical price data
2. Obtain future price predictions
3. Make informed decisions about their investments

By combining blockchain data indexing with AI-powered predictions, CoinSight aims to provide a comprehensive solution for crypto traders.


## Features

- **Historical Data Analysis**: Utilizes a custom subgraph to fetch historical price data for cryptocurrencies.
- **ORA AI Oracle**: Uses the ORA AI Oracle Plugin by Chainsafe to get AI-powered predictions for cryptocurrencies.
- **Telegram Integration**: Provides a Telegram bot interface for users to interact with the predictions.

## How It Works

### Subgraph Component

The subgraph continuously indexes price data from Chainlink price feeds on the Ethereum mainnet. This allows for efficient querying of historical price data for supported cryptocurrencies.

### Telegram Bot Component

The bot serves as the user interface, allowing users to:

1. Select a cryptocurrency.
2. Choose a future date for prediction
3. View recent historical price data
4. Receive an AI-generated price prediction for the selected date

### AI Prediction Process

1. The bot fetches recent historical price data from the subgraph
2. This data is used to formulate a prompt for the ChainSafe on-chain AI model
3. The AI model processes the historical data and generates a price prediction
4. The prediction is returned to the user via the Telegram bot

By combining these components, CoinSight provides users with a seamless experience for accessing both historical and predicted future price data for their chosen assets.

## Demo


## Live Deployment

[CoinSight Bot](https://t.me/coinsightv1bot)


## Tech Stack  

- NodeJS
- The Graph
- ORA AI Oracle Plugin by Chainsafe
- Telegram Bot API
- Chainlink Price Feeds
- Docker 
- AWS for deployment

## Challenges Faced

1. **Data Availability**: Finding the right smart contracts to query for historical price data proved challenging. Many contracts initially considered for the subgraph did not have sufficient historical data to make informed predictions.

2. **Documentation Gaps**: The team faced difficulties due to insufficient documentation for some of the tools used in the project. This required additional research and experimentation to implement certain features correctly.


## Team Members

- [Moses Odhiambo](https://github.com/badass-techie)
- [Dennis Kimathi](https://github.com/dennohkim)



