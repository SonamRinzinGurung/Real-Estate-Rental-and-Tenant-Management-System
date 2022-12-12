const login = async (req, res) => {
  res.json({ message: "Login route" });
};

const register = async (req, res) => {
  res.json({ message: "Register route" });
};

export { login, register };
