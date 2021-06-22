const express = require("express");
const router = express.Router();
const Index = require("../controller/index");
//add New Contact

router.post("", async (req, res) => {
  try {
    let payload = {
      fname: req.body.fname,
      lname: req.body.lname,
      email: req.body.email,
      password: req.body.password,
      cnf_password: req.body.cnf_password
    };
    const response = await Index.addRegister(payload);
    return res.status(response.code).send(response);
  } catch (e) {
    return res.send(e);
  }
});
//LoginFunc
router.post("/login", async (req, res) => {
  try {
    let payload = {
      email: req.body.email,
      password: req.body.password,
    };
    const response = await Index.LoginFunc(payload);
    return res.status(response.code).send(response);
  } catch (e) {
    return res.send(e);
  }
});

//Update  contact
router.put("", async (req, res) => {
  try {
    let payload = {
      id: req.body.id,
      name: req.body.name,
      email: req.body.email,
      contact: req.body.contact,
    };
    const response = await Index.updateContact(payload);
    return res.status(response.code).send(response);
  } catch (e) {
    return res.send(e);
  }
});

//for Pagianation By Skip and Limit
router.get("", async (req, res) => {
    try {
      let payload = {
        skip: req.query.skip,
        limit: req.query.limit
      };
      const response = await Index.getRegisterUser(payload);
      return res.status(response.code).send(response);
    } catch (e) {
      return res.send(e);
    }
});



module.exports = router;
