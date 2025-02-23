const wsRCO = require("./wsRCO");
const { RcoFormation } = require("../../../common/model/index");
const { diff } = require("deep-object-diff");
const { asyncForEach } = require("../../../common/utils/asyncUtils");
const report = require("../../../logic/reporter/report");
const config = require("config");
const { paginator } = require("../../common/utils/paginator");
const { storeByChunks } = require("../../common/utils/reportUtils");

class Importer {
  constructor() {
    this.added = [];
    this.updated = [];
    this.formationsToAddToDb = [];
    this.formationsToUpdateToDb = [];
  }

  async run() {
    const formations = await wsRCO.getRCOcatalogue();
    const dbCount = await RcoFormation.countDocuments({ published: true });

    console.log("Nb formations J : ", formations.length);
    console.log("Nb formations published in DB : ", dbCount);

    await this.start(formations);
  }

  async start(formations) {
    try {
      const collection = await this.lookupDiff(formations);

      if (!collection) {
        await this.report(formations.length);
        return null;
      }

      const addedFormations = await this.addedFormationsHandler(collection.added);
      this.addtoDbTasks(addedFormations);

      const updatedFormations = await this.updatedFormationsHandler(collection.updated);
      this.addtoDbTasks(updatedFormations);

      // Desactiver la formations
      const deletedFormations = await this.deletedFormationsHandler(collection.deleted);
      this.addtoDbTasks(deletedFormations);

      await this.dbOperationsHandler();

      await this.report(formations.length);
    } catch (error) {
      console.log(error);
    }
  }

  async report(formationsJCount) {
    this.updated.forEach((element) => {
      const { updates, updateInfo } = this.formationsToUpdateToDb.find((u) => u.rcoFormation._id === element.mnaId);

      if (updates && updates.periode) {
        updates.periode = Object.values(updates.periode).map((dateStr) => {
          const formattedDate = new Date(dateStr).toLocaleString("fr-FR", { month: "long", year: "numeric" });
          return formattedDate === "Invalid Date" ? dateStr : formattedDate;
        });
      }

      element.updates = JSON.stringify(updates);

      if (updateInfo.published === true) {
        element.published = "Re-ouverte";
      } else if (updateInfo.published === false) {
        element.published = "Supprimée";
      }

      // const rcoFormation = await RcoFormations.findById(element.mnaId);
      // const updates_history = rcoFormation.updates_history[rcoFormation.updates_history.length - 1];
      // element.from = JSON.stringify(updates_history.from);
      // element.to = JSON.stringify(updates_history.to);
    });

    const deleted = this.updated.filter(({ published }) => published === "Supprimée");
    const justUpdated = this.updated.filter(({ published }) => published !== "Supprimée");

    const deletedCount = deleted.length;
    const publishedCount = await RcoFormation.countDocuments({ published: true });
    const deactivatedCount = await RcoFormation.countDocuments({ published: false });

    const summary = {
      formationsJCount,
      addedCount: this.added.length,
      updatedCount: this.updated.length - deletedCount,
      deletedCount,
      publishedCount,
      deactivatedCount,
    };

    // save report in db
    const date = Date.now();
    const type = "rcoImport";

    await storeByChunks(type, date, summary, "added", this.added);
    await storeByChunks(type, date, summary, "updated", justUpdated);
    await storeByChunks(type, date, summary, "deleted", deleted);

    const link = `${config.publicUrl}/report?type=${type}&date=${date}`;
    const data = { added: this.added, updated: this.updated, summary, link };
    const title = "[Webservice RCO] Rapport d'importation";
    const to = config.rco.reportMailingList.split(",");
    await report.generate(data, title, to, "rcoReport");
  }

  /*
   * Reset report
   */
  resetReport() {
    this.formationsToAddToDb = [];
    this.formationsToUpdateToDb = [];
    this.added = [];
    this.updated = [];
  }

  /*
   * Handler db operations
   */
  async dbOperationsHandler() {
    await asyncForEach(this.formationsToAddToDb, async (formationToAddToDb) => {
      await this.addRCOFormation(formationToAddToDb);
    });
    await asyncForEach(this.formationsToUpdateToDb, async (formationToUpdateToDb) => {
      await this.updateRCOFormation(formationToUpdateToDb.rcoFormation, formationToUpdateToDb.updateInfo);
    });
  }

  /*
   * Add db tasks
   */
  addtoDbTasks(resultFormations) {
    this.formationsToAddToDb = [...this.formationsToAddToDb, ...resultFormations.toAddToDb];
    this.formationsToUpdateToDb = [...this.formationsToUpdateToDb, ...resultFormations.toUpdateToDb];
  }

  /*
   * Handler added formation
   */
  async addedFormationsHandler(added) {
    const toAddToDb = [];
    const toUpdateToDb = [];

    if (!added) {
      return {
        toAddToDb,
        toUpdateToDb,
      };
    }

    await asyncForEach(added, async (rcoFormationAdded) => {
      const rcoFormation = await this.getRcoFormation(rcoFormationAdded);

      // The formation does not already exist
      if (!rcoFormation) {
        toAddToDb.push(rcoFormationAdded);
      } else if (!rcoFormation.published) {
        // Réactiver la formation
        let updateInfo = {
          published: true,
        };
        // Compare old with new one
        const { updates, keys } = this.diffRcoFormation(rcoFormation, rcoFormationAdded);
        if (updates) {
          // prepare update
          for (let ite = 0; ite < keys.length; ite++) {
            const key = keys[ite];
            updateInfo[key] = rcoFormationAdded[key];
          }
        }
        toUpdateToDb.push({ rcoFormation, updateInfo, updates });
      } else {
        console.error(
          `addedFormationsHandler >> Formation ${this._buildId(rcoFormationAdded)} existe et est publiée ${
            rcoFormation._id
          }`
        );
      }
    });

    return {
      toAddToDb,
      toUpdateToDb,
    };
  }

