const Joi = require("joi");
const helpers = require("../../helpers");

const SongPayloadSchema = Joi.object({
  title: Joi.string().required().messages({
    "string.base": "Title harus bertipe string",
    "string.empty": "Title tidak boleh kosong",
    "any.required": "kolom Title harus diisi",
  }),
  year: Joi.number()
    .min(1900)
    .max(helpers.getCurrentYear())
    .required()
    .messages({
      "number.base": "Year harus bertipe number",
      "number.empty": "Year tidak boleh kosong",
      "number.min": "Year harus lebih besar atau sama dengan 1900",
      "number.max": `Year harus lebih kecil atau sama dengan ${helpers.getCurrentYear()}`,
      "any.required": "kolom Title harus diisi",
    }),
  genre: Joi.string().required().messages({
    "string.base": "Genre harus bertipe string",
    "string.empty": "Genre tidak boleh kosong",
    "any.required": "kolom Genre harus diisi",
  }),
  performer: Joi.string().required().messages({
    "string.base": "Performer harus bertipe string",
    "string.empty": "Performer tidak boleh kosong",
    "any.required": "kolom Performer harus diisi",
  }),
  duration: Joi.number().allow(null).messages({
    "number.base": "Duration harus bertipe number",
  }),
  albumId: Joi.string().allow(null, "").messages({
    "string.base": "AlbumId harus bertipe string",
  }),
});

module.exports = { SongPayloadSchema };
