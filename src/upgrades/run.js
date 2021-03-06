import constants from "util/constants";

/** @param {import("NetscriptDefinitions").NS } ns */
export async function main(ns) {
    while (1) {
        if (ns.readPort(1) == "false") {
            for (let script of constants.scripts.upgrades) {
                ns.exec(script, "home");
                while (ns.scriptRunning(script, "home")) {
                    await ns.sleep(1000 * 1)
                }
                await ns.sleep(1000 * 1)
            }
        }
        await ns.sleep(1000 * 60)
    }
}