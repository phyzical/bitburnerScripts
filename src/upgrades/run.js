import constants from "util/constants";

/** @param {import("globals").NS } ns */
export async function main(ns) {
    while (1) {
        for (let script of constants.scripts.upgrades) {
            ns.exec(script, "home");
            while (ns.scriptRunning(script, "home")) {
                await ns.sleep(1000 * 1)
            }
            await ns.sleep(1000 * 1)
        }
    }
}