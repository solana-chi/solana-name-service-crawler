import { NAME_PROGRAM_ID, performReverseLookup, getFilteredProgramAccounts } from '@bonfida/spl-name-service';
import { Connection, PublicKey, AccountInfo, clusterApiUrl } from '@solana/web3.js';
import { Buffer } from 'buffer';

const SPL_CLASS_ID = new PublicKey('33m47vH6Eav6jr5Ry86XjhRft2jRBLDnDgPSHoquXi2Z');

export async function findAllNameAccounts(
    connection: Connection
  ): Promise<PublicKey[]> {

    const filters = [
      {
        memcmp: {
          offset: 64,
          bytes: SPL_CLASS_ID.toBase58(),
        },
      },
    ];

    const accounts: Array<{
        pubkey: PublicKey;
        account: AccountInfo<Buffer>;
      }> = await connection.getProgramAccounts(NAME_PROGRAM_ID, {
      filters,
    });
    
    return accounts.map((a) => a.pubkey);
}

async function main() {
    let connection = new Connection(clusterApiUrl('mainnet-beta'));

    const publicKeys = await findAllNameAccounts(connection);
    console.log(publicKeys.length);
}

main();