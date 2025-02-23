const express = require("express");
const tryCatch = require("../middlewares/tryCatchMiddleware");

module.exports = ({ users }) => {
  const router = express.Router(); // eslint-disable-line new-cap

  /**
   * @swagger
   *
   * /auth:
   *   post:
   *     summary: Authentification
   *     tags:
   *       - Authentification
   *     description: >
   *       Cette api vous permet d'authentifier l'utilisateur<br/><br />
   *       Vous devez posséder des credentials. Veuillez contacter catalogue@apprentissage.beta.gouv.fr pour en obtenir<br /><br />
   *     requestBody:
   *       description: L'objet JSON **doit** contenir les clés **username** et **password**.
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - username
   *               - password
   *             properties:
   *               username:
   *                 type: string
   *                 example: "foo"
   *               password:
   *                 type: string
   *                 example: "bar"
   *     responses:
   *       200:
   *         description: OK
   *         content:
   *            application/json:
   *              schema:
   *                type: object
   *                properties:
   *                  user:
   *                    type: object
   */
  router.post(
    "/login",
    tryCatch(async (req, res) => {
      const { username, password } = req.body;
      const user = await users.authenticate(username, password);

      if (!user) return res.status(401).json({ message: "Utilisateur non trouvé" });

      const payload = users.structureUser(user);

      req.logIn(payload, () => res.json(payload));
    })
  );

  router.get(
    "/logout",
    tryCatch((req, res) => {
      req.logOut();
      req.session.destroy();
      return res.json({ loggedOut: true });
    })
  );

  router.get(
    "/current-session",
    tryCatch((req, res) => {
      if (req.user) {
        let { user } = req.session.passport;
        return res.json(user);
      }
      return res.end();
    })
  );

  return router;
};
