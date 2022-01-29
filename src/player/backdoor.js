import {
    getServers,
} from "util/helpers";
/** @param {import("NetscriptDefinitions").NS } ns */
export async function main(ns) {
    const {
        connectPathsFromHome
    } = await getServers(ns)
    for (let [hostname, {
            path
        }] of Object.entries(connectPathsFromHome).filter(([hostname, {
            server
        }]) => !server.backdoorInstalled && ns.hasRootAccess(hostname) && !hostname.includes("pserv-"))) {

        if (!ns.getServer("home").isConnectedTo)
            ns.connect("home")
        path.forEach(ns.connect)
        ns.connect(hostname)
        await ns.installBackdoor()
    }

    if (!ns.getServer("home").isConnectedTo) {
        ns.connect("home")
    }
}