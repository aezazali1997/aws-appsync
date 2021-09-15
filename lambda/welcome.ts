type AppSync = {
  info: {
    fieldName: String;
  };
  arguments: {
    user: User;
  };
};
type User = {
  id: String;
  name: String;
  role: String;
  age: Number;
};
exports.handler = async (event: AppSync) => {
  switch (event.info.fieldName) {
    case "welcome":
      return "Welcome to appSync";
      break;
    case "hello":
      return "hello from another resolver";
      break;
    case "addUser":
      return event.arguments.user.name;
    default:
      return "Not found";
      break;
  }
};
