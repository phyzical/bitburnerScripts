import {
    getServers
} from "util/helpers.js"

/** @param {import("globals").NS } ns */
export async function main(ns) {
    let {
        servers
    } = await getServers(ns, true)

    for (var target of servers) {
        await openServers(ns, target)
        await copyFiles(ns, target)
    }

}


/** @param {import("globals").NS } ns */
async function copyFiles(ns, target) {
    let files = ns.ls(target.hostname, ".txt")
        .concat(ns.ls(target.hostname, ".lit"))
    if (files.length) {
        await ns.scp(files, target.hostname, "home")
    }
}

/** @param {import("globals").NS } ns */
async function openServers(ns, target) {
    if (ns.getHackingLevel() >= target.requiredHackingSkill) {
        await ns.scp(["/worm/hack.js"], target.hostname);
        ns.exec("worm/open.js", "home", 1, target.hostname);
    }
}