"use strict";

let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA;
}

module.exports = {
  async up(queryInterface, Sequelize) {
    options.tableName = "SpotImages";
    await queryInterface.bulkInsert(options, [
      {
        spotId: 1,
        url: "https://res.cloudinary.com/g5-assets-cld/image/upload/x_42,y_0,h_1304,w_2086,c_crop/q_auto,f_auto,fl_lossy,g_center,h_750,w_1200/g5/g5-c-5k2301wsk-eci-group/g5-cl-1n0t0ytxyc-eci-group-davenport-fl/uploads/Exterior7_s3fafj.jpg",
        preview: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        spotId: 1,
        url: "https://example.com/images/spot1_image2.jpg",
        preview: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        spotId: 2,
        url: "https://media.istockphoto.com/id/471826199/photo/french-brittany-typical-house.jpg?s=2048x2048&w=is&k=20&c=Wl1ivn5jB1rg5R-j8UsDKxGQtqXDqulXy4EI6KJ874A=",
        preview: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        spotId: 2,
        url: "https://lifeonshadylane.com/wp-content/uploads/2017/04/7f5af549fc6a2a630cf6367256319a7d.jpg",
        preview: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        spotId: 3,
        url: "https://res.cloudinary.com/g5-assets-cld/image/upload/x_42,y_0,h_1304,w_2086,c_crop/q_auto,f_auto,fl_lossy,g_center,h_750,w_1200/g5/g5-c-5k2301wsk-eci-group/g5-cl-1n0t0ytxyc-eci-group-davenport-fl/uploads/Exterior7_s3fafj.jpg",
        preview: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        spotId: 4,
        url: "https://lifeonshadylane.com/wp-content/uploads/2017/04/7f5af549fc6a2a630cf6367256319a7d.jpg",
        preview: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        spotId: 5,
        url: "https://blog.savills.com/_images/spinney-cottage-1.jpg",
        preview: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    options.tableName = "SpotImages";
    await queryInterface.bulkDelete(options, null, {});

    if (options.schema) {
      await queryInterface.sequelize.query(
        `ALTER SEQUENCE "${options.schema}"."SpotImages_id_seq" RESTART WITH 1;`
      );
    } else {
      const dbType = queryInterface.sequelize.getDialect();

      if (dbType === "sqlite") {
        await queryInterface.sequelize.query(
          `UPDATE sqlite_sequence SET seq = 0 WHERE name = 'SpotImages';`
        );
      } else if (dbType === "mysql") {
        await queryInterface.sequelize.query(
          `ALTER TABLE SpotImages AUTO_INCREMENT = 1;`
        );
      } else if (dbType === "postgres") {
        await queryInterface.sequelize.query(
          `ALTER SEQUENCE "SpotImages_id_seq" RESTART WITH 1;`
        );
      }
    }
  },
};
