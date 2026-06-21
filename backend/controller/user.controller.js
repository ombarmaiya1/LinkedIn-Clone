import User from "../models/user.model.js";

const getUserController = async (req, res) => {
  try {
    const id = req.userId;
    console.log(id);

    const user = await User.findById(id).select("-password");

    if (!user) {
      res.status(404).send({
        success: false,
        message: "User Does not Exists",
      });
    }

    res.status(200).send({
      success: true,
      message: "User fetched successfully",
      user,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error in get User API",
    });
  }
};

export { getUserController };
