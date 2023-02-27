import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Contract } from 'ethers';
import { Model } from 'mongoose';
import { lastValueFrom, map } from 'rxjs';
import * as _ from 'lodash';

import CollectionABI from '../message-generator/ABI/CollectionABI';
import { TYPES } from 'src/constants';
import {
  convertToHexAndPad64,
  getSigningDomain,
  getWalletWithProvider,
} from 'src/utils/web3';
import { generateAllSeasonLoot, sleep } from 'src/utils/bingo-utils';
import { BingoMessage, BingoMessageDocument } from './bingo-message.model';
import { Message, MessageDocument } from './message.model';

@Injectable()
export class MessageGeneratorService {
  constructor(
    @InjectModel(Message.name)
    private readonly messageModel: Model<MessageDocument>,
    @InjectModel(BingoMessage.name)
    private readonly bingoMessageModel: Model<BingoMessageDocument>,
    private readonly httpService: HttpService,
  ) {}

  async generateMessage(data) {
    const { contractAddress, chainId, folderCID, numOfMessages } = data;

    const wallet = getWalletWithProvider(chainId);
    const addrToLower = contractAddress.toLowerCase();

    const signingDomain = getSigningDomain(addrToLower, chainId);

    const signedMessages = [];

    for (let tokenId = 1; tokenId <= numOfMessages; tokenId++) {
      const token = {
        tokenId,
      };

      const signature = await wallet.signTypedData(signingDomain, TYPES, token);

      const uri = `ipfs://${folderCID}/${convertToHexAndPad64(tokenId)}.json`;

      signedMessages.push({
        ...token,
        uri,
        signature,
        address: addrToLower,
      });
    }

    await this.messageModel.insertMany(signedMessages);
  }

  async generateBingoMessage(data) {
    const { contractAddress, chainId, folderCID } = data;
    const addrToLower = contractAddress.toLowerCase();

    const signingDomain = getSigningDomain(addrToLower, 13812);
    const fullLoot = generateAllSeasonLoot();
    const wallet = getWalletWithProvider(chainId);

    const signedMessages = [];

    for (let i = 0; i < fullLoot.length; i++) {
      const loot = fullLoot[i];
      const symbolId = i + 1;

      const fileName = convertToHexAndPad64(loot.tokenId);
      const uri = `ipfs://${folderCID}/${fileName}.json`;

      const signature = await wallet.signTypedData(signingDomain, TYPES, {
        tokenId: loot.tokenId,
        seasonSymbolId: loot.seasonSymbolId,
        symbolId,
      });

      signedMessages.push({
        ...loot,
        uri,
        symbolId,
        signature,
        address: addrToLower,
      });
    }

    await this.bingoMessageModel.insertMany(signedMessages);
  }

  async mint(data) {
    const { fromContractAddress, toContractAddress, toChainId } = data;

    /**
     * Get Data
     */

    const { ownerBatches, nftBatches } = await this.getMintedData(
      fromContractAddress,
    );

    /**
     * Mint NFT
     */

    await this.mintBatches(
      toChainId,
      toContractAddress,
      ownerBatches,
      nftBatches,
    );
  }

  private async getMintedData(addrToLower) {
    const source = this.httpService
      .get(
        `https://gateway.opn.network/wallet-backend-staging/nft/collection/${addrToLower}`,
      )
      .pipe(map((resp) => resp.data));

    const resp = await lastValueFrom(source);

    const [owners, nfts] = [[], []];

    resp.result.assets.forEach((nft) => {
      owners.push(nft.owner_address);
      nfts.push(nft.token_id);
    });

    return {
      nftBatches: _.chunk(nfts, 30),
      ownerBatches: _.chunk(owners, 30),
    };
  }

  private async mintBatches(
    toChainId,
    toContractAddress,
    ownerBatches,
    nftBatches,
  ) {
    const wallet = getWalletWithProvider(toChainId);

    const contract = new Contract(toContractAddress, CollectionABI, wallet);

    for (let i = 0; i < ownerBatches.length; i++) {
      const owners = ownerBatches[i];
      const nfts = nftBatches[i];

      const tx = await contract.mintBatch(owners, nfts);
      const receipt = await tx.wait();

      if (receipt.status === 1) {
        console.log(`Batch #${i} successfully processed 🚀`);
      } else {
        console.log(
          `Batch #${i} Failed, TokenIDS: ${nfts} / Owners: ${owners}`,
        );
      }

      await sleep(15_000);
    }
  }
}
