import { DEFAULT_SYMBOL_AMOUNT } from 'src/constants';

const generateSymbol = (
  symbol: string,
  tokenId: number,
  symbolAmount: number,
  season: number,
) => {
  const totalAmount = symbol === 'OPN' ? symbolAmount : DEFAULT_SYMBOL_AMOUNT;
  const result = [];

  for (let i = 0; i < totalAmount; i++) {
    result.push({
      tokenId,
      symbol,
      season,
      seasonSymbolId: i + 1,
    });
  }

  return result;
};

const generateLootForSeason = (opnSymbolAmount: number, season: number) => {
  const opnSymbol = generateSymbol('OPN', 1, opnSymbolAmount, season);
  const nSymbol = generateSymbol('N', 2, opnSymbolAmount, season);
  const eSymbol = generateSymbol('E', 3, opnSymbolAmount, season);
  const tSymbol = generateSymbol('T', 4, opnSymbolAmount, season);
  const wSymbol = generateSymbol('W', 5, opnSymbolAmount, season);
  const oSymbol = generateSymbol('O', 6, opnSymbolAmount, season);
  const rSymbol = generateSymbol('R', 7, opnSymbolAmount, season);
  const kSymbol = generateSymbol('K', 8, opnSymbolAmount, season);

  return [
    ...opnSymbol,
    ...nSymbol,
    ...eSymbol,
    ...tSymbol,
    ...wSymbol,
    ...oSymbol,
    ...rSymbol,
    ...kSymbol,
  ];
};

export const generateAllSeasonLoot = () => {
  const firstSeasonLoot = generateLootForSeason(1, 1);
  const secondSeasonLoot = generateLootForSeason(2, 2);
  const thirdSeasonLoot = generateLootForSeason(3, 3);
  const forthSeasonLoot = generateLootForSeason(3, 4);

  return [
    ...firstSeasonLoot,
    ...secondSeasonLoot,
    ...thirdSeasonLoot,
    ...forthSeasonLoot,
  ];
};

export const sleep = (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};
