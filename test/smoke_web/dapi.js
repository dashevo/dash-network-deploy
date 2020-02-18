/* eslint-disable no-loop-func */
const DAPIClient = require('@dashevo/dapi-client');

const { Block } = require('@dashevo/dashcore-lib');

// eslint-disable-next-line no-undef
const { config: { testVariables: { inventory, variables } } } = __karma__;

describe('DAPI', () => {
  for (const hostName of inventory.masternodes.hosts) {
    describe(hostName, () => {
      let dapiClient;

      before(() => {
        dapiClient = new DAPIClient();
        dapiClient.getGrpcUrl = function getGrpcUrl() {
          // eslint-disable-next-line no-underscore-dangle
          return `${inventory._meta.hostvars[hostName].public_ip}:${variables.dapi_port}`;
        };
      });

      it('should respond via GRPC web with a block for a selected height and hash and both should be equal', async () => {
        let result = await dapiClient.getBlockByHeight(1);

        const block = new Block(result);

        result = await dapiClient.getBlockByHash(block.header.hash);

        const blockByHash = new Block(result);

        expect(block.toJSON()).to.deep.equal(blockByHash.toJSON());
      });
    });
  }
});
