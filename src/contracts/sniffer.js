import {
    getServers
} from "helpers.js"

/** @param {import("index").NS } ns */
export async function main(ns) {
    ns.ls("home", "contract-").map(x => ns.rm(x))
    let {
        servers
    } = await getServers(ns, true)
    for (var target of servers) {
        let contracts = ns.ls(target.hostname).filter(x => !x.includes(".txt") && !x.includes(".lit") && !x.includes(".js"))
        for (let contract of contracts) {
            let description = ns.codingcontract.getDescription(contract, target.hostname).replaceAll("&nbsp;", "")
            let data = ns.codingcontract.getData(contract, target.hostname)
            let type = ns.codingcontract.getContractType(contract, target.hostname)
            ns.clear(`/contracts/${contract.split(".")[0]}.txt`)
            await ns.write(`/contracts/${contract.split(".")[0]}.txt`, `${target.hostname}?!\n${type}?!\n${description}?!\n${data}?!\n`)
        }
    }
}