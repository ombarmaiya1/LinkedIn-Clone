import User from "../models/user.model.js";
import uploadOnCloudinary from "../config/cloudinary.js";
import { getIO } from "../config/socket.js";

const hasId = (items, id) =>
  items?.some((item) => item?.toString() === id?.toString());

const removeId = (items, id) =>
  items?.filter((item) => item?.toString() !== id?.toString()) || [];

const upsertId = (items, id) => {
  if (hasId(items, id)) {
    return items;
  }

  return [...(items || []), id];
};

const networkUserSelect =
  "firstName lastName userName profileImage headline location";

const emitNetworkUpdate = (userIds, payload) => {
  const io = getIO();
  if (!io) {
    return;
  }

  const uniqueUserIds = [
    ...new Set(userIds.map((id) => id?.toString())),
  ].filter(Boolean);
  uniqueUserIds.forEach((id) => {
    io.to(`user:${id}`).emit("network:updated", {
      ...payload,
      affectedUserId: id,
    });
  });
};

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

const updateAboutController = async (req, res) => {
  try {
    const { about } = req.body;
    const user = await User.findById(req.userId);

    if (!user) {
      return res
        .status(404)
        .send({ success: false, message: "User not found" });
    }

    user.bio = about;
    await user.save();

    res.status(200).send({ success: true, message: "Bio updated", user });
  } catch (error) {
    console.log(error);
    res.status(500).send({ success: false, message: "Error updating bio" });
  }
};

const updateExperienceController = async (req, res) => {
  try {
    const { experience } = req.body;
    if (!Array.isArray(experience)) {
      return res
        .status(400)
        .send({ success: false, message: "Experience must be an array" });
    }

    const user = await User.findById(req.userId);
    if (!user) {
      return res
        .status(404)
        .send({ success: false, message: "User not found" });
    }

    user.experience = experience;
    await user.save();

    res
      .status(200)
      .send({ success: true, message: "Experience updated", user });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .send({ success: false, message: "Error updating experience" });
  }
};

const updateSkillsController = async (req, res) => {
  try {
    const { skills } = req.body;
    const user = await User.findById(req.userId);

    if (!user) {
      return res
        .status(404)
        .send({ success: false, message: "User not found" });
    }

    let skillsArray = [];
    if (Array.isArray(skills)) {
      skillsArray = skills;
    } else if (typeof skills === "string") {
      skillsArray = skills
        .split(",")
        .map((skill) => skill.trim())
        .filter(Boolean);
    }

    user.skills = skillsArray;
    await user.save();

    res.status(200).send({ success: true, message: "Skills updated", user });
  } catch (error) {
    console.log(error);
    res.status(500).send({ success: false, message: "Error updating skills" });
  }
};

const updateEducationController = async (req, res) => {
  try {
    const { education } = req.body;
    if (!Array.isArray(education)) {
      return res
        .status(400)
        .send({ success: false, message: "Education must be an array" });
    }

    const user = await User.findById(req.userId);
    if (!user) {
      return res
        .status(404)
        .send({ success: false, message: "User not found" });
    }

    user.education = education;
    await user.save();

    res.status(200).send({ success: true, message: "Education updated", user });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .send({ success: false, message: "Error updating education" });
  }
};

const updateImagesController = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res
        .status(404)
        .send({ success: false, message: "User not found" });
    }

    const profileFiles = req.files?.profileImage;
    const coverFiles = req.files?.coverImage;

    if (profileFiles?.length) {
      const profileUrl = await uploadOnCloudinary(profileFiles[0].path);
      if (profileUrl) user.profileImage = profileUrl;
    }

    if (coverFiles?.length) {
      const coverUrl = await uploadOnCloudinary(coverFiles[0].path);
      if (coverUrl) user.coverImage = coverUrl;
    }

    await user.save();

    res
      .status(200)
      .send({ success: true, message: "Profile images updated", user });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .send({ success: false, message: "Error updating profile images" });
  }
};

