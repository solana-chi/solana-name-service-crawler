# solana-name-service-crawler
A tool for crawling all accounts having over 1 SNS address

## Concept
In Solana Name Service, all addresses account are owned by Name Service Program. We collect all address owned by the program and filter accounts who's parent name are `.sol`.

## Installation
In order to use this tool, typescript and ts-node will be reuqired. Next, install all essential packages for this node project.
```
$npm install -g typescript ts-node
$yarn
```
##
`yarn dev` for debugging the program
```
$yarn dev
```

`yarn build` for compile the program
```
$yarn build
```
## 

## Referenses
Special thanks to Solana and Bonfida team providing useful documents:
- https://github.com/Bonfida/solana-name-service-guide
- https://spl.solana.com/name-service
- https://docs.bonfida.org/collection/v/help/