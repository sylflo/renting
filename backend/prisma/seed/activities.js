const faker = require('faker');

const createActivites = (type) => {
  const activities = []

  for (let i = 0; i < 11; i++) {
    activities.push({
      titleFr: faker.lorem.word(),
      descriptionFr: faker.lorem.paragraph(),
      titleEn: faker.lorem.word(),
      descriptionEn: faker.lorem.paragraph(),
      image: faker.image.imageUrl(),
      type: type,
    })
  }

  return activities
}

exports.createActivites = createActivites;