const getNetworkOverviewController = async (req, res) => {
  try {
    const currentUser = await User.findById(req.userId)
      .select("-password")
      .populate("connections", networkUserSelect)
      .populate("connectionRequestsReceived", networkUserSelect)
      .populate("connectionRequestsSent", networkUserSelect);

    if (!currentUser) {
      return res
        .status(404)
        .send({ success: false, message: "User not found" });
    }

    const excludedIds = [
      currentUser._id,
      ...currentUser.connections.map((user) => user._id),
      ...currentUser.connectionRequestsReceived.map((user) => user._id),
      ...currentUser.connectionRequestsSent.map((user) => user._id),
    ];

    const suggestions = await User.find({
      _id: { $nin: excludedIds },
    })
      .select(networkUserSelect)
      .limit(15)
      .sort({ createdAt: -1 });

    return res.status(200).send({
      success: true,
      data: {
        suggestions,
        connections: currentUser.connections,
        incomingRequests: currentUser.connectionRequestsReceived,
        outgoingRequests: currentUser.connectionRequestsSent,
      },
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .send({ success: false, message: "Error fetching network overview" });
  }
};

const sendConnectionRequestController = async (req, res) => {
  try {
    const { targetUserId } = req.params;
    const currentUserId = req.userId;

    if (!targetUserId) {
      return res
        .status(400)
        .send({ success: false, message: "Target user id is required" });
    }

    if (targetUserId.toString() === currentUserId.toString()) {
      return res
        .status(400)
        .send({ success: false, message: "You cannot connect with yourself" });
    }

    const [currentUser, targetUser] = await Promise.all([
      User.findById(currentUserId),
      User.findById(targetUserId),
    ]);

    if (!currentUser || !targetUser) {
      return res
        .status(404)
        .send({ success: false, message: "User not found" });
    }

    if (hasId(currentUser.connections, targetUserId)) {
      return res
        .status(400)
        .send({ success: false, message: "You are already connected" });
    }

    if (hasId(currentUser.connectionRequestsSent, targetUserId)) {
      return res
        .status(400)
        .send({ success: false, message: "Connection request already sent" });
    }

    // If target has already sent a request to current user, accept instantly.
    if (hasId(currentUser.connectionRequestsReceived, targetUserId)) {
      currentUser.connectionRequestsReceived = removeId(
        currentUser.connectionRequestsReceived,
        targetUserId,
      );
      targetUser.connectionRequestsSent = removeId(
        targetUser.connectionRequestsSent,
        currentUserId,
      );

      currentUser.connections = upsertId(currentUser.connections, targetUserId);
      targetUser.connections = upsertId(targetUser.connections, currentUserId);

      await Promise.all([currentUser.save(), targetUser.save()]);

      emitNetworkUpdate([currentUserId, targetUserId], {
        type: "connection_accepted",
        sourceUserId: currentUserId.toString(),
        targetUserId: targetUserId.toString(),
      });

      return res.status(200).send({
        success: true,
        message: "Connection request accepted",
      });
    }

    currentUser.connectionRequestsSent = upsertId(
      currentUser.connectionRequestsSent,
      targetUserId,
    );
    targetUser.connectionRequestsReceived = upsertId(
      targetUser.connectionRequestsReceived,
      currentUserId,
    );

    await Promise.all([currentUser.save(), targetUser.save()]);

    emitNetworkUpdate([currentUserId, targetUserId], {
      type: "request_sent",
      sourceUserId: currentUserId.toString(),
      targetUserId: targetUserId.toString(),
    });

    return res.status(200).send({
      success: true,
      message: "Connection request sent",
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .send({ success: false, message: "Error sending connection request" });
  }
};

const acceptConnectionRequestController = async (req, res) => {
  try {
    const { requesterUserId } = req.params;
    const currentUserId = req.userId;

    const [currentUser, requesterUser] = await Promise.all([
      User.findById(currentUserId),
      User.findById(requesterUserId),
    ]);

    if (!currentUser || !requesterUser) {
      return res
        .status(404)
        .send({ success: false, message: "User not found" });
    }

    if (!hasId(currentUser.connectionRequestsReceived, requesterUserId)) {
      return res
        .status(400)
        .send({
          success: false,
          message: "No incoming request from this user",
        });
    }

    currentUser.connectionRequestsReceived = removeId(
      currentUser.connectionRequestsReceived,
      requesterUserId,
    );
    requesterUser.connectionRequestsSent = removeId(
      requesterUser.connectionRequestsSent,
      currentUserId,
    );

    currentUser.connections = upsertId(
      currentUser.connections,
      requesterUserId,
    );
    requesterUser.connections = upsertId(
      requesterUser.connections,
      currentUserId,
    );

    await Promise.all([currentUser.save(), requesterUser.save()]);

    emitNetworkUpdate([currentUserId, requesterUserId], {
      type: "connection_accepted",
      sourceUserId: currentUserId.toString(),
      targetUserId: requesterUserId.toString(),
    });

    return res.status(200).send({
      success: true,
      message: "Connection request accepted",
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .send({ success: false, message: "Error accepting connection request" });
  }
};

const rejectConnectionRequestController = async (req, res) => {
  try {
    const { requesterUserId } = req.params;
    const currentUserId = req.userId;

    const [currentUser, requesterUser] = await Promise.all([
      User.findById(currentUserId),
      User.findById(requesterUserId),
    ]);

    if (!currentUser || !requesterUser) {
      return res
        .status(404)
        .send({ success: false, message: "User not found" });
    }

    if (!hasId(currentUser.connectionRequestsReceived, requesterUserId)) {
      return res
        .status(400)
        .send({
          success: false,
          message: "No incoming request from this user",
        });
    }

    currentUser.connectionRequestsReceived = removeId(
      currentUser.connectionRequestsReceived,
      requesterUserId,
    );
    requesterUser.connectionRequestsSent = removeId(
      requesterUser.connectionRequestsSent,
      currentUserId,
    );

    await Promise.all([currentUser.save(), requesterUser.save()]);

    emitNetworkUpdate([currentUserId, requesterUserId], {
      type: "request_rejected",
      sourceUserId: currentUserId.toString(),
      targetUserId: requesterUserId.toString(),
    });

    return res.status(200).send({
      success: true,
      message: "Connection request rejected",
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .send({ success: false, message: "Error rejecting connection request" });
  }
};

const removeConnectionController = async (req, res) => {
  try {
    const { targetUserId } = req.params;
    const currentUserId = req.userId;

    const [currentUser, targetUser] = await Promise.all([
      User.findById(currentUserId),
      User.findById(targetUserId),
    ]);

    if (!currentUser || !targetUser) {
      return res
        .status(404)
        .send({ success: false, message: "User not found" });
    }

    currentUser.connections = removeId(currentUser.connections, targetUserId);
    targetUser.connections = removeId(targetUser.connections, currentUserId);

    currentUser.connectionRequestsSent = removeId(
      currentUser.connectionRequestsSent,
      targetUserId,
    );
    currentUser.connectionRequestsReceived = removeId(
      currentUser.connectionRequestsReceived,
      targetUserId,
    );

    targetUser.connectionRequestsSent = removeId(
      targetUser.connectionRequestsSent,
      currentUserId,
    );
    targetUser.connectionRequestsReceived = removeId(
      targetUser.connectionRequestsReceived,
      currentUserId,
    );

    await Promise.all([currentUser.save(), targetUser.save()]);

    emitNetworkUpdate([currentUserId, targetUserId], {
      type: "connection_removed",
      sourceUserId: currentUserId.toString(),
      targetUserId: targetUserId.toString(),
    });

    return res.status(200).send({
      success: true,
      message: "Connection removed",
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .send({ success: false, message: "Error removing connection" });
  }
};

export {
  getUserController,
  updateAboutController,
  updateEducationController,
  updateExperienceController,
  updateSkillsController,
  updateImagesController,
  getNetworkOverviewController,
  sendConnectionRequestController,
  acceptConnectionRequestController,
  rejectConnectionRequestController,
  removeConnectionController,
};
