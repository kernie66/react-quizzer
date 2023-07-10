export const logout = (req, res, next) => {
  if (req.user) {
    const user = req.user.username;
    req.logOut((error) => {
      if (error) {
        return next(error);
      }
      res.status(200).json({ success: `User ${user} logged out` });
    });
  } else {
    res.status(404).json({ error: "User not logged in..." });
  }
};
