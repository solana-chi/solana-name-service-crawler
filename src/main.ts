import { NAME_PROGRAM_ID, performReverseLookup, getFilteredProgramAccounts, NameRegistryState } from '@bonfida/spl-name-service';
import { Connection, PublicKey, AccountInfo, clusterApiUrl } from '@solana/web3.js';
import { Buffer } from 'buffer';
import * as borsh from 'borsh';

const SPL_CLASS_ID = new PublicKey('33m47vH6Eav6jr5Ry86XjhRft2jRBLDnDgPSHoquXi2Z');

export async function findAllNameAccounts(
    connection: Connection
  ): Promise<string[]> {

    const filters = [
      {
        // memcmp: {
        //   offset: 64,
        //   bytes: SPL_CLASS_ID.toBase58(),
        // },
        memcmp: {
          offset: 32,
          bytes: new PublicKey('Fe4yQVFiJTYRCqxuGKVsx9cRnf8sxttKbsmZtwWKo91r').toBase58(),
        }
      },
    ];

    const accounts: Array<{
        pubkey: PublicKey;
        account: AccountInfo<Buffer>;
      }> = await connection.getProgramAccounts(NAME_PROGRAM_ID, {
      filters,
    });

    const addresses = accounts.map(info => 
      borsh.deserializeUnchecked(NameRegistryState.schema, NameRegistryState, info.account.data).owner.toString());

    const uniqAddresses = [...new Set(addresses)];
    
    return uniqAddresses;
}

async function main() {
    let connection = new Connection(clusterApiUrl('mainnet-beta'));

    const publicKeys = await findAllNameAccounts(connection);
    console.log(publicKeys.length);
}

main();