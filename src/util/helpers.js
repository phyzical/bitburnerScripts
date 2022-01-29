/** @param {import("NetscriptDefinitions").NS } ns */
export async function getServers(ns, ignoreHackingRequirement = false) {
    var servers = ns.scan("home").map(x => ({
        server: ns.getServer(x),
        path: ["home"]
    }))
    let length = -1
    while (servers.length != length) {
        length = servers.length
        servers.forEach(({
            server: {
                hostname
            },
            path
        }) => {
            let neighbors = ns.scan(hostname)
            let missingHosts = neighbors
                .filter((neighbor) => neighbor != "home" && !servers.find((x) => x.server.hostname == neighbor))
                .map(x => ({
                    server: ns.getServer(x),
                    path: path.concat(hostname)
                }))
            servers = servers.concat(missingHosts);
        })
    }

    const connectPathsFromHome = servers.reduce((acc, {
        server,
        path
    }) => {
        acc[server.hostname] = {
            path,
            server
        }
        return acc
    }, {})

    servers = servers.reduce((acc, {
        server,
    }) => {
        if (ignoreHackingRequirement || (ns.getHackingLevel() >= server.requiredHackingSkill)) {
            acc.push(server)
        }
        return acc
    }, [])

    return {
        connectPathsFromHome,
        servers,
        serversWithCash: servers.filter(({
            hostname,
            moneyMax
        }) => !hostname.includes("pserv-") && moneyMax > 0 && hostname != "darkweb")
    }
}

/** @param {import("NetscriptDefinitions").NS } ns */
export async function log(ns, filename, content) {
    await ns.write(filename, content + '\n')
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