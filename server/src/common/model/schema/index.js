const logSchema = require("./log");
const sampleSchema = require("./sample");
const userSchema = require("./user");
const rcoFormationSchema = require("./rcoFormation");
const mnaFormationSchema = require("./mnaFormation/mnaFormation");
const psFormationSchema = require("./psFormation");
const reportSchema = require("./report");
const rcoEtablissementSchema = require("./rcoEtablissement");

module.exports = {
  sampleSchema,
  logSchema,
  userSchema,
  rcoFormationSchema,
  mnaFormationSchema,
  psFormationSchema,
  reportSchema,
  rcoEtablissementSchema,
};
