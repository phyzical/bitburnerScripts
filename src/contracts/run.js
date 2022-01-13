/** @param {import("index").NS } ns */
export async function main(ns) {
    while (1) {
        ns.exec("contracts/sniffer.js", "home");
        await ns.sleep(1000 * 60 * 0.5)
        ns.kill("/contracts/solver.js", "home");
        ns.exec("contracts/solver.js", "home");
        await ns.sleep(1000 * 60 * 15)
    }
}