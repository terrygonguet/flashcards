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
      image: images.cloudy,
    }),
    db.card.add({
      list: list1,
      notion: "Sunny",
      explication: "Ensoleillé",
      image: images.sunny,
    }),
    db.card.add({
      list: list1,
      notion: "Rainy",
      explication: "Pluvieux",
      image: images.rainy,
    }),
    db.card.add({
      list: list2,
      notion: "Bus",
      explication: "Bus",
      image: images.bus,
    }),
    db.card.add({
      list: list2,
      notion: "Car",
      explication: "Voiture",
      image: images.car,
    }),
    db.card.add({
      list: list2,
      notion: "Bike",
      explication: "Vélo",
      image: images.bike,
    }),
  ])
}
