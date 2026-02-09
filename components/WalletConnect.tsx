import { useCallback, useEffect, useRef, useState } from "react";
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

type Eip1193Provider = {
  request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
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

  const providerRef = useRef<Eip1193Provider | null>(null);
  const [hasProvider, setHasProvider] = useState<boolean>(false);

  const loadProvider = useCallback(async () => {
    try {
      const { sdk } = await import("@farcaster/miniapp-sdk");
      const provider = (await sdk.wallet.getEthereumProvider()) as
        | Eip1193Provider
        | undefined;
      if (provider) {
        providerRef.current = provider;
        setHasProvider(true);
        return provider;
      }
    } catch {
      // Ignore if SDK not available
    }
    if (typeof window !== "undefined" && window.ethereum) {
      providerRef.current = window.ethereum as Eip1193Provider;
      setHasProvider(true);
      return providerRef.current;
    }
    setHasProvider(false);
    return null;
  }, []);

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
    loadProvider();
    fetchMe();
  }, [fetchMe, loadProvider]);

  const ensureBaseChain = useCallback(async (provider: Eip1193Provider) => {
    const chainId = (await provider.request({
      method: "eth_chainId",
    })) as string;
    if (chainId === BASE_CHAIN.chainId) return;
    try {
      await provider.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: BASE_CHAIN.chainId }],
      });
    } catch (error) {
      const err = error as { code?: number };
      if (err?.code === 4902) {
        await provider.request({
          method: "wallet_addEthereumChain",
          params: [BASE_CHAIN],
        });
      } else {
        throw error;
      }
    }
  }, []);

  const connect = useCallback(async () => {
    const provider = await loadProvider();
    if (!provider) {
      setState((prev) => ({
        ...prev,
        error: "Гаманець недоступний у цьому середовищі",
      }));
      return;
    }

    try {
      setState((prev) => ({ ...prev, loading: true, error: null }));
      await ensureBaseChain(provider);
      const accounts = (await provider.request({
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

      const signature = (await provider.request({
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
  }, [ensureBaseChain, loadProvider, onAuthChange]);

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
