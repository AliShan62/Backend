const express = require("express");
const router = express.Router();
const {
  createBranch,
  getBranchesByCompany,
  getSingleBranch,
  updateBranch,
  deleteBranch,
} = require("../controllers/BranchesController");

// Define child routes under the parent route `/api/v1/branches`
router.post("/create", createBranch); // POST to `/api/v1/branches/create` for creating a new branch
router.get("/", getBranchesByCompany); // GET to `/api/v1/branches/` for getting all branches
router.get("/:branchId", getSingleBranch); // GET to `/api/v1/branches/:branchId` for getting a single branch by ID
router.put("/:branchId", updateBranch); // PUT to `/api/v1/branches/:branchId` for updating a branch
router.delete("/:branchId", deleteBranch); // DELETE to `/api/v1/branches/:branchId` for deleting a branch

module.exports = router;
