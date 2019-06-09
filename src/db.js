import Dexie from "dexie";
import { readable } from "svelte/store";
import images from "./_images";

const db = new Dexie("flashMe");

db.version(1).stores({
  directory: "++id, label",
  list: "++id, directory, label, &[directory+label]",
  card: "++id, list"
});

db.on("populate", async () => {
  let directory = await db.directory.add({ label: "Anglais" });
  let list1 = await db.list.add({ directory, label: "Weather" });
  let list2 = await db.list.add({ directory, label: "Vehicules" });
  await Promise.all([
    db.card.add({
      list: list1,
      notion: "Cloudy",
      explication: "Nuageux",
      image: images.cloudy
    }),
    db.card.add({
      list: list1,
      notion: "Sunny",
      explication: "Ensoleillé",
      image: images.sunny
    }),
    db.card.add({
      list: list1,
      notion: "Rainy",
      explication: "Pluvieux",
      image: images.rainy
    }),
    db.card.add({
      list: list2,
      notion: "Bus",
      explication: "Bus",
      image: images.bus
    }),
    db.card.add({
      list: list2,
      notion: "Car",
      explication: "Voiture",
      image: images.car
    }),
    db.card.add({
      list: list2,
      notion: "Bike",
      explication: "Vélo",
      image: images.bike
    })
  ]);
});

function updateListCardNumber(pk, obj, tx) {
  if (obj.list) {
    this.onsuccess = async () => {
      let nbCards = await db.card.where({ list: obj.list }).count();
      await db.list.update(obj.list, { nbCards });
    };
  }
}
db.card.hook("creating", updateListCardNumber);
db.card.hook("deleting", updateListCardNumber);

function makeStore(table) {
  return readable([], set => {
    function hook(pk, obj, tx) {
      this.onsuccess = () => db[table].toArray().then(set);
    }
    db[table].hook("creating", hook);
    db[table].hook("updating", hook);
    db[table].hook("deleting", hook);
    db[table].toArray().then(set);

    return () => {
      db[table].hook("creating").unsubscribe(hook);
      db[table].hook("updating").unsubscribe(hook);
      db[table].hook("deleting").unsubscribe(hook);
    };
  });
}

export default db;
export const cards = makeStore("card");
export const lists = makeStore("list");
export const directories = makeStore("directory");
