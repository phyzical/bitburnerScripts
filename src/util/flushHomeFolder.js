/** @param {import("index").NS } ns */
export async function main(ns) {
    var arr = ls(getHostname(), "script");
    for (var i in arr) {
        if (rm(arr[i]))
            tprint("successfully deleted " + arr[i]);
        else
            tprint("failed to delete " + arr[i]);
    }
}