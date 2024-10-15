import { useState, useEffect } from "react";
import { ethers } from "ethers";
import contractABI from "../artifacts/contracts/Lottery.sol/SimpleLottery.json";

const contractAddress = "0xEebf65BF6CDf13BC7318Ed6a2c91e80c8d61dc40";

function App() {
  const [contract, setContract] = useState(null);
  const [account, setAccount] = useState("");
  const [players, setPlayers] = useState([]);
  const [balance, setBalance] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const init = async () => {
      setIsLoading(true);
      setError("");
      console.log("Initialization started");
      if (typeof window.ethereum !== "undefined") {
        try {
          await window.ethereum.request({ method: "eth_requestAccounts" });
          const provider = new ethers.BrowserProvider(window.ethereum);
          const signer = await provider.getSigner();
          const address = await signer.getAddress();
          setAccount(address);

          const lotteryContract = new ethers.Contract(
            contractAddress,
            contractABI.abi,
            signer
          );
          setContract(lotteryContract);

          await updatePlayersAndBalance(lotteryContract);

          window.ethereum.on("accountsChanged", handleAccountChange);
        } catch (error) {
          console.error("Initialization error:", error);
          setError(
            "Failed to initialize the app. Please check your MetaMask connection."
          );
        } finally {
          setIsLoading(false);
        }
      } else {
        setError("Please install MetaMask!");
        setIsLoading(false);
      }
    };

    init();

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener("accountsChanged", handleAccountChange);
      }
    };
  }, []);

  const handleAccountChange = async (accounts) => {
    if (accounts.length > 0) {
      setAccount(accounts[0]);
      await reinitializeContract();
    } else {
      setAccount("");
      setContract(null);
    }
  };

  const reinitializeContract = async () => {
    if (typeof window.ethereum !== "undefined") {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const lotteryContract = new ethers.Contract(
        contractAddress,
        contractABI.abi,
        signer
      );
      setContract(lotteryContract);
      await updatePlayersAndBalance(lotteryContract);
    }
  };

  const updatePlayersAndBalance = async (contractToUse) => {
    try {
      const contractToCheck = contractToUse || contract;
      if (contractToCheck) {
        const playersList = await contractToCheck.getPlayers();
        setPlayers(playersList);
        const balanceWei = await contractToCheck.provider.getBalance(
          contractToCheck.address
        );
        setBalance(ethers.formatEther(balanceWei));
      }
    } catch (error) {
      console.error("Error updating players and balance:", error);
      setError("Failed to update players and balance.");
    }
  };

  const enterLottery = async () => {
    setIsLoading(true);
    setError("");
    if (contract) {
      try {
        console.log("Entering lottery...");
        const transaction = await contract.enter({
          value: ethers.parseEther("0.011"),
        });
        console.log("Transaction sent:", transaction.hash);
        await transaction.wait();
        console.log("Transaction confirmed");
        await updatePlayersAndBalance();
      } catch (error) {
        console.error("Error entering lottery:", error);
        setError("Failed to enter the lottery. Please try again.");
      } finally {
        setIsLoading(false);
      }
    } else {
      setError("Contract not initialized");
      setIsLoading(false);
    }
  };

  const pickWinner = async () => {
    setIsLoading(true);
    setError("");
    if (!contract) {
      setError("Contract not initialized");
      setIsLoading(false);
      return;
    }

    try {
      console.log("Picking winner...");
      const transaction = await contract.pickWinner();
      console.log("Transaction sent:", transaction.hash);
      await transaction.wait();
      console.log("Transaction confirmed");
      await updatePlayersAndBalance();
    } catch (error) {
      console.error("Error picking winner:", error);
      if (error.code === 4001) {
        setError("Transaction was rejected by the user");
      } else {
        setError("Failed to pick a winner. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="App">
      <h1>Lottery dApp</h1>
      <p>Your address: {account}</p>
      <p>Contract balance: {balance} ETH</p>
      <p>Number of players: {players.length}</p>
      <button onClick={enterLottery} disabled={isLoading}>
        {isLoading ? "Processing..." : "Enter Lottery"}
      </button>
      <button onClick={pickWinner} disabled={isLoading}>
        {isLoading ? "Processing..." : "Pick Winner"}
      </button>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}

export default App;
