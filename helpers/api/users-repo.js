import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { db } from "helpers/api";
import twilio from "twilio";

const User = db.User;

const client = twilio(process.env.accountSid, process.env.authToken);

export const usersRepo = {
  authenticate,
  getAll,
  getById,
  create,
  update,
  delete: _delete,
  createFactor,
  verifyNewFactor,
  createChallenge,
};

async function authenticate({ username, password }) {
  const user = await User.findOne({ username });

  if (!(user && bcrypt.compareSync(password, user.hash))) {
    throw "Username or password is incorrect";
  }

  // create a jwt token that is valid for 7 days
  const token = jwt.sign({ sub: user.id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  return {
    ...user.toJSON(),
    token,
  };
}

async function getAll() {
  return await User.find();
}

async function getById(id) {
  return await User.findById(id);
}

async function create(params) {
  // validate
  if (await User.findOne({ username: params.username })) {
    throw 'Username "' + params.username + '" is already taken';
  }

  const user = new User(params);

  // hash password
  if (params.password) {
    user.hash = bcrypt.hashSync(params.password, 10);
  }

  // save user
  await user.save();
}

async function update(id, params) {
  const user = await User.findById(id);

  // validate
  if (!user) throw "User not found";
  if (
    user.username !== params.username &&
    (await User.findOne({ username: params.username }))
  ) {
    throw 'Username "' + params.username + '" is already taken';
  }

  // hash password if it was entered
  if (params.password) {
    params.hash = bcrypt.hashSync(params.password, 10);
  }

  // copy params properties to user
  Object.assign(user, params);

  await user.save();
}

async function _delete(id) {
  await User.findByIdAndRemove(id);
}

async function createFactor({ name, identity }) {
  const user = await User.findById(identity);

  return await client.verify.v2
    .services("VA94aaa68087576330fe194b83d5ffc29e")
    .entities(identity)
    .newFactors.create({
      friendlyName: `${name}'s TOTP`,
      factorType: "totp",
    })
    .then(async (new_factor) => {
      console.log(new_factor);
      // copy params properties to user
      Object.assign(user, {
        keys: new_factor.binding,
        factorSid: new_factor.sid,
      });
      await user.save();

      return new_factor;
    });
}

async function verifyNewFactor({ identity, factorSid, code }) {
  const user = await User.findById(identity);

  return await client.verify.v2
    .services("VA94aaa68087576330fe194b83d5ffc29e")
    .entities(identity)
    .factors(factorSid)
    .update({ authPayload: code })
    .then(async (factor) => {
      console.log(factor);
      // copy params properties to user
      Object.assign(user, {
        authenticate: true,
      });
      await user.save();

      return factor;
    });
}

async function createChallenge({ identity, factorSid, code }) {
  await client.verify.v2
    .services("VA94aaa68087576330fe194b83d5ffc29e")
    .entities(identity)
    .challenges.create({
      authPayload: code,
      factorSid: factorSid,
    })
    .then((challenge) => console.log(challenge.status));
}
