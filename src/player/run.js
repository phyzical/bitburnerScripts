import constants from "util/constants";

/** @param {import("NetscriptDefinitions").NS } ns */
export async function main(ns) {
    while (1) {
        ns.stopAction()
        let working = false
        for (let script of constants.scripts.player) {
            if (!working) {
                ns.exec(script, "home");
                while (ns.scriptRunning(script, "home")) {
                    await ns.sleep(1000 * 1)
                }
                if (ns.getPlayer().isWorking) {
                    working = true
                }
            }
        }

        let i = 0;
        // 300 seconds or stops working check every second
        while (i < 300 && ns.getPlayer().isWorking) {
            await ns.sleep(1000 * 1)
            i++
        }
    }
}