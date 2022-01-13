require("dotenv").config();
const { Sequelize, DataTypes, Op } = require("sequelize");

const connection = new Sequelize(process.env.DB_URI);

const Card = connection.define(
  "Card",
  {
    name: {
      type: DataTypes.STRING,
      allownull: false,
    },
    description: {
      type: DataTypes.STRING,
      allownull: false,
    },
    worth: {
      type: DataTypes.INTEGER,
      allownull: false,
    },
  },
  {
    indexed: [{ unique: true, fields: ["name"] }],
  }
);

const main = async () => {
  try {
    await connection.authenticate();
    await Card.sync({ alter: true });

    // // create then save in 2 steps:
    // const sophia = Card.build({
    //   name: "Sophia Amarouso",
    //   worth: 280000000,
    //   description:
    //     "Sophia Amoruso​, a 32-year-old with a $280 million net worth, is the founder of one of “the fastest growing companies” (Inc. Magazine) fashion company named Nasty Gal, and the author of a New York Times Bestseller titled #GIRLBOSS.",
    // });

    // await sophia.save();

    // // create and save in 1 step:
    // await Card.create({
    //   name: "Arianna Huffington",
    //   worth: 100000000,
    //   description:
    //     "Arianna Stassinopoulos Huffington is a Greek-American author, syndicated columnist, and businesswoman. She is a co-founder of The Huffington Post, the founder and CEO of Thrive Global, and the author of fifteen books.",
    // });

    // // SELECT * FROM cards WHERE name = "Sophia";
    // for (let card of await Card.findAll({where: {name: "Sophia"}})) {
    //   console.log(`Card: ${card.name} -> ${card.description}`);
    // }

    // // SELECT * FROM cards WHERE name = "Sophia" OR worth = 280000000;
    // const results = await Card.findAll({
    //   attributes: ["name", "description"],
    //   where: {
    //     [Op.or]: [{ name: "Sophia" }, { worth: 280000000 }],
    //   },
    // });

    // for (let card of results) {
    //   console.log(`Card: ${card.name} -> ${card.description}`);
    // }

    // await Card.update(
    //   { name: "Arianna Stassinopoulos Huffington" },
    //   {
    //     where: {
    //       name: "Arianna Huffington",
    //     },
    //   }
    // );

    // deletes documents by name:
    await Card.destroy({
      where: {
        [Op.or]: [
          { name: "Sophia Amarouso" },
          { name: "Arianna Stassinopoulos Huffington" },
        ],
      },
    });

    // lists all the documents in the database:
    for (let card of await Card.findAll()) {
      console.log(`Card: ${card.name} -> ${card.description}`);
    }

    // DELETES all the documents in the database
    await Card.truncate();

    console.log("Connection has been successfully established.");
  } catch (error) {
    console.error("Unable to connect to the database.", error);
  }

  await connection.close();
  process.exit();
};

main();
