'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { http } from 'viem';
import { mainnet, sepolia } from 'viem/chains';
import { injected, walletConnect } from 'wagmi/connectors';
import type { PrivyClientConfig } from '@privy-io/react-auth';
import { PrivyProvider } from '@privy-io/react-auth';
import {WagmiProvider, createConfig} from '@privy-io/wagmi';

const queryClient = new QueryClient();

export const wagmiConfig = createConfig({
  chains: [mainnet, sepolia],
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
  },
  connectors: [ injected(), walletConnect({ projectId: '99707b55e8561c469e7a0adf3c3efd0d', }) ],
  multiInjectedProviderDiscovery: true,
});

const privyConfig: PrivyClientConfig = {
  embeddedWallets: {
    createOnLogin: 'users-without-wallets',
    requireUserPasswordOnCreate: true,
    showWalletUIs: true,
  },
  loginMethods: ['wallet', 'email', 'sms'],
  appearance: {
    showWalletLoginFirst: true,
  },
};

export default function Providers({children}: {children: React.ReactNode}) {
  return (
    <PrivyProvider
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      apiUrl={process.env.NEXT_PUBLIC_PRIVY_AUTH_URL as string}
      appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID as string}
      config={privyConfig}
    >
      <QueryClientProvider client={queryClient}>
        <WagmiProvider config={wagmiConfig} reconnectOnMount={false}>
          {children}
        </WagmiProvider>
      </QueryClientProvider>
    </PrivyProvider>
  );
}
