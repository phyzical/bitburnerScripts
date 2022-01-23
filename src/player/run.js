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

        let i = 0;
        // 60 * 5 or stops working
        while (i < 60 && ns.getPlayer().isWorking) {
            await ns.sleep(1000 * 5)
            i++
        }
    }
}