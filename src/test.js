import {
    getServers
} from "util/helpers";

/** @param {import("NetscriptDefinitions").NS } ns */
export async function main(ns) {
    await getServers(ns)
}