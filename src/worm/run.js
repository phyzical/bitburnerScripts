/** @param {import("globals").NS } ns */
export async function main(ns) {
    while (1) {
        let hackingLvl = ns.getHackingLevel() > 50 ? ns.getHackingLevel() : 25
        ns.kill("/worm/sniffer.js", "home")
        ns.exec("worm/sniffer.js", "home")
        await ns.sleep(1000 * 60 * 0.5)
        ns.kill("/worm/worm.js", "home")
        ns.exec("worm/worm.js", "home")
        await ns.sleep(1000 * 60 * 1)

        if (ns.scan("home").filter(x => x.includes("pserv-")).length < 25) {
            await ns.sleep(1000 * 60 * (hackingLvl * 0.23))
        } else {
            while (
                (ns.scan("home").filter(x => ns.scriptRunning("/worm/hack.js", x) && x.includes("pserv-")).length > 17) ||
                ns.scriptRunning("/worm/worm.js", "home")
            ) {
                await ns.sleep(1000 * 60 * 5)
            }
        }
    }
}