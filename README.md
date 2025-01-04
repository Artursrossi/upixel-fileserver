<p align="center">
    <img src="https://github.com/Artursrossi/upixel-fileserver/blob/main/readme-logo.png" align="center" width="30%">
</p>
<h1 align="center">UPIXEL-FILESERVER</h1>

## Table of Contents

- [ Overview](#overview)
- [ Project Structure](#project-structure)
- [ Getting Started](#getting-started)
  - [ Prerequisites](#prerequisites)
  - [ Installation](#installation)
  - [ Configuration](#configuration)
  - [ Usage](#usage)

## Overview

<code>❯ Microservice for manage images and other files for uPixel store.</code>

## Project Structure

```sh
└── upixel-fileserver/
    ├── .github
    │   └── workflows
    ├── LICENSE
    ├── misc
    │   └── upixel_fileserver_postman.json
    ├── package-lock.json
    ├── package.json
    └── src
        ├── config
        ├── controllers
        ├── error-handler.js
        ├── middlewares
        └── server.js
```

## Getting Started

### Prerequisites

Before getting started with upixel-fileserver, ensure your runtime environment meets the following requirements:

- **Version Control System:** [Git](https://git-scm.com/downloads)
- **Javascript Runtime:** [NodeJS](https://nodejs.org/en/download)
- **Package Manager:** [Npm](https://nodejs.org/en/download) (Installed with NodeJS)

### Installation

1. Clone the upixel-fileserver repository:

```sh
❯ git clone https://github.com/Artursrossi/upixel-fileserver
```

2. Navigate to the project directory:

```sh
❯ cd upixel-fileserver
```

3. Install the project dependencies:
   **Using `npm`** &nbsp; [<img align="center" src="https://img.shields.io/badge/npm-CB3837.svg?style={badge_style}&logo=npm&logoColor=white" />](https://www.npmjs.com/)

```sh
❯ npm install
```

### Configuration

Set the environment variables by creating a .env file using .env.example

### Usage

Run upixel-fileserver using the following command:
**Using `npm`** &nbsp; [<img align="center" src="https://img.shields.io/badge/npm-CB3837.svg?style={badge_style}&logo=npm&logoColor=white" />](https://www.npmjs.com/)

```sh
❯ npm start
```
