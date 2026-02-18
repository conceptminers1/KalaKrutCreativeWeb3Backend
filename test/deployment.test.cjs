const { expect } = require("chai");
const { exec } = require("child_process");

describe("Deployment script", function () {
  it("Should deploy all contracts successfully", function (done) {
    this.timeout(100000);
    exec("npx hardhat run scripts/deploy.cjs", (error, stdout, stderr) => {
      if (error) {
        console.error(`exec error: ${error}`);
        return done(error);
      }
      expect(stdout).to.include("KalaKrutToken deployed to:");
      expect(stdout).to.include("TimelockController deployed to:");
      expect(stdout).to.include("KalaKrutGovernor deployed to:");
      expect(stdout).to.include("Treasury deployed to:");
      expect(stdout).to.include("KalaKrutNFT deployed to:");
      expect(stdout).to.include("EventTicket deployed to:");
      expect(stdout).to.include("Fractionalizer deployed to:");
      expect(stdout).to.include("Escrow deployed to:");
      done();
    });
  });
});
