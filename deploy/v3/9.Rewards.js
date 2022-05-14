module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, execute } = deployments;
    const { deployer, NUME, NUMEETHLP } = await getNamedAccounts();

    const RewardsMinter = await deploy('RewardsMinter', {
        from: deployer,
        log: true,
        args: [NUME]
    });

    const Rewards = await deploy('Rewards', {
        from: deployer,
        log: true,
        args: [NUMEETHLP, RewardsMinter.address]
    });

    if (RewardsMinter.newlyDeployed) {
        await execute(
            'RewardsMinter',
            { from: deployer, log: true },
            'setMinter',
            Rewards.address
        );
    }
};

module.exports.tags = ['unused'];
