require("../src/utils/db");
const app = require("./app");
const PORT = 3000;

const server = app.listen(process.env.PORT || PORT, () => {
  console.log(`Started Express app on http://localhost:${PORT}`);
});
