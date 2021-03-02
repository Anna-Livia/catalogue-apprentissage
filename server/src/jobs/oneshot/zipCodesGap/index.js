const logger = require("../../../common/logger");
const { runScript } = require("../../scriptWrapper");
const { RcoFormation, ConvertedFormation } = require("../../../common/model");
const config = require("config");
const path = require("path");
const { asyncForEach } = require("../../../common/utils/asyncUtils");
const { DateTime } = require("luxon");

runScript(async ({ mailer }) => {
  logger.info(`Start zip codes gap search`);

  const to = config.rco.reportMailingList.split(",");

  const formations = await RcoFormation.find(
    { converted_to_mna: true },
    {
      id_formation: 1,
      id_action: 1,
      id_certifinfo: 1,
      etablissement_lieu_formation_code_postal: 1,
    }
  );

  const projection = { _id: 1, id_rco_formation: 1, code_commune_insee: 1, code_postal: 1 };
  const lines = [];

  const computedHeaders = Object.keys(projection);

  await asyncForEach(formations, async (formation) => {
    const converted = await ConvertedFormation.findOne(
      {
        id_rco_formation: `${formation.id_formation}|${formation.id_action}|${formation.id_certifinfo}`,
      },
      projection
    );

    if (converted) {
      const dept = `${formation.etablissement_lieu_formation_code_postal}`.substring(0, 2);
      if (!converted.code_commune_insee?.startsWith(dept) && !converted.code_postal?.startsWith(dept)) {
        const row = computedHeaders.map((header) => {
          return converted[header];
        });

        row.push(formation.etablissement_lieu_formation_code_postal);
        const actualRow = row.join(";");
        lines.push(actualRow);
      }
    }
  });

  computedHeaders.push("original code postal");
  const data = [computedHeaders.join(";"), ...lines].join("\n");

  const date = DateTime.local().setLocale("fr").toFormat("yyyy-MM-dd");
  const attachments = [{ filename: `zip-codes-gap-${date}.csv`, content: data, contentType: "text/csv" }];

  await mailer.sendEmail(
    to,
    `[${config.env} Catalogue apprentissage] Zip codes gap export`,
    path.join(__dirname, "../../../assets/templates/zip-codes-gap-export.mjml.ejs"),
    {
      nbFormations: lines.length,
    },
    attachments
  );

  logger.info(`End zip codes gap search`);
});
