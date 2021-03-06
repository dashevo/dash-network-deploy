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
      });

      it('should respond with Core data via gRPC Web', async function it() {
        this.timeout(15000);

        let result = await dapiClient.core.getBlockByHeight(1, {
          // eslint-disable-next-line no-underscore-dangle
          dapiAddresses: [`${inventory._meta.hostvars[hostName].public_ip}:${variables.dapi_port}`],
        });

        const block = new Block(result);

        result = await dapiClient.core.getBlockByHash(block.header.hash, {
          // eslint-disable-next-line no-underscore-dangle
          dapiAddresses: [`${inventory._meta.hostvars[hostName].public_ip}:${variables.dapi_port}`],
        });

        const blockByHash = new Block(result);

        expect(block.toJSON()).to.deep.equal(blockByHash.toJSON());
      });

      it('should respond with Platform data via gRPC Web', async function it() {
        this.timeout(15000);

        const unknownContractId = Buffer.alloc(32).fill(1);

        try {
          await dapiClient.platform.getDataContract(unknownContractId, {
            // eslint-disable-next-line no-underscore-dangle
            dapiAddresses: [`${inventory._meta.hostvars[hostName].public_ip}:${variables.dapi_port}`],
          });

          expect.fail('should respond not found');
        } catch (e) {
          // NOT_FOUND
          expect(e.code).to.be.equal(5);
        }
      });
    });
  }
});
