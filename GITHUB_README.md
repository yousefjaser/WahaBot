# WahaBot

<p align="center">
  <img src="./logo.png" style='border-radius: 50%' width='150'/>
</p>

## About

WahaBot is a deployment of WAHA (WhatsApp HTTP API), a REST API for WhatsApp that allows you to control WhatsApp through HTTP requests. This repository contains my personal deployment configured for Vercel.

## Features

- Send and receive WhatsApp messages through HTTP API
- Multiple WhatsApp sessions management
- Media messaging (images, audio, documents)
- Group management
- API Documentation with Swagger

## Deployment

### Vercel Deployment

1. Fork this repository
2. Set up a new project on Vercel
3. Connect your GitHub repository to Vercel
4. Deploy!

### Local Development

1. Clone the repository
2. Install dependencies:
```bash
yarn install
```
3. Run the project:
```bash
# Fetch and compile proto files
yarn gows:proto
# Run the project
yarn start:dev
```

## Original Project

This is based on [WAHA - WhatsApp HTTP API](https://waha.devlike.pro/), an open-source WhatsApp API project.

## License

This project is licensed under the terms specified in the original WAHA project. 