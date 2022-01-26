/** @param {import("NetscriptDefinitions").NS } ns */
export async function main(ns) {
    var arr = ns.ls(ns.getHostname());
    arr = arr.filter(x => !x.includes(".exe"))
    for (var i in arr) {
        ns.rm(arr[i])
    }
}