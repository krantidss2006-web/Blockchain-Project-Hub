'''mermaid'''
flowchart TD
"A[Blockchain Development Journey] --> B[Solidity Fundamentals]";

    B --> B1[Variables and Functions]
    B --> B2[Arrays and Dynamic Arrays]
    B --> B3[Bytes Data Type]
    B --> B4[Mappings]
    B --> B5[Structs]
    B --> B6[Loops]
    B --> B7[Payable Functions]
    B --> B8[Contract Balance and Ether Transfer]

    A --> C[Smart Contract Development]

    C --> C1[Token Smart Contract]
    C1 --> C2[Token Name and Symbol]
    C1 --> C3[Total Supply]
    C1 --> C4[Address Balances]
    C1 --> C5[Token Transfer Function]

    C --> C6[Todo Smart Contract]
    C6 --> C7[Create Tasks]
    C6 --> C8[Read Tasks]
    C6 --> C9[Manage Blockchain Data]

    A --> D[Hardhat Development]

    D --> D1[Hardhat Project Setup]
    D --> D2[Solidity Compilation]
    D --> D3[Deployment Scripts]
    D --> D4[Localhost Testing]
    D --> D5[Contract Testing]

    A --> E[Sepolia Testnet Deployment]

    E --> E1[Infura RPC Configuration]
    E --> E2[MetaMask Wallet Setup]
    E --> E3[Sepolia ETH Testing]
    E --> E4[Token Deployment]
    E --> E5[Todo Deployment]

    E4 --> E6[Token Address: 0xe9a553342e4aceee78587F11c496E17a70b32eBc]
    E5 --> E7[Todo Address: 0xD249c82fc83A545468cFD55e2b12F7a3041825c7]

    A --> F[Blockchain Interaction]

    F --> F1[Ethers.js v6]
    F --> F2[Read Block Number]
    F --> F3[Read Wallet Balance]
    F --> F4[Read Contract Data]
    F --> F5[Send Transactions]

    A --> G[Backend Development]

    G --> G1[Node.js Setup]
    G --> G2[Express Server]
    G --> G3[CORS Configuration]
    G --> G4[Environment Variables]
    G --> G5[Contract ABI Integration]
    G --> G6[REST API Development]
    G --> G7[Health Check API]
    G --> G8[Tasks API]

    A --> H[Frontend Development]

    H --> H1[React and Vite Setup]
    H --> H2[React Router]
    H --> H3[Web3 Context]
    H --> H4[Backend API Connection]
    H --> H5[Display Blockchain Tasks]
    H --> H6[Wallet Integration]

    G --> I[Full-Stack DApp]
    H --> I
    I --> I1[React Frontend]
    I --> I2[Node.js Backend]
    I --> I3[Sepolia Smart Contracts]
    I --> I4[Infura Blockchain RPC]

    I --> J[Next Development Phase]
    J --> J1[Complete Todo UI]
    J --> J2[Create New Tasks]
    J --> J3[MetaMask Transaction Flow]
    J --> J4[Transaction Status]
    "J --> J5[Production Security Review]";
