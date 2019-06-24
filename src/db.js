import Dexie from "dexie"
import { readable } from "svelte/store"

const db = new Dexie("flashMe")

db.version(1).stores({
  directory: "++id, label",
  list: "++id, directory, label, &[directory+label]",
  card: "++id, list",
})

// only import example data the first time cause it's expensive
db.on("ready", async () => {
  let count = await db.directory.count()
  if (count) return

  import("./populate")
    .then(m => m.default())
    .catch(console.error)
})

function makeStore(table) {
  return readable([], set => {
    function hook(pk, obj, tx) {
      this.onsuccess = () => db[table].toArray().then(set)
    }
    db[table].hook("creating", hook)
    db[table].hook("updating", hook)
    db[table].hook("deleting", hook)
    db[table].toArray().then(set)

    return () => {
      db[table].hook("creating").unsubscribe(hook)
      db[table].hook("updating").unsubscribe(hook)
      db[table].hook("deleting").unsubscribe(hook)
    }
  })
}

export async function addFromTree(tree) {
  await db.transaction("rw", db.directory, db.list, db.card, async () => {
    let directory = await db.directory.add({
      label: tree.label,
      share: tree.share,
      owner: false,
    })
    for (const l of tree.lists) {
      let list = await db.list.add({ directory, label: l.label })
      await Promise.all(l.cards.map(c => db.card.add({ ...c, list })))
    }
  })
}

export async function clearDirectory(dir, { removeCards = false } = {}) {
  await db.transaction("rw", db.directory, db.list, db.card, async () => {
    let listColl = db.list.where({ directory: dir.id })
    if (removeCards) {
      let listArr = await listColl.toArray()
      await db.card
        .where("list")
        .anyOf(listArr.map(l => l.id))
        .delete()
    }
    await listColl.delete()
    await db.directory.delete(dir.id)
  })
}

export default db
export const cards = makeStore("card")
export const lists = makeStore("list")
export const directories = makeStore("directory")
