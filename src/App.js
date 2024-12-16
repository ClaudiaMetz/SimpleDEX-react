import React, { useState, useEffect } from "react";
import Web3 from "web3";
import "./App.css";

function App() {
  const [web3, setWeb3] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [simpleDEX, setSimpleDEX] = useState(null);
  const [amountA, setAmountA] = useState("");
  const [amountB, setAmountB] = useState("");
  const [swapAmountA, setSwapAmountA] = useState("");
  const [swapAmountB, setSwapAmountB] = useState("");
  const [tokenAddress, setTokenAddress] = useState("");
  const [tokenPrice, setTokenPrice] = useState("");

  useEffect(() => {
    if (window.ethereum) {
      const web3Instance = new Web3(window.ethereum);
      setWeb3(web3Instance);
      window.ethereum
        .request({ method: "eth_requestAccounts" })
        .then((accounts) => {
          setAccounts(accounts);
          const contractAddress = "0x869Ae3deB65c941d2562aF7F70925356e47d4160";
          const abi = [
            {
              inputs: [
                { internalType: "address", name: "_tokenA", type: "address" },
                { internalType: "address", name: "_tokenB", type: "address" },
              ],
              stateMutability: "nonpayable",
              type: "constructor",
            },
            {
              inputs: [
                { internalType: "address", name: "owner", type: "address" },
              ],
              name: "OwnableInvalidOwner",
              type: "error",
            },
            {
              inputs: [
                { internalType: "address", name: "account", type: "address" },
              ],
              name: "OwnableUnauthorizedAccount",
              type: "error",
            },
            {
              anonymous: false,
              inputs: [
                {
                  indexed: false,
                  internalType: "uint256",
                  name: "amountA",
                  type: "uint256",
                },
                {
                  indexed: false,
                  internalType: "uint256",
                  name: "amountB",
                  type: "uint256",
                },
              ],
              name: "LiquidityAdded",
              type: "event",
            },
            {
              anonymous: false,
              inputs: [
                {
                  indexed: false,
                  internalType: "uint256",
                  name: "amountA",
                  type: "uint256",
                },
                {
                  indexed: false,
                  internalType: "uint256",
                  name: "amountB",
                  type: "uint256",
                },
              ],
              name: "LiquidityRemoved",
              type: "event",
            },
            {
              anonymous: false,
              inputs: [
                {
                  indexed: true,
                  internalType: "address",
                  name: "previousOwner",
                  type: "address",
                },
                {
                  indexed: true,
                  internalType: "address",
                  name: "newOwner",
                  type: "address",
                },
              ],
              name: "OwnershipTransferred",
              type: "event",
            },
            {
              anonymous: false,
              inputs: [
                {
                  indexed: true,
                  internalType: "address",
                  name: "requester",
                  type: "address",
                },
                {
                  indexed: false,
                  internalType: "address",
                  name: "token",
                  type: "address",
                },
                {
                  indexed: false,
                  internalType: "uint256",
                  name: "price",
                  type: "uint256",
                },
              ],
              name: "PriceRetrieved",
              type: "event",
            },
            {
              anonymous: false,
              inputs: [
                {
                  indexed: true,
                  internalType: "address",
                  name: "swapper",
                  type: "address",
                },
                {
                  indexed: false,
                  internalType: "uint256",
                  name: "amountAIn",
                  type: "uint256",
                },
                {
                  indexed: false,
                  internalType: "uint256",
                  name: "amountBOut",
                  type: "uint256",
                },
              ],
              name: "SwapAforB",
              type: "event",
            },
            {
              anonymous: false,
              inputs: [
                {
                  indexed: true,
                  internalType: "address",
                  name: "swapper",
                  type: "address",
                },
                {
                  indexed: false,
                  internalType: "uint256",
                  name: "amountBIn",
                  type: "uint256",
                },
                {
                  indexed: false,
                  internalType: "uint256",
                  name: "amountAOut",
                  type: "uint256",
                },
              ],
              name: "SwapBforA",
              type: "event",
            },
            {
              inputs: [
                { internalType: "uint256", name: "amountA", type: "uint256" },
                { internalType: "uint256", name: "amountB", type: "uint256" },
              ],
              name: "addLiquidity",
              outputs: [],
              stateMutability: "nonpayable",
              type: "function",
            },
            {
              inputs: [
                { internalType: "address", name: "_token", type: "address" },
              ],
              name: "getPrice",
              outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
              stateMutability: "nonpayable",
              type: "function",
            },
            {
              inputs: [],
              name: "owner",
              outputs: [{ internalType: "address", name: "", type: "address" }],
              stateMutability: "view",
              type: "function",
            },
            {
              inputs: [
                { internalType: "uint256", name: "amountA", type: "uint256" },
                { internalType: "uint256", name: "amountB", type: "uint256" },
              ],
              name: "removeLiquidity",
              outputs: [],
              stateMutability: "nonpayable",
              type: "function",
            },
            {
              inputs: [],
              name: "renounceOwnership",
              outputs: [],
              stateMutability: "nonpayable",
              type: "function",
            },
            {
              inputs: [],
              name: "reserveA",
              outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
              stateMutability: "view",
              type: "function",
            },
            {
              inputs: [],
              name: "reserveB",
              outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
              stateMutability: "view",
              type: "function",
            },
            {
              inputs: [
                { internalType: "uint256", name: "amountAIn", type: "uint256" },
              ],
              name: "swapAforB",
              outputs: [],
              stateMutability: "nonpayable",
              type: "function",
            },
            {
              inputs: [
                { internalType: "uint256", name: "amountBIn", type: "uint256" },
              ],
              name: "swapBforA",
              outputs: [],
              stateMutability: "nonpayable",
              type: "function",
            },
            {
              inputs: [],
              name: "tokenA",
              outputs: [
                { internalType: "contract IERC20", name: "", type: "address" },
              ],
              stateMutability: "view",
              type: "function",
            },
            {
              inputs: [],
              name: "tokenB",
              outputs: [
                { internalType: "contract IERC20", name: "", type: "address" },
              ],
              stateMutability: "view",
              type: "function",
            },
            {
              inputs: [
                { internalType: "address", name: "newOwner", type: "address" },
              ],
              name: "transferOwnership",
              outputs: [],
              stateMutability: "nonpayable",
              type: "function",
            },
          ];
          const simpleDEXInstance = new web3Instance.eth.Contract(
            abi,
            contractAddress
          );
          setSimpleDEX(simpleDEXInstance);
        })
        .catch((error) => {
          console.error("User denied account access", error);
        });
    } else {
      console.log("MetaMask is not installed");
    }
  }, []);

  const addLiquidity = async () => {
    if (simpleDEX && accounts.length > 0) {
      await simpleDEX.methods
        .addLiquidity(amountA, amountB)
        .send({ from: accounts[0] });
    }
  };

  const removeLiquidity = async () => {
    if (simpleDEX && accounts.length > 0) {
      await simpleDEX.methods
        .removeLiquidity(amountA, amountB)
        .send({ from: accounts[0] });
    }
  };

  const swapAforB = async () => {
    if (simpleDEX && accounts.length > 0) {
      await simpleDEX.methods
        .swapAforB(swapAmountA)
        .send({ from: accounts[0] });
      const amountB = await simpleDEX.methods.getAmountBOut(swapAmountA).call();
      setSwapAmountB(amountB);
    }
  };

  const swapBforA = async () => {
    if (simpleDEX && accounts.length > 0) {
      await simpleDEX.methods
        .swapBforA(swapAmountB)
        .send({ from: accounts[0] });
      const amountA = await simpleDEX.methods.getAmountAOut(swapAmountB).call();
      setSwapAmountA(amountA);
    }
  };

  const getPrice = async () => {
    if (simpleDEX) {
      const price = await simpleDEX.methods.getPrice(tokenAddress).call();
      setTokenPrice(price);
    }
  };

  return (
    <div className="App">
      <h1>SimpleDEX WebPage</h1>
      <div id="add-liquidity">
        <h2>Add Liquidity</h2>
        <input
          type="text"
          value={amountA}
          onChange={(e) => setAmountA(e.target.value)}
          placeholder="Amount A"
        />
        <input
          type="text"
          value={amountB}
          onChange={(e) => setAmountB(e.target.value)}
          placeholder="Amount B"
        />
        <button onClick={addLiquidity}>Add Liquidity</button>
      </div>
      <div id="remove-liquidity">
        <h2>Remove Liquidity</h2>
        <input
          type="text"
          value={amountA}
          onChange={(e) => setAmountA(e.target.value)}
          placeholder="Amount A"
        />
        <input
          type="text"
          value={amountB}
          onChange={(e) => setAmountB(e.target.value)}
          placeholder="Amount B"
        />
        <button onClick={removeLiquidity}>Remove Liquidity</button>
      </div>
      <div id="swap-a-for-b">
        <h2>Swap Token A for Token B</h2>
        <input
          type="text"
          value={swapAmountA}
          onChange={(e) => setSwapAmountA(e.target.value)}
          placeholder="Amount A"
        />
        <button onClick={swapAforB}>Swap</button>
        <p>Amount B Received: {swapAmountB}</p>
      </div>
      <div id="swap-b-for-a">
        <h2>Swap Token B for Token A</h2>
        <input
          type="text"
          value={swapAmountB}
          onChange={(e) => setSwapAmountB(e.target.value)}
          placeholder="Amount B"
        />
        <button onClick={swapBforA}>Swap</button>
        <p>Amount A Received: {swapAmountA}</p>
      </div>
      <div id="get-price">
        <h2>Get Token Price</h2>
        <input
          type="text"
          value={tokenAddress}
          onChange={(e) => setTokenAddress(e.target.value)}
          placeholder="Token Address"
        />
        <button onClick={getPrice}>Get Price</button>
        <p>Price: {tokenPrice}</p>
      </div>
    </div>
  );
}

export default App;
