import { NAME_PROGRAM_ID, NameRegistryState } from '@bonfida/spl-name-service';
import { Connection, PublicKey, AccountInfo, clusterApiUrl } from '@solana/web3.js';
import * as borsh from 'borsh';
import * as cliprogress from 'cli-progress';
import * as fs from 'fs';

/* 
  Thanks to Solana and Bonfida team providing useful documents
  references -
  https://github.com/Bonfida/solana-name-service-guide
  https://spl.solana.com/name-service
  https://docs.bonfida.org/collection/v/help/
*/


// .sol
const SOL_PARNET_NAME = new PublicKey('58PwtjSDuFHuUkYjH9BYnnQKHfwo9reZhC2zMJv9JPkx');

export async function findAllNameAccounts(
    connection: Connection
  ): Promise<string[]> {

    const filters = [
      {
        memcmp: {
          offset: 0,
          bytes: SOL_PARNET_NAME.toBase58(),
        }
      },
    ];

    const accounts: Array<{
        pubkey: PublicKey;
        account: AccountInfo<Buffer>;
      }> = await connection.getProgramAccounts(NAME_PROGRAM_ID, {
      filters,
      dataSlice: { length: NameRegistryState.HEADER_LEN, offset: 0 }
    });

    const bar = new cliprogress.SingleBar({
      format: 'CLI Progress || {percentage}% || {value}/{total} Addresses',
      barCompleteChar: '\u2588',
      barIncompleteChar: '\u2591',
      hideCursor: true
    })

    bar.start(accounts.length, 0);

    const addresses = accounts
      .filter(info => info.account.data.length >= 96)  
      .map((info, i) => {
          const data = borsh.deserializeUnchecked(NameRegistryState.schema, NameRegistryState, info.account.data);

          bar.increment();
          return data.owner.toString();
        });

    bar.stop();

    console.log(`address counts: ${addresses.length}`);

    const uniqAddresses = [...new Set(addresses)];

    console.log(`unique address counts: ${uniqAddresses.length}`);
    
    return uniqAddresses;
}

async function main() {
    let connection = new Connection(clusterApiUrl('mainnet-beta'));

    const uniqAddresses = await findAllNameAccounts(connection);

    const file = fs.createWriteStream(
      './addresses.list',
      {
        flags: 'w+'
      }
    );

    uniqAddresses.forEach((key, i) => {
      file.write(key);
      if(i < uniqAddresses.length - 1) file.write('\n')
    })
}

main();