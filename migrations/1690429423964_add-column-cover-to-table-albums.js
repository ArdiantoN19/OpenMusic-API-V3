/* eslint-disable camelcase */

// exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.addColumn("albums", {
    cover: {
      type: "TEXT",
      default: null,
    },
  });
};

exports.down = (pgm) => {
  pgm.dropColumn("albums", "cover");
};
