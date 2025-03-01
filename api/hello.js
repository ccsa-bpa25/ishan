// api/hello.js
module.exports = (req, res) => {
  // Sending a JSON response with a message
  res.status(200).json({ message: 'Hello from the Node.js API!' });
};
