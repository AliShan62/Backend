const Branch = require("../models/Branches"); // Import the Branch model
const CompanyProfile = require("../models/CompanyProfile"); // Assuming this is the company model
const mongoose = require("mongoose");

exports.createBranch = async (req, res) => {
  try {
    const { name, location, radius } = req.body;

    // Validate basic branch fields
    if (
      !name ||
      !location ||
      !location.city ||
      !location.latitude ||
      !location.longitude
    ) {
      return res.status(400).json({
        message:
          "All fields are required, including location (city, latitude, longitude).",
      });
    }

    // Fetch the latest registered company (or apply your own logic)
    const company = await CompanyProfile.findOne().sort({ createdAt: -1 }); // Latest company

    if (!company) {
      return res.status(404).json({
        message: "No company found. Please register a company first.",
      });
    }

    const companyId = company._id; // Use the MongoDB _id as companyId

    // Create the branch
    const newBranch = new Branch({
      name,
      location,
      companyId,
      radius: radius || 5000, // Default if not provided
    });

    await newBranch.save();

    res.status(201).json({
      message: "Branch created successfully",
      branch: newBranch,
    });
  } catch (error) {
    console.error("Error creating branch:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get all branches for a specific company

exports.getBranchesByCompany = async (req, res) => {
  try {
    const companyId = req.params.companyId;

    // Validate if companyId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(companyId)) {
      return res.status(400).json({ message: "Invalid company ID format" });
    }

    // Find branches for the company using the valid ObjectId
    const branches = await Branch.find({
      companyId: mongoose.Types.ObjectId(companyId),
    });

    // If no branches are found
    if (!branches || branches.length === 0) {
      return res
        .status(404)
        .json({ message: "No branches found for this company" });
    }

    // Respond with the found branches
    res.status(200).json(branches);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get a single branch by ID
exports.getSingleBranch = async (req, res) => {
  try {
    const { branchId } = req.params;
    const branch = await Branch.findById(branchId);

    if (!branch) {
      return res.status(404).json({ message: "Branch not found" });
    }

    res.status(200).json(branch);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Update a branch by ID
exports.updateBranch = async (req, res) => {
  try {
    const { branchId } = req.params;
    const { name, location, radius } = req.body;

    // Update branch data
    const updatedBranch = await Branch.findByIdAndUpdate(
      branchId,
      { name, location, radius },
      { new: true } // Return the updated branch
    );

    if (!updatedBranch) {
      return res.status(404).json({ message: "Branch not found" });
    }

    res.status(200).json({
      message: "Branch updated successfully",
      branch: updatedBranch,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Delete a branch by ID
exports.deleteBranch = async (req, res) => {
  try {
    const { branchId } = req.params;

    const deletedBranch = await Branch.findByIdAndDelete(branchId);

    if (!deletedBranch) {
      return res.status(404).json({ message: "Branch not found" });
    }

    res.status(200).json({ message: "Branch deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
