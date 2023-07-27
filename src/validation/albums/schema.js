const Joi = require("joi");
const helpers = require("../../helpers");

const AlbumPayloadSchema = Joi.object({
  name: Joi.string().required().messages({
    "string.base": "Name harus bertipe string",
    "string.empty": "Name tidak boleh kosong",
    "any.required": "kolom Name harus diisi",
  }),
  year: Joi.number()
    .min(1900)
    .max(helpers.getCurrentYear())
    .required()
    .messages({
      "number.base": "Year harus bertipe number",
      "number.min": "Year harus lebih besar atau sama dengan 1900",
      "number.max": `Year harus lebih kecil atau sama dengan ${helpers.getCurrentYear()}`,
      "number.empty": "Year tidak boleh kosong",
      "any.required": "kolom Year harus diisi",
    }),
});

module.exports = { AlbumPayloadSchema };
