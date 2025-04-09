const Branch = require("../models/Branches"); // Import the Branch model

// Create a new branch
exports.createBranch = async (req, res) => {
  try {
    const { name, location, companyId, radius } = req.body;

    // Validate required fields
    if (
      !name ||
      !location ||
      !location.city ||
      !location.latitude ||
      !location.longitude ||
      !companyId
    ) {
      return res.status(400).json({
        message:
          "All fields are required, including location (city, latitude, longitude), and companyId.",
      });
    }

    // Default radius if not provided
    const branchRadius = radius || 5000; // Set to 5000 meters if no radius is provided

    // Create a new branch object
    const newBranch = new Branch({
      name,
      location,
      companyId, // Reference to the main branch
      radius: branchRadius, // Default radius or user-defined
    });

    // Save the new branch to the database
    await newBranch.save();

    res.status(201).json({
      message: "Branch created successfully",
      branch: newBranch,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get all branches
exports.getBranches = async (req, res) => {
  try {
    const branches = await Branch.find(); // Get all branches from the database
    res.status(200).json(branches);
  } catch (error) {
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