  /*
   * Handler updated formation
   */
  async updatedFormationsHandler(updated) {
    const toUpdateToDb = [];

    if (!updated) {
      return {
        toAddToDb: [],
        toUpdateToDb,
      };
    }

    await asyncForEach(updated, async (rcoFormationUpdated) => {
      const rcoFormation = await this.getRcoFormation(rcoFormationUpdated);

      // The formation does exist
      if (rcoFormation) {
        let updateInfo = {};
        // Compare old with new one
        const { updates, keys } = this.diffRcoFormation(rcoFormation, rcoFormationUpdated);
        if (updates) {
          // prepare update
          for (let ite = 0; ite < keys.length; ite++) {
            const key = keys[ite];
            updateInfo[key] = rcoFormationUpdated[key];
          }
          toUpdateToDb.push({ rcoFormation, updateInfo, updates });
        }
      } else {
        console.error(
          `updatedFormationsHandler >> Formation ${this._buildId(rcoFormationUpdated)} n'existe pas en base`
        );
      }
    });

    return {
      toAddToDb: [],
      toUpdateToDb,
    };
  }

  /*
   * Handler deleted formation
   */
  async deletedFormationsHandler(deleted) {
    const toUpdateToDb = [];

    if (!deleted) {
      return {
        toAddToDb: [],
        toUpdateToDb,
      };
    }
    await asyncForEach(deleted, async (rcoFormation) => {
      let updateInfo = {
        published: false,
      };
      toUpdateToDb.push({ rcoFormation, updateInfo, updates: null });
    });

    return {
      toAddToDb: [],
      toUpdateToDb,
    };
  }

  /*
   * Comparing collections to find diff
   */
  async lookupDiff(currentFormations) {
    const added = [];
    const updated = [];
    const deleted = [];

    for (let ite = 0; ite < currentFormations.length; ite++) {
      const formation = currentFormations[ite];
      const found = await RcoFormation.findOne({
        id_formation: formation.id_formation,
        id_action: formation.id_action,
        id_certifinfo: formation.id_certifinfo,
        published: true,
      }).lean();

      // Some formations has been added
      if (!found) {
        added.push(formation);
      } else {
        const { keys } = this.diffRcoFormation(found, formation);
        // Some formations has been updated
        if (keys.length !== 0) {
          updated.push(formation);
        }
      }
    }

    // check if Some formations has been deleted
    await paginator(
      RcoFormation,
      { filter: { published: true }, lean: true, showProgress: false },
      async (pastFormation) => {
        const id = this._buildId(pastFormation);
        const found = currentFormations.some((f) => id === this._buildId(f));
        if (!found) {
          deleted.push(pastFormation);
        }
      }
    );

    // No modifications
    if (added.length === 0 && updated.length === 0 && deleted.length === 0) {
      return null;
    }

    return {
      added,
      updated,
      deleted,
    };
  }

  /*
   * Build uniq identifier per rco formation
   */
  _buildId(formation) {
    return `${formation.id_formation} ${formation.id_action} ${formation.id_certifinfo}`;
  }

  /*
   * get RCO Formation
   */
  async getRcoFormation({ id_formation, id_action, id_certifinfo }) {
    return await RcoFormation.findOne({ id_formation, id_action, id_certifinfo }).lean();
  }

  /*
   * Add to db RCO Formation
   */
  async addRCOFormation(rcoFormation) {
    const { id_formation, id_action, id_certifinfo } = rcoFormation;
    const newRcoFormation = await RcoFormation.findOneAndUpdate(
      { id_formation, id_action, id_certifinfo },
      { ...rcoFormation, converted_to_mna: false, conversion_error: null },
      {
        new: true,
        upsert: true,
        overwrite: true,
      }
    );
    const id = this._buildId(newRcoFormation);
    const added = { mnaId: newRcoFormation._id, rcoId: id };
    this.added.push(added);
    return added;
  }

  /*
   * Update to db RCO Formation
   */
  async updateRCOFormation(rcoFormation, updateInfo) {
    const updates_history = this.buildUpdatesHistory(rcoFormation, updateInfo);
    await RcoFormation.findOneAndUpdate(
      { _id: rcoFormation._id },
      {
        ...rcoFormation,
        ...updateInfo,
        updates_history,
        last_update_at: Date.now(),
        converted_to_mna: false,
        conversion_error: null,
      },
      { new: true }
    );
    const id = this._buildId(rcoFormation);
    const updated = { mnaId: rcoFormation._id, rcoId: id };
    this.updated.push(updated);
    return updated;
  }

  /*
   * Build updates history
   */
  buildUpdatesHistory(rcoFormation, updateInfo) {
    const from = Object.keys(updateInfo).reduce((acc, key) => {
      acc[key] = rcoFormation[key];
      return acc;
    }, {});
    return [...rcoFormation.updates_history, { from, to: { ...updateInfo }, updated_at: Date.now() }];
  }

  /*
   * diff RCO Formation
   */
  diffRcoFormation(rcoFormationP, formation) {
    /* eslint-disable no-unused-vars */
    const {
      _id,
      __v,
      updates_history,
      published,
      created_at,
      last_update_at,
      converted_to_mna,
      conversion_error,
      ...rcoFormation
    } = rcoFormationP;
    const compare = diff(rcoFormation, formation);
    const keys = Object.keys(compare);

    if (keys.length === 0) {
      return { updates: null, keys: [] };
    }

    return { updates: compare, keys };
  }
}

const importer = new Importer();
module.exports = importer;
