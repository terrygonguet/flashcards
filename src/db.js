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

export default db
export const cards = makeStore("card")
export const lists = makeStore("list")
export const directories = makeStore("directory")
