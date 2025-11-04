import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { network } from "hardhat";

interface IncrementEvent {
  args: {
    by: bigint;
  };
}

void describe("Counter", async function () {
  const { viem } = await network.connect();
  const publicClient = await viem.getPublicClient();

  void it("Should emit the Increment event when calling the inc() function", async function () {
    const counter = await viem.deployContract("Counter");

    await viem.assertions.emitWithArgs(
      counter.write.inc(),
      counter,
      "Increment",
      [1n],
    );
  });

  void it("The sum of the Increment events should match the current value", async function () {
    const counter = await viem.deployContract("Counter");
    const deploymentBlockNumber = await publicClient.getBlockNumber();

    // run a series of increments
    for (let i = 1n; i <= 10n; i++) {
      await counter.write.incBy([i]);
    }

    const events = await publicClient.getContractEvents({
      address: counter.address,
      abi: counter.abi,
      eventName: "Increment",
      fromBlock: deploymentBlockNumber,
      strict: true,
    });

    // Type assertion per risolvere l'errore
    const incrementEvents = events as IncrementEvent[];

    // check that the aggregated events match the current value
    let total = 0n;
    for (const event of incrementEvents) {
      total += event.args.by;
    }

    assert.equal(total, await counter.read.x());
  });
});