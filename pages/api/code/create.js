import { apiHandler, usersRepo } from "helpers/api";

export default apiHandler({
  post: createFactor,
});

async function createFactor(req, res) {
    console.log(req.body);
  const response = await usersRepo.createFactor(req.body);
  return res.status(200).json(response);
}
