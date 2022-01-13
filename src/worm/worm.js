import {
    getServers
} from "helpers.js"

/** @param {import("index").NS } ns */
export async function main(ns) {
    let {
        servers,
        serversWithCash
    } = await getServers(ns)
    await ns.clear("worm-log.txt")
    const ramUsage = 2.2;

    for (let server of servers) {
        let remainingThreads = Math.floor(server.maxRam / ramUsage)

        while (remainingThreads > 1) {
            await ns.write("worm-log.txt", `server ${server.hostname} has ${remainingThreads} threads remaining \n`)
            let target = serversWithCash[Math.floor(Math.random() * serversWithCash.length)]
            let privateServer = servers.find(x => x.hostname.includes("pserv-"))
            let maxHackThreads = 50 //Math.floor(ns.hackAnalyzeThreads(target.hostname, target.moneyAvailable) * (target.moneyMax / target.moneyAvailable))
            if (privateServer && privateServer.hostname.includes("TB")) {
                maxHackThreads = 200
            }
            if (privateServer && privateServer.hostname.includes("PB")) {
                maxHackThreads = 400
            }

            let threads = remainingThreads > maxHackThreads ? maxHackThreads : remainingThreads
            if (threads > 0 && target.hasAdminRights) {
                await ns.write("worm-log.txt", `executing hacker on ${target.hostname}, threads: ${threads} \n`)
                ns.exec("worm/hacker.js", server.hostname, threads, target.hostname, target.moneyMax, target.minDifficulty);
                await ns.sleep(1)
            }
            remainingThreads = remainingThreads - threads
        }
    }
}