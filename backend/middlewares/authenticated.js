import jwt from "jsonwebtoken";

const authenticated = async (req, res, next) => {
  try {
    let token = req.cookies.token;

    if (!token) {
      return res.status(400).json({
        message:
          "Authentication failed. A valid credential is required to access this resource.",
      });
    }

    let verifyToken = await jwt.verify(token, process.env.JWT_SECRET);
    console.log(verifyToken);
    req.userId = verifyToken.userId;
    next();
  } catch (error) {
    return res
      .status(500)
      .json({ message: "An error occured while authenticating user", error });
  }
};

export default authenticated;
