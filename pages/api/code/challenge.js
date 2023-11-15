import { apiHandler, usersRepo } from "helpers/api";

export default apiHandler({
  post: createChallenge,
});

async function createChallenge(req, res) {
  const response = await usersRepo.createChallenge(req.body);
  return res.status(200).json(response);
}
