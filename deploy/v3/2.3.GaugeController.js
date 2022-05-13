module.exports = async ({ getNamedAccounts, deployments }) => {
    const { ethers } = require('hardhat');
    const { deploy, execute } = deployments;
    const { deployer, treasury, NUME } = await getNamedAccounts();

    votingEscrow = await deployments.get('VotingEscrow');

    const GaugeController = await deploy('GaugeController', {
        from: deployer,
        log: true,
        args: [NUME, votingEscrow.address]
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

module.exports.tags = ['eth'];
