import { JsonRpcProvider, Wallet } from 'ethers';
import { PROVIDERS } from '../constants';

export const getSigningDomain = (address, chainId) => {
  const SIGNING_DOMAIN_NAME = 'LazyNFT-Voucher';
  const SIGNING_DOMAIN_VERSION = '1';

  return {
    name: SIGNING_DOMAIN_NAME,
    version: SIGNING_DOMAIN_VERSION,
    verifyingContract: address,
    chainId,
  };
};

export const convertToHexAndPad64 = (tokenId) =>
  ('0'.repeat(64) + tokenId.toString(16)).slice(-64);

export const getProvider = (chainId) => {
  return new JsonRpcProvider(PROVIDERS[chainId]);
};

export const getWalletWithProvider = (chainId) => {
  return Wallet.fromPhrase(process.env.SEED_PHRASE).connect(
    getProvider(chainId),
  );
};
