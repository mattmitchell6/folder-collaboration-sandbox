/**
 * Load all controllers
 */
const express = require('express');
const router = express.Router();

const BoxSdk = require('../service/box/boxSdk');
const BoxConfig = require('config').boxAppSettings;

// User A
const A_ID = '3857800618'

// User B
const B_ID = '3857836430'


/**
 * base route
 */
router.get('/', async function(req, res) {
  let clientA = BoxSdk.getAppAuthClient('user', A_ID);
  let clientB = BoxSdk.getAppAuthClient('user', B_ID);

  let tokens = await Promise.all([
    BoxSdk.getAppUserTokens(A_ID),
    BoxSdk.getAppUserTokens(B_ID),
    BoxSdk.getEnterpriseAppAuthTokens(BoxConfig.enterpriseID)]
  )

  res.render('pages/home', {
    tokenA: tokens[0].accessToken,
    tokenB: tokens[1].accessToken,
    saToken: tokens[2].accessToken,
    users: {
      A: {
        id: A_ID,
        name: "User A"
      },
      B: {
        id: B_ID,
        name: "User B"
      }
    }
  });
});

router.post("/create-collaboration", async function(req, res) {
  let client = BoxSdk.getAppAuthClient('enterprise', BoxConfig.enterpriseID);

  await client.collaborations.createWithUserID(
    req.body.userId,
    req.body.folderId,
    client.collaborationRoles.EDITOR);

  res.redirect('/')
})

router.get('/create-users', async function(req, res) {
  let client = BoxSdk.getAppAuthClient('enterprise', BoxConfig.enterpriseID);

  let userA = await client.enterprise.addAppUser('User A', null)
  console.log(userA);

  let userB = await client.enterprise.addAppUser('User B', null)
  console.log(userB);
});

module.exports = router;
