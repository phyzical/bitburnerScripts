/** @param {import("NetscriptDefinitions").NS } ns */
export async function main(ns) {
    if (ns.readPort(1) == "false") {
        let members = ns.gang
            .getMemberNames()
            .map(x => ({
                name: x,
                info: ns.gang.getMemberInformation(x)
            }))
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
}


/** @param {import("NetscriptDefinitions").NS } ns */
async function getEquipment(ns) {
    return ns.gang.getEquipmentNames().reduce((acc, item) => {
        let type = ns.gang.getEquipmentType(item)
        acc[type] = [{
            name: item,
            cost: ns.gang.getEquipmentCost(item),
            stats: ns.gang.getEquipmentStats(item)
        }].concat(acc[type] || []).sort((a, b) => a.cost - b.cost)
        return acc
    }, {})
}