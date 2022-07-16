## Install openzeppelin cairo contracts
```bash
pip install openzeppelin-cairo-contracts
```

## Install nile
pip install cairo-nile==0.7.0

## Account.cairo
```
%lang starknet
from openzeppelin.account.Account import constructor
```

# use .env or export to assign SIGNER_SECRET
# .env
SIGNER_SECRET=123456

source .env

nile compile

# deploy contract 
nile deploy contract --alias vascue --network=goerli {OWNER_ADDRESS}

## Set up local devnet
```bash
nile node
```