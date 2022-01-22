/** @param {import("globals").NS } ns */
export async function main(ns) {
    let servers = ns.getPurchasedServers()
    let lowestRam = servers.length && servers.reduce((acc, host) => {
        let tempRam = ns.getServerMaxRam(host)
        return acc > tempRam ? tempRam : acc
    }, 99999999999999999999999999999999999999999999999999999999999999999999)

    let ram = lowestRam || 8
    let equalRam = servers.reduce((acc, host) => {
        return acc ? ns.getServerMaxRam(host) == ram : acc
    }, true)

    if ((ram == ns.getPurchasedServerMaxRam()) && equalRam) {
        // this means were at max
        return true;
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
}