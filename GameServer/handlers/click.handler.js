import { users } from "../users/user.session.js";

export const clickHandler = (socket, token) => {
  const user = users.get(token);

  user.click();
};
