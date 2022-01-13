/** @param {import("globals").NS } ns */
export async function main(ns) {
    // let homeRam = ns.getServerMaxRam("home")
    ns.exec("upgrades/purchaseTech.js", "home");
    // if (homeRam > 50) {
    //  ns.exec("upgrades/hacknetBot.js", "home");
    // }
    ns.exec("worm/run.js", "home");
    await ns.sleep(1000 * 5)
    // if (homeRam > 50) {
    ns.exec("contracts/run.js", "home");
    // ns.exec("gang/run.js", "home");
    // }
    await ns.sleep(1000 * 5)
    ns.exec("worm/home.js", "home");
}