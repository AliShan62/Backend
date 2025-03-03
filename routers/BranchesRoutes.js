// routes/branchRoutes.js
const express = require('express');
const router = express.Router();
const { createBranch, getBranches, getSingleBranch, updateBranch, deleteBranch } = require('../controllers/BranchesController');

// Define child routes under the parent route `/api/v1/branches`
router.post('/create', createBranch); // POST to `/api/v1/branches/create` for creating a branch
router.get('/getBranches', getBranches); // GET to `/api/v1/branches/getBranches` for getting all branches
router.get('/getSingleBranch/:branchId', getSingleBranch); // GET to `/api/v1/branches/getSingleBranch/:branchId` for a single branch
router.put('/updateBranch/:branchId', updateBranch); // PUT to `/api/v1/branches/updateBranch/:branchId` for updating a branch
router.delete('/deleteBranch/:branchId', deleteBranch); // DELETE to `/api/v1/branches/deleteBranch/:branchId` for deleting a branch

module.exports = router;