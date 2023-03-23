# LandRegistryDapp

## Requirements
Node.js v14 - v18
Windows, Linux, or macOS

## Install Truffle

```bash
  npm install -g truffle
```
check truffle version
truffle version

## Ganache
ONE CLICK BLOCKCHAIN
https://trufflesuite.com/ganache/


## Run Locally

Clone the project

```bash
  git clone https://link-to-project
```

Go to the project directory

```bash
  cd my-project
```

Install dependencies

```bash
  npm install
```

Start the server

```bash
  npm start
  
  
  
  ## API Reference

#### RegisterLand

```http
  POST http://localhost:9600/RegisterLand
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `landRegID` | `number` | **Required**. land register number |
| `ipfsHash` | `string` | **Required**. IPFS file CID |
| `landAddress` | `string` | **Required**. land local address |
| `amount` | `number` | **Required**. land price |
| `ownedBy` | `address` | **Required**. land owner address(EOA) |
| `isApproved` | `bool` | **Required**. approved |




#### Get item

```http
  GET /api/items/${id}
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `id`      | `string` | **Required**. Id of item to fetch |

#### add(num1, num2)
