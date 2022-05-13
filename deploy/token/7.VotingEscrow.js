module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, execute } = deployments;
    const { deployer, NUME } = await getNamedAccounts();
    const name = 'Vote-escrowed NUME';
    const symbol = 'veNUME';
    const version = 'veNUME_1.0.0';

    const VotingEscrow = await deploy('VotingEscrow', {
        from: deployer,
        log: true,
        args: [NUME, name, symbol, version]
    });
};

module.exports.tags = ['eth'];
