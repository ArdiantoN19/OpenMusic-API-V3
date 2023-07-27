exports.up = (pgm) => {
  pgm.createTable("songs", {
    id: {
      type: "VARCHAR(21)",
      primaryKey: true,
    },
    title: {
      type: "VARCHAR(255)",
      notNull: true,
    },
    year: {
      type: "INTEGER",
      notNull: true,
    },
    genre: {
      type: "VARCHAR(255)",
      notNull: true,
    },
    performer: {
      type: "VARCHAR(255)",
      notNull: true,
    },
    duration: {
      type: "INTEGER",
    },
    album_id: {
      type: "VARCHAR(22)",
      references: '"albums"',
      onDelete: "cascade",
      onUpdate: "cascade",
    },
    created_at: {
      type: "TEXT",
      notNull: true,
    },
    updated_at: {
      type: "TEXT",
      notNull: true,
    },
  });
  pgm.createIndex("songs", "album_id");
};

exports.down = (pgm) => {
  pgm.dropTable("songs");
};
