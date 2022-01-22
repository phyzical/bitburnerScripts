import {
    getServers
} from "util/helpers";

/** @param {import("globals").NS } ns */
export async function main(ns) {
    const {
        servers
    } = await getServers(ns)
    for (let server of servers.filter(x => !x.backdoorInstalled && !x.hostname.includes("pserv-"))) {
        ns.connect(server.hostname)
        await ns.installBackdoor()
    }
    ns.connect("home")
}