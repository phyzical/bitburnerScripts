import constants from "util/constants";

/** @param {import("NetscriptDefinitions").NS } ns */
export async function main(ns) {
    while (1) {
        ns.stopAction()
        let working = false
        const scripts = constants.scripts.player
        if (ns.gang.inGang()) {
            scripts.push(scripts.splice(2, 1)[0])
        }

        for (let script of scripts) {
            if (!working) {
                ns.exec(script, "home", 1);
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