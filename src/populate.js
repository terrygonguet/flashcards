import db from "./db"
import images from "./_images"

export default async function() {
  let directory = await db.directory.add({ label: "Anglais" })
  let list1 = await db.list.add({ directory, label: "Weather" })
  let list2 = await db.list.add({ directory, label: "Vehicules" })

  await Promise.all([
    db.card.add({
      list: list1,
      notion: "Cloudy",
      explication: "Nuageux",
      level: 1,
      image: images.cloudy,
    }),
    db.card.add({
      list: list1,
      notion: "Sunny",
      explication: "Ensoleillé",
      level: 1,
      image: images.sunny,
    }),
    db.card.add({
      list: list1,
      notion: "Rainy",
      explication: "Pluvieux",
      level: 1,
      image: images.rainy,
    }),
    db.card.add({
      list: list2,
      notion: "Bus",
      explication: "Bus",
      level: 1,
      image: images.bus,
    }),
    db.card.add({
      list: list2,
      notion: "Car",
      explication: "Voiture",
      level: 1,
      image: images.car,
    }),
    db.card.add({
      list: list2,
      notion: "Bike",
      explication: "Vélo",
      level: 1,
      image: images.bike,
    }),
  ])
}
