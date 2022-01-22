import constants from "util/constants";

/** @param {import("globals").NS } ns */
export async function main(ns) {
    while (1) {
        ns.stopAction()
        for (let script of constants.scripts.player) {
            if (!ns.getPlayer().isWorking) {
                ns.exec(script, "home");
                while (ns.scriptRunning(script, "home")) {
                    await ns.sleep(1000 * 1)
                }
            }
            await ns.sleep(1000 * 5)
        }
        // todo while not working || hsa been 5 minutes in 5 second interval checks?
        await ns.sleep(1000 * 60 * 5)
        // todo add something to auto apply augmentations
    }
}