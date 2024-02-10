import { apiHandler, usersRepo } from "helpers/api";

export default apiHandler({
  post: createFactor,
});

async function createFactor(req, res) {
  const response = await usersRepo.createFactor(req.body);
  // console.log("yipeeeeee", response);
  return res.status(200).json(response);
}
