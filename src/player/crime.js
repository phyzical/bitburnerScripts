import {
    log
} from "util/helpers"

/** @param {import("NetscriptDefinitions").NS } ns */
export async function main(ns) {
    await log(ns, "crime-log.txt", `${ns.heart.break()}/${-54000}`)
    if (!ns.gang.inGang() && ns.heart.break() >= -54000) {
        ns.commitCrime("homicide", false)
    }
}