import {
    getEquipment,
} from 'util/helpers.js'

/** @param {import("NetscriptDefinitions").NS } ns */
export async function main(ns) {
    let allItems = await getEquipment(ns)
    for (let {
            name: member,
            info
        } of members) {

        let currentItems = info.upgrades.concat(info.augmentations).map(x => ({
            name: x,
            type: ns.gang.getEquipmentType(x)
        }))

        for (let type in allItems) {
            let items = allItems[type]
            let currentItem = currentItems.find(x => x.type == type)
            let buyItem = items[0]
            if (currentItem) {
                buyItem = items[items.findIndex(x => x.name == currentItem.name) + 1]
            }
            if (buyItem && ns.getPlayer().money > buyItem.cost) {
                ns.gang.purchaseEquipment(member, buyItem.name)
            }
        }
    }
}