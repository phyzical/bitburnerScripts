/** @param {import("index").NS } ns */
export async function main(ns) {
    var target = ns.args[0];

    if (ns.fileExists("brutessh.exe")) {
        ns.brutessh(target);
    }

    if (ns.fileExists("ftpcrack.exe")) {
        ns.ftpcrack(target);
    }

    if (ns.fileExists("httpworm.exe")) {
        ns.httpworm(target);
    }

    if (ns.fileExists("relaysmtp.exe")) {
        ns.relaysmtp(target);
    }

    if (ns.fileExists("sqlinject.exe")) {
        ns.sqlinject(target);
    }

    if (!ns.hasRootAccess(target)) {
        ns.nuke(target);
    }
    // await ns.installBackdoor()
    if (target != "home") {
        ns.killall(target)
    }
}