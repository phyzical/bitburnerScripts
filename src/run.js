/** @param {import("globals").NS } ns */
export async function main(ns) {
    ns.exec("worm/run.js", "home");
    await ns.sleep(1000 * 5)

    ns.exec("upgrades/run.js", "home");
    ns.exec("player/run.js", "home");
    ns.exec("contracts/run.js", "home");
    ns.exec("gang/run.js", "home");
    ns.exec("corp/run.js", "home");

    await ns.sleep(1000 * 5)
    ns.exec("worm/home.js", "home");
}