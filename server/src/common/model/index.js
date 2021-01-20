const mongoose = require("mongoose");
const { mongooseInstance } = require("../mongodb");
const { mongoosastic, getElasticInstance } = require("../esClient");
const {
  sampleSchema,
  userSchema,
  rcoFormationSchema,
  mnaFormationSchema,
  psFormationSchema,
  reportSchema,
  psReconciliationSchema,
  afFormationSchema,
} = require("../model/schema");

const getMongoostaticModel = (modelName, schema, instanceMongoose = mongooseInstance) => {
  const Schema = new instanceMongoose.Schema(schema);
  Schema.plugin(mongoosastic, { esClient: getElasticInstance(), index: modelName });
  Schema.plugin(require("mongoose-paginate"));
  return mongooseInstance.model(modelName, Schema);
};

const getMongooseModel = (modelName, callback = () => ({})) => {
  const modelSchema = new mongoose.Schema(require(`./schema/${modelName}`));
  callback(modelSchema);
  return mongoose.model(modelName, modelSchema, modelName);
};

const getModel = (modelName, schema, instanceMongoose = mongooseInstance) => {
  if (instanceMongoose) return getMongoostaticModel(modelName, schema);
  return getMongooseModel(modelName);
};

let s = null;
if (!s) {
  s = getModel("sample", sampleSchema);
}

let u = null;
if (!u) {
  u = getModel("user", userSchema);
}

let rf = null;
if (!rf) {
  rf = getModel("rcoformation", rcoFormationSchema);
}

let f = null;
if (!f) {
  f = getModel("mnaformation", mnaFormationSchema);
}

let pf = null;
if (!pf) {
  pf = getModel("psformation", psFormationSchema);
}

let cf = null;
if (!cf) {
  cf = getModel("convertedformation", mnaFormationSchema);
}

let r = null;
if (!r) {
  r = getModel("report", reportSchema);
}

let prf = null;
if (!prf) {
  prf = getModel("pendingrcoformation", mnaFormationSchema);
}

let l = null;
if (!l) {
  l = getMongooseModel("log");
}

let psr = null;
if (!psr) {
  psr = getModel("psreconciliation", psReconciliationSchema);
}

let af = null;
if (!af) {
  af = getModel("afformation", afFormationSchema);
}

module.exports = {
  Sample: s,
  User: u,
  RcoFormation: rf,
  MnaFormation: f,
  ConvertedFormation: cf,
  Report: r,
  Log: l,
  PsFormation: pf,
  PsReconciliation: psr,
  PendingRcoFormation: prf,
  AfFormation: af,
};
