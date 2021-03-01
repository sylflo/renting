const faker = require('faker');

const createAmenities = () => {
  const amenities = [];

  for (let i = 0; i < 15; i++) {
    amenities.push({
      titleFr: faker.lorem.word(),
      descriptionFr: faker.lorem.sentence(),
      titleEn: faker.lorem.word(),
      descriptionEn: faker.lorem.sentence(),
    })
  }
  return amenities
}

exports.createAmenities = createAmenities;
