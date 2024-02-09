import { apiHandler, usersRepo } from "helpers/api";

export default apiHandler({
  post: verifyNewFactor,
});

async function verifyNewFactor(req, res) {
  const response = await usersRepo.verifyNewFactor(req.body);
  return res.status(200).json(response);
}
