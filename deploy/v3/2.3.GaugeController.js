module.exports = async ({ getNamedAccounts, deployments }) => {
    const { ethers } = require('hardhat');
    const { deploy, execute } = deployments;
    const { deployer, treasury, YAXIS } = await getNamedAccounts();

    let votingEscrow;
    try {
        votingEscrow = await deployments.get('VotingEscrow');
    } catch {
        const name = 'Vote-escrowed YAXIS';
        const symbol = 'veYAXIS';
        const version = 'veYAXIS_1.0.0';
        votingEscrow = await deploy({
            from: deployer,
            log: true,
            args: [YAXIS, name, symbol, version]
        });
    }

    const GaugeController = await deploy('GaugeController', {
        from: deployer,
        log: true,
        args: [YAXIS, votingEscrow.address]
    });

    if (GaugeController.newlyDeployed) {
        await execute(
            'GaugeController',
            { from: deployer, log: true },
            'add_type(string,uint256)',
            'vault',
            ethers.utils.parseEther('1')
        );
        await execute(
            'GaugeController',
            { from: deployer, log: true },
            'commit_transfer_ownership',
            treasury
        );
    }
};

module.exports.tags = ['avax'];
