import { useCallback, useEffect, useMemo, useState } from "react";
import { SiweMessage } from "siwe";
import styles from "../styles/DinoGame.module.css";

type AuthState = {
  address: string | null;
  loading: boolean;
  error: string | null;
};

type WalletConnectProps = {
  onAuthChange?: (address: string | null) => void;
};

const BASE_CHAIN = {
  chainId: "0x2105",
  chainName: "Base",
  nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
  rpcUrls: ["https://mainnet.base.org"],
  blockExplorerUrls: ["https://basescan.org"],
};

function formatAddress(address: string) {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export default function WalletConnect({ onAuthChange }: WalletConnectProps) {
  const [state, setState] = useState<AuthState>({
    address: null,
    loading: true,
    error: null,
  });

  const hasProvider = useMemo(
    () => typeof window !== "undefined" && !!window.ethereum,
    []
  );

  const fetchMe = useCallback(async () => {
    try {
      const res = await fetch("/api/auth/me");
      const data = (await res.json()) as { address: string | null };
      setState((prev) => ({
        ...prev,
        address: data.address,
        loading: false,
      }));
      onAuthChange?.(data.address);
    } catch {
      setState((prev) => ({
        ...prev,
        loading: false,
        error: "Не вдалося перевірити сесію",
      }));
      onAuthChange?.(null);
    }
  }, [onAuthChange]);

  useEffect(() => {
    fetchMe();
  }, [fetchMe]);

  const ensureBaseChain = useCallback(async () => {
    if (!window.ethereum) return;
    const chainId = (await window.ethereum.request({
      method: "eth_chainId",
    })) as string;
    if (chainId === BASE_CHAIN.chainId) return;
    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: BASE_CHAIN.chainId }],
      });
    } catch (error) {
      const err = error as { code?: number };
      if (err?.code === 4902) {
        await window.ethereum.request({
          method: "wallet_addEthereumChain",
          params: [BASE_CHAIN],
        });
      } else {
        throw error;
      }
    }
  }, []);

  const connect = useCallback(async () => {
    if (!window.ethereum) {
      setState((prev) => ({
        ...prev,
        error: "MetaMask не знайдено",
      }));
      return;
    }

    try {
      setState((prev) => ({ ...prev, loading: true, error: null }));
      await ensureBaseChain();
      const accounts = (await window.ethereum.request({
        method: "eth_requestAccounts",
      })) as string[];
      const address = accounts?.[0];
      if (!address) throw new Error("No account");

      const nonceRes = await fetch("/api/auth/nonce");
      const nonceData = (await nonceRes.json()) as { nonce: string };

      const siweMessage = new SiweMessage({
        domain: window.location.host,
        address,
        statement: "Sign in to Base Dino",
        uri: window.location.origin,
        version: "1",
        chainId: 8453,
        nonce: nonceData.nonce,
        issuedAt: new Date().toISOString(),
      });
      const message = siweMessage.prepareMessage();

      const signature = (await window.ethereum.request({
        method: "personal_sign",
        params: [message, address],
      })) as string;

      const verifyRes = await fetch("/api/auth/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ address, signature, message }),
      });

      if (!verifyRes.ok) {
        const errorData = await verifyRes.json();
        throw new Error(errorData?.error || "Auth failed");
      }

      setState({ address, loading: false, error: null });
      onAuthChange?.(address);
    } catch (error) {
      setState({
        address: null,
        loading: false,
        error:
          error instanceof Error ? error.message : "Не вдалося підключити",
      });
      onAuthChange?.(null);
    }
  }, [ensureBaseChain, onAuthChange]);

  const logout = useCallback(async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setState({ address: null, loading: false, error: null });
    onAuthChange?.(null);
  }, [onAuthChange]);

  if (!hasProvider) {
    return (
      <div className={styles.wallet}>
        <span className={styles.walletText}>MetaMask не встановлено</span>
      </div>
    );
  }

  return (
    <div className={styles.wallet}>
      {state.address ? (
        <>
          <span className={styles.walletText}>
            {formatAddress(state.address)}
          </span>
          <button className={styles.walletButton} onClick={logout}>
            Вийти
          </button>
        </>
      ) : (
        <button
          className={styles.walletButton}
          onClick={connect}
          disabled={state.loading}
        >
          {state.loading ? "Підключення..." : "Підключити гаманець"}
        </button>
      )}
      {state.error && <span className={styles.walletError}>{state.error}</span>}
    </div>
  );
}
