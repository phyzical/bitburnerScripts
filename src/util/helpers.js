/** @param {import("index").NS } ns */
export async function getServers(ns, ignoreHackingRequirement = false) {
    var servers = ns.scan("home")
    let length = 0
    while (servers.length != length) {
        length = servers.length
        servers.forEach((server) => {
            servers = servers.concat(ns.scan(server).filter(x => !servers.includes(x)));
        })
    }

    servers = servers.filter(x => x != "home")

    servers = servers.reduce((acc, server) => {
        server = ns.getServer(server)

        if (ignoreHackingRequirement || (ns.getHackingLevel() >= server.requiredHackingSkill)) {
            acc.push(server)
        }
        return acc
    }, [])


    let serversWithCash = servers.filter((server) => !server.hostname.includes("pserv-") && server.moneyMax > 0 && server.hostname != "darkweb")

    // let serversWithCash = servers.filter(({ moneyAvailable, hostname }) => moneyAvailable > 0 && !hostname.includes("pserv-"))

    return {
        servers,
        serversWithCash
    }
}

/** @param {import("index").NS } ns */
export async function log(ns, filename, content) {
    await ns.write(filename, content + '\n')
}

/** @param {import("index").NS } ns */
export async function getEquipment(ns) {
    return ns.gang.getEquipmentNames().reduce((acc, item) => {
        let type = ns.gang.getEquipmentType(item)
        acc[type] = [{
            name: item,
            cost: ns.gang.getEquipmentCost(item),
            stats: ns.gang.getEquipmentStats(item)
        }].concat(acc[type] || []).sort((a, b) => a.cost - b.cost)
        return acc
    }, {})
}

export function sliceIntoChunks(arr, chunkSize) {
    const res = [];
    for (let i = 0; i < arr.length; i += chunkSize) {
        const chunk = arr.slice(i, i + chunkSize);
        res.push(chunk);
    }
    return res;
}

export function uniqify(array) {
    return [...new Set(array)]
}

export function getRandomString() {
    var randomChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var result = '';
    for (var i = 0; i < 4; i++) {
        result += randomChars.charAt(Math.floor(Math.random() * randomChars.length));
    }
    return result;
}