# React + Vite + Ether + Hardhat + Ganache + MetaMask

This project combines React, Vite, Ethereum, Hardhat, Ganache, and MetaMask to create a robust blockchain development environment.

## Project Setup

Follow these steps to install and start the project:

1. Clone the project repository
2. Open a terminal in the project directory and install packages
3. Create a `.env` file in the root directory with the following variables:
   ```
   PRIVATE_KEY=
   GANACHE_URL=http://127.0.0.1:7545
   ```

### Ganache Setup

4. Open Ganache from quickstart
5. Copy a private key from any account
6. Paste the private key after `PRIVATE_KEY=` in your `.env` file

   
![image](https://github.com/user-attachments/assets/a3a2f67d-ad3a-4427-adcb-cb1c2ce32899)


### MetaMask Setup

7. Install MetaMask and create an account
8. Add the Ganache network to MetaMask:
   - Click the network dropdown in the top-right corner
   - Select "Add Network"
   - Fill in the following details:
     - Network Name: Ganache (or any name you prefer)
     - New RPC URL: http://127.0.0.1:7545 (or as shown in Ganache)
     - Chain ID: 1337
     - Currency Symbol: ETH
     - Block Explorer URL: (leave blank)
   - Click "Save" and switch to the Ganache network
9. Import the Ganache account to MetaMask:
   - Click on your account icon
   - Select "Import Account"
   - Paste the same private key you used in the `.env` file

### Project Deployment

10. In the VS Code terminal, run the following commands:
    ```
    npx hardhat compile
    npx hardhat run scripts/deploy.cjs --network ganache
    ```
11. Copy the generated address from the terminal
12. Paste the address into the `contractAddress` variable at the top of `src/App.jsx` (approximately line 5)

13. Lastly run the command and enjoy
    ```
    npm run dev
    ```

