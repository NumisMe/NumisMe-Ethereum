module.exports = async ({ getChainId, getNamedAccounts, deployments }) => {
    const { deploy, execute } = deployments;
    const chainId = await getChainId();
    let { deployer, MIMCRV } = await getNamedAccounts();
    const Controller = await deployments.get('Controller');
    const Manager = await deployments.get('Manager');
    const Minter = await deployments.get('Minter');
    const GaugeProxy = await deployments.get('GaugeProxy');
    const GaugeUsers = await deployments.get('GaugeUsers');

    const VaultToken = await deploy('MIM3CRVVaultToken', {
        contract: 'VaultToken',
        from: deployer,
        log: true,
        args: ['NumisMe MIM3CRV Vault Token', 'nV:MIM3CRV', Manager.address]
    });

    const Vault = await deploy('MIM3CRVVault', {
        contract: 'Vault',
        from: deployer,
        log: true,
        args: [MIMCRV, VaultToken.address, Manager.address]
    });

    const Gauge = await deploy('MIM3CRVVaultGauge', {
        contract: 'LiquidityGaugeV2',
        from: deployer,
        log: true,
        args: [VaultToken.address, Minter.address, GaugeProxy.address, GaugeUsers.address]
    });

    if (Gauge.newlyDeployed) {
        await execute(
            'GaugeController',
            { from: deployer, log: true },
            'add_gauge(address,int128,uint256)',
            Gauge.address,
            0,
            ethers.utils.parseEther('1')
        );
        // await execute(
        //     'Manager',
        //     { from: deployer, log: true },
        //     'setAllowedVault',
        //     Vault.address,
        //     true
        // );
        // await execute('Manager', { from: deployer, log: true }, 'addVault', Vault.address);
        // await execute(
        //     'Manager',
        //     { from: deployer, log: true },
        //     'setController',
        //     Vault.address,
        //     Controller.address
        // );
        await execute(
            'MIM3CRVVault',
            { from: deployer, log: true },
            'setGauge',
            Gauge.address
        );
    }
};

module.exports.tags = ['eth', 'vault'];
