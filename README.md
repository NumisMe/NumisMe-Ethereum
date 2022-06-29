# NumisMe MetaVault Contracts

The MetaVault will allow users to take advantage of the best yield farming strategies while minimizing gas fees and transferring difficult management decisions to an incentivized community governance. Multiple strategies are utilized by each vault, allowing for per-strategy deposit caps to be placed in order to limit risk.

## Writing Strategies

In order to write a strategy for the MetaVault, you must inherit the BaseStrategy contract. The BaseStrategy contract is an abstract contract that gives specific security properties which make it hard to write an insecure strategy.

All state-changing functions implemented in the strategy should be internal, since any public or externally-facing functions are already handled in the BaseStrategy.

 The following functions must be implemented by a strategy:
 - `function _deposit() internal virtual;`
 - `function _harvest() internal virtual;`
 - `function _withdraw(uint256 _amount) internal virtual;`
 - `function _withdrawAll() internal virtual;`
 - `function balanceOfPool() public view override virtual returns (uint256);`

## Getting contract addressses

Deployed addresses can be obtained by running:

```
yarn hardhat contracts --network kovan
```

### Mainnet

```
NUME 0x34769D3e122C93547836AdDD3eb298035D68F1C3
VotingEscrow 0xa770697cecA9Af6584aA59DD9F226eaF6Cd0c2dc
Manager 0xec5CdD1a415bE0b1d513cc420e4fC80CA3ca7590
Controller 0x6dB53Ed036135f2c299d54353b2ae7e748a85628
GaugeController 0x65c83006eBda35229FC61AE5cba1048F83eA5ebF
MinterWrapper 0x1731fe39EE77db5aB75484Ac6590C016E5801058
Minter 0x335aa59eFa4c8bA8B9ce36de18B19D088B180c21
GaugeUsers 0xc6c7A5659Bd02E7b797A462424d1B066f3F1c055
GaugeProxy 0xC18A4d1EE4a1D91bf9E6373Fc1270FE219111785
MIM3CRVVaultToken 0x024A3cE04706fe3dEC5EFAE904b4980bC1cD508a
MIM3CRVVault 0x9353d11eF99b8703D58FeAf69591DA62d6d6324e
MIM3CRVVaultGauge 0xb9E28267eB119D07fc2c3bFC63D4b53Ff6C2C778
ALETHCRVVaultToken 0x1fa16627E468501fBa70e39a056d83A59539CE97
ALETHCRVVault 0xf31c6eE97070dcc73781c7C9d45EC9b5E86D2912
ALETHCRVVaultGauge 0xCfF87237de72fb25342210c02B25983713B613Fe
TRICRYPTO2VaultToken 0x3C2C88B0532f3C1f8d1F5dC348EC663ED0713448
TRICRYPTO2Vault 0x1d9DC26A9067DA6C8e6038eBF176b7eB3E394149
TRICRYPTO2VaultGauge 0x2941F68fe10c16C8d710F4C51De91a82d7e89BE2
CVXETHCRVVaultToken 0x6eC48d8f290136CEA599f0707eB7323DF6ED6d4c
CVXETHCRVVault 0x1014A2e3de1C4d6C5998D7e5a264F22a35d2cACc
CVXETHCRVVaultGauge 0x7789f7f28152Ec48a4d35141decCE08CE83D69E8
FRAXCRVVaultToken 0xE3218f652205554a1c3b1d7595bce4c70a3B634C
FRAXCRVVault 0x428F5B8b8fE7b9247c09aDE2cbd7573A3BfF649D
FRAXCRVVaultGauge 0xce399Bf99df1B2dE66DeE8a100280Bb49D2Ee0af
Harvester 0x00aA9F91E83CFeFBd7F80E34A8d1D2A3C5C29Ea5
MIMConvexStrategy 0x123Fa7E8Acf2Da4fB6e5c096B59310f196495971
ALETHConvexStrategy 0xD5bA79D098679730CbF45d4CFcf52aAD5aC8bC8E
TRICRYPTO2ConvexStrategy 0x252Df30413885B6c8dD7F2721fCA17B029E84101
CVXETHConvexStrategy 0x79FB5ab1b38A50C5323a09D5F433939f4f7A74B3
FraxConvexStrategy 0x0808A1Fd2eaBE2b74d649E164a7bb5d4aD07F4A3
VaultHelper 0x00085a3568E0C01Ce528806ad5456dF36eB29aD4
SmartWalletChecker 0x215C30a7224e8e68BB4BAA5b97D2FbDb51a88f53
FeeDistributor 0xcdF55d76f7de152b3E5dfd220D9214A2C1B5FdF6
```

### Kovan

```

```
