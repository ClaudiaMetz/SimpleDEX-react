import React, { useState, useEffect } from "react";
import Web3 from "web3";
import "./App.css";

const CONTRACT_ADDRESS = "0x869Ae3deB65c941d2562aF7F70925356e47d4160";
const TOKEN_A_ADDRESS = "0xc814C520b8F65837500825786D5D0f8E9C706Bfc";
const TOKEN_B_ADDRESS = "0x928E7Cc1CCf65f323eBA4A0f1Be7486383831a1c";

const ABI = [
  {
    inputs: [
      { internalType: "address", name: "_tokenA", type: "address" },
      { internalType: "address", name: "_tokenB", type: "address" },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [{ internalType: "address", name: "owner", type: "address" }],
    name: "OwnableInvalidOwner",
    type: "error",
  },
  {
    inputs: [{ internalType: "address", name: "account", type: "address" }],
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
    inputs: [{ internalType: "address", name: "_token", type: "address" }],
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
    inputs: [{ internalType: "uint256", name: "amountAIn", type: "uint256" }],
    name: "swapAforB",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "amountBIn", type: "uint256" }],
    name: "swapBforA",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "tokenA",
    outputs: [{ internalType: "contract IERC20", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "tokenB",
    outputs: [{ internalType: "contract IERC20", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "newOwner", type: "address" }],
    name: "transferOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

function Panel({ title, tag, children }) {
  return (
    <div className="panel">
      <div className="panel-header">
        <span className="panel-tag">{tag}</span>
        <span className="panel-title">{title}</span>
      </div>
      <div className="panel-body">{children}</div>
    </div>
  );
}

function StatusBadge({ status, message }) {
  if (!message) return null;
  return (
    <div className={`status-badge status-${status}`}>
      <span className="status-dot" />
      {message}
    </div>
  );
}

function AddressChip({ label, address }) {
  const short = `${address.slice(0, 6)}...${address.slice(-4)}`;
  return (
    <div className="address-chip">
      <span className="address-label">{label}</span>
      <span className="address-value">{short}</span>
    </div>
  );
}

function App() {
  const [web3, setWeb3] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [simpleDEX, setSimpleDEX] = useState(null);
  const [connected, setConnected] = useState(false);

  const [addAmountA, setAddAmountA] = useState("");
  const [addAmountB, setAddAmountB] = useState("");
  const [removeAmountA, setRemoveAmountA] = useState("");
  const [removeAmountB, setRemoveAmountB] = useState("");
  const [swapAmountA, setSwapAmountA] = useState("");
  const [swapAmountB, setSwapAmountB] = useState("");
  const [swapResultA, setSwapResultA] = useState(null);
  const [swapResultB, setSwapResultB] = useState(null);
  const [tokenAddress, setTokenAddress] = useState("");
  const [tokenPrice, setTokenPrice] = useState(null);

  const [loading, setLoading] = useState({});
  const [status, setStatus] = useState({});

  const setOp = (key, isLoading, statusType, msg) => {
    setLoading((p) => ({ ...p, [key]: isLoading }));
    setStatus((p) => ({ ...p, [key]: { type: statusType, msg } }));
  };

  useEffect(() => {
    if (window.ethereum) {
      const w3 = new Web3(window.ethereum);
      setWeb3(w3);
    }
  }, []);

  const connectWallet = async () => {
    if (!window.ethereum) {
      setOp("connect", false, "error", "MetaMask no está instalado.");
      return;
    }
    try {
      setOp("connect", true, null, null);
      const accs = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      setAccounts(accs);
      const w3 = new Web3(window.ethereum);
      setWeb3(w3);
      const instance = new w3.eth.Contract(ABI, CONTRACT_ADDRESS);
      setSimpleDEX(instance);
      setConnected(true);
      setOp("connect", false, "success", `Conectado`);
    } catch (e) {
      setOp("connect", false, "error", "Conexión rechazada.");
    }
  };

  const calculateAmountOut = (amountIn, reserveIn, reserveOut) => {
    const aIn = BigInt(amountIn);
    const rIn = BigInt(reserveIn);
    const rOut = BigInt(reserveOut);
    const newRIn = rIn + aIn;
    const newROut = (rOut * rIn) / newRIn;
    return rOut - newROut;
  };

  const addLiquidity = async () => {
    if (!simpleDEX || !accounts.length) return;
    try {
      setOp("add", true, null, null);
      await simpleDEX.methods
        .addLiquidity(addAmountA, addAmountB)
        .send({ from: accounts[0] });
      setOp("add", false, "success", "Liquidez agregada correctamente.");
      setAddAmountA("");
      setAddAmountB("");
    } catch (e) {
      setOp("add", false, "error", "Error al agregar liquidez.");
    }
  };

  const removeLiquidity = async () => {
    if (!simpleDEX || !accounts.length) return;
    try {
      setOp("remove", true, null, null);
      await simpleDEX.methods
        .removeLiquidity(removeAmountA, removeAmountB)
        .send({ from: accounts[0] });
      setOp("remove", false, "success", "Liquidez retirada correctamente.");
      setRemoveAmountA("");
      setRemoveAmountB("");
    } catch (e) {
      setOp("remove", false, "error", "Error al retirar liquidez.");
    }
  };

  const swapAforB = async () => {
    if (!simpleDEX || !accounts.length) return;
    try {
      setOp("swapAB", true, null, null);
      const rA = await simpleDEX.methods.reserveA().call();
      const rB = await simpleDEX.methods.reserveB().call();
      const out = calculateAmountOut(swapAmountA, rA, rB);
      await simpleDEX.methods
        .swapAforB(swapAmountA)
        .send({ from: accounts[0] });
      setSwapResultB(out.toString());
      setOp(
        "swapAB",
        false,
        "success",
        `Swap exitoso. Recibiste ${out.toString()} TKB`,
      );
    } catch (e) {
      setOp("swapAB", false, "error", "Error en el swap.");
    }
  };

  const swapBforA = async () => {
    if (!simpleDEX || !accounts.length) return;
    try {
      setOp("swapBA", true, null, null);
      const rA = await simpleDEX.methods.reserveA().call();
      const rB = await simpleDEX.methods.reserveB().call();
      const out = calculateAmountOut(swapAmountB, rB, rA);
      await simpleDEX.methods
        .swapBforA(swapAmountB)
        .send({ from: accounts[0] });
      setSwapResultA(out.toString());
      setOp(
        "swapBA",
        false,
        "success",
        `Swap exitoso. Recibiste ${out.toString()} TKA`,
      );
    } catch (e) {
      setOp("swapBA", false, "error", "Error en el swap.");
    }
  };

  const getPrice = async () => {
    if (!simpleDEX) return;
    try {
      setOp("price", true, null, null);
      const price = await simpleDEX.methods.getPrice(tokenAddress).call();
      setTokenPrice(price.toString());
      setOp("price", false, "success", "Precio obtenido.");
    } catch (e) {
      setOp(
        "price",
        false,
        "error",
        "Dirección inválida o error en el contrato.",
      );
    }
  };

  return (
    <div className="app">
      <header className="header">
        <div className="header-left">
          <div className="logo">
            <span className="logo-bracket">[</span>
            <span className="logo-text">SimpleDEX</span>
            <span className="logo-bracket">]</span>
          </div>
          <span className="header-subtitle">
            Decentralized Exchange Interface
          </span>
        </div>
        <div className="header-right">
          {!connected ? (
            <button
              className="btn-connect"
              onClick={connectWallet}
              disabled={loading.connect}
            >
              {loading.connect ? "Conectando..." : "Conectar Wallet"}
            </button>
          ) : (
            <div className="wallet-info">
              <span className="wallet-dot" />
              <span className="wallet-address">
                {accounts[0]?.slice(0, 6)}...{accounts[0]?.slice(-4)}
              </span>
            </div>
          )}
        </div>
      </header>

      <div className="contract-bar">
        <AddressChip label="CONTRACT" address={CONTRACT_ADDRESS} />
        <AddressChip label="TOKEN A" address={TOKEN_A_ADDRESS} />
        <AddressChip label="TOKEN B" address={TOKEN_B_ADDRESS} />
      </div>

      {!connected && (
        <div className="connect-prompt">
          <p className="connect-prompt-text">
            // Conectá tu wallet para interactuar con el contrato
          </p>
          <StatusBadge
            status={status.connect?.type}
            message={status.connect?.msg}
          />
        </div>
      )}

      <main className="grid">
        <Panel title="Add Liquidity" tag="01">
          <div className="field-group">
            <label className="field-label">Amount A</label>
            <input
              className="field-input"
              type="text"
              value={addAmountA}
              onChange={(e) => setAddAmountA(e.target.value)}
              placeholder="0"
              disabled={!connected}
            />
          </div>
          <div className="field-group">
            <label className="field-label">Amount B</label>
            <input
              className="field-input"
              type="text"
              value={addAmountB}
              onChange={(e) => setAddAmountB(e.target.value)}
              placeholder="0"
              disabled={!connected}
            />
          </div>
          <button
            className="btn-action"
            onClick={addLiquidity}
            disabled={!connected || loading.add}
          >
            {loading.add ? "Procesando..." : "Add Liquidity"}
          </button>
          <StatusBadge status={status.add?.type} message={status.add?.msg} />
        </Panel>

        <Panel title="Remove Liquidity" tag="02">
          <div className="field-group">
            <label className="field-label">Amount A</label>
            <input
              className="field-input"
              type="text"
              value={removeAmountA}
              onChange={(e) => setRemoveAmountA(e.target.value)}
              placeholder="0"
              disabled={!connected}
            />
          </div>
          <div className="field-group">
            <label className="field-label">Amount B</label>
            <input
              className="field-input"
              type="text"
              value={removeAmountB}
              onChange={(e) => setRemoveAmountB(e.target.value)}
              placeholder="0"
              disabled={!connected}
            />
          </div>
          <button
            className="btn-action btn-danger"
            onClick={removeLiquidity}
            disabled={!connected || loading.remove}
          >
            {loading.remove ? "Procesando..." : "Remove Liquidity"}
          </button>
          <StatusBadge
            status={status.remove?.type}
            message={status.remove?.msg}
          />
        </Panel>

        <Panel title="Swap A → B" tag="03">
          <div className="field-group">
            <label className="field-label">Token A In</label>
            <input
              className="field-input"
              type="text"
              value={swapAmountA}
              onChange={(e) => setSwapAmountA(e.target.value)}
              placeholder="0"
              disabled={!connected}
            />
          </div>
          {swapResultB !== null && (
            <div className="result-box">
              <span className="result-label">Token B estimado</span>
              <span className="result-value">{swapResultB}</span>
            </div>
          )}
          <button
            className="btn-action"
            onClick={swapAforB}
            disabled={!connected || loading.swapAB}
          >
            {loading.swapAB ? "Procesando..." : "Swap A → B"}
          </button>
          <StatusBadge
            status={status.swapAB?.type}
            message={status.swapAB?.msg}
          />
        </Panel>

        <Panel title="Swap B → A" tag="04">
          <div className="field-group">
            <label className="field-label">Token B In</label>
            <input
              className="field-input"
              type="text"
              value={swapAmountB}
              onChange={(e) => setSwapAmountB(e.target.value)}
              placeholder="0"
              disabled={!connected}
            />
          </div>
          {swapResultA !== null && (
            <div className="result-box">
              <span className="result-label">Token A estimado</span>
              <span className="result-value">{swapResultA}</span>
            </div>
          )}
          <button
            className="btn-action"
            onClick={swapBforA}
            disabled={!connected || loading.swapBA}
          >
            {loading.swapBA ? "Procesando..." : "Swap B → A"}
          </button>
          <StatusBadge
            status={status.swapBA?.type}
            message={status.swapBA?.msg}
          />
        </Panel>

        <Panel title="Get Token Price" tag="05">
          <div className="field-group">
            <label className="field-label">Token Address</label>
            <input
              className="field-input field-input--mono"
              type="text"
              value={tokenAddress}
              onChange={(e) => setTokenAddress(e.target.value)}
              placeholder="0x..."
              disabled={!connected}
            />
          </div>
          <div className="quick-addresses">
            <button
              className="quick-btn"
              onClick={() => setTokenAddress(TOKEN_A_ADDRESS)}
              disabled={!connected}
            >
              Token A
            </button>
            <button
              className="quick-btn"
              onClick={() => setTokenAddress(TOKEN_B_ADDRESS)}
              disabled={!connected}
            >
              Token B
            </button>
          </div>
          {tokenPrice !== null && (
            <div className="result-box">
              <span className="result-label">Precio</span>
              <span className="result-value">{tokenPrice}</span>
            </div>
          )}
          <button
            className="btn-action"
            onClick={getPrice}
            disabled={!connected || loading.price}
          >
            {loading.price ? "Consultando..." : "Get Price"}
          </button>
          <StatusBadge
            status={status.price?.type}
            message={status.price?.msg}
          />
        </Panel>
      </main>

      <footer className="footer">
        <span>SimpleDEX — Unit 3 Project</span>
        <span className="footer-sep">·</span>
        <a
          className="footer-link"
          href={`https://sepolia.etherscan.io/address/${CONTRACT_ADDRESS}`}
          target="_blank"
          rel="noreferrer"
        >
          Ver en Etherscan ↗
        </a>
      </footer>
    </div>
  );
}

export default App;
