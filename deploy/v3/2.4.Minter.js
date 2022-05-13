module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, execute } = deployments;
    const { deployer, NUME } = await getNamedAccounts();
    const GaugeController = await deployments.get('GaugeController');

    const MinterWrapper = await deployments.deploy('MinterWrapper', {
        from: deployer,
        log: true,
        args: [NUME]
    });

    const Minter = await deployments.deploy('Minter', {
        from: deployer,
        log: true,
        args: [MinterWrapper.address, GaugeController.address]
    });

    if (MinterWrapper.newlyDeployed) {
        await execute(
            'MinterWrapper',
            { from: deployer, log: true },
            'setMinter',
            Minter.address
        );
    }
};

module.exports.tags = ['eth'];
