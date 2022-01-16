import {
    log
} from 'util/helpers'
const LOG_FILE = "purchaseTech-log.txt"
/** @param {import("globals").NS } ns */
export async function main(ns) {
    let ram = null
    while (1) {
        await buyPrograms(ns)
        ram = await buyServers(ns, ram)
    }
}

/** @param {import("globals").NS } ns */
async function buyServers(ns, ram) {
    let servers = ns.getPurchasedServers()
    let lowestRam = servers.length && servers.reduce((acc, host) => {
        let tempRam = ns.getServerMaxRam(host)
        return acc > tempRam ? tempRam : acc
    }, 99999999999999999999999999999999999999999999999999999999999999999999)

    if (!ram) {
        ram = lowestRam || 8
    }
    let equalRam = servers.reduce((acc, host) => {
        return acc ? ns.getServerMaxRam(host) == ram : acc
    }, true)

    if ((ram == ns.getPurchasedServerMaxRam()) && equalRam) {
        ns.kill("/upgrades/purchaseTech.js", "home")
    }

    if (equalRam) {
        ram = ram * 2
    }

    while (ns.getServerMoneyAvailable("home") > ns.getPurchasedServerCost(ram)) {
        ram = ram * 2
    }
    ram = lowestRam > ram / 2 ? lowestRam : ram / 2

    if (ns.getServerMoneyAvailable("home") > ns.getPurchasedServerCost(ram)) {
        if (servers.length == ns.getPurchasedServerLimit()) {

            let tempServer = servers.find((host) => {
                return ns.getServerMaxRam(host) == lowestRam
            })
            ns.killall(tempServer)
            ns.deleteServer(tempServer)
            ns.rm(`${tempServer}-specs.txt`)
        }
        let name = `${ram}GB`
        if (ram > 1000000) {
            name = `${ram / 1000000}PB`
        } else if (ram > 1000) {
            name = `${ram / 1000}TB`
        }
        ns.purchaseServer(`pserv-${name}`, ram);
    }
    await ns.sleep(10 * 60)
    return lowestRam
}

/** @param {import("globals").NS } ns */
async function buyPrograms(ns) {
    if (!ns.getPlayer().tor) {
        await ns.purchaseTor()
    }

    //todo get real costs
    const programs = {
        BruteSSH: 0,
        FTPCrack: 0,
        relaySMTP: 0,
        HTTPWorm: 0,
        SQLInject: 0,
        ServerProfiler: 500000,
        DeepscanV1: 0,
        DeepscanV2: 0,
        AutoLink: 0,
        Formulas: 5000000000,
    }
    if (!ns.getPlayer().tor) {
        for (var program of Object.keys(programs)) {
            if (!ns.fileExists(`${program}.exe`) && ns.getPlayer().money > programs[program]) {
                ns.purchaseProgram(`${program}.exe`)
            }
        }
        await ns.sleep(10 * 15)
    }
}