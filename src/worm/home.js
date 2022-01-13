import {
    getServers
} from "helpers.js"

/** @param {import("index").NS } ns */
export async function main(ns) {
    let {
        serversWithCash
    } = await getServers(ns)
    const ramUsage = 2.2;
    let homeRam = ns.getServerMaxRam("home")
    let ram = homeRam - ns.getServerUsedRam("home")
    ram = homeRam > 50 ? ram - 20 : ram
    let remainingThreads = Math.floor((ram) / ramUsage)
    while (remainingThreads > 0) {
        let target = serversWithCash[Math.floor(Math.random() * serversWithCash.length)]
        let maxHackThreads = 3 //Math.floor(ns.hackAnalyzeThreads(target.hostname, target.moneyAvailable) * (target.moneyMax / target.moneyAvailable))
        if (homeRam > 500) {
            maxHackThreads = 50
        }
        if (homeRam > 1000) {
            maxHackThreads = 200
        }
        if (homeRam > 1000000) {
            maxHackThreads = 400
        }
        let threads = remainingThreads > maxHackThreads ? maxHackThreads : remainingThreads
        if (threads > 0 && target.hasAdminRights) {
            await ns.write("homeWorm-log.txt", `executing hacker on ${target.hostname}, threads: ${threads} \n`)
            ns.exec("worm/hacker.js", "home", threads, target.hostname, target.moneyMax, target.minDifficulty);
        }
        remainingThreads = remainingThreads - threads
    }
}