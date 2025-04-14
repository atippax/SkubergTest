import { signToken } from "../../utils/auth";
import { isMatch, hashing } from "../../utils/hash";
import { UserEntity } from "../../entities/user.entity";
import { UserSystemRepository } from "./repository";

function userSystemService({ userRepo }: { userRepo: UserSystemRepository }) {
  const createUser = async ({
    email,
    info,
    lastname,
    name,
    password: _password,
    phone,
    username,
  }: {
    username: string;
    name: string;
    password: string;
    lastname: string;
    email: string;
    phone: string;
    info: string;
  }) => {
    const userExist = await findByFields({
      criteria: {
        email,
        username,
      },
    });
    console.log("s", userExist);
    if (userExist != null) {
      throw Error("User already exists");
    }

    const { password, ...safeUser } = await userRepo.createUser({
      email,
      info,
      lastname,
      name,
      password: _password,
      phone,
      username,
    });
    return safeUser;
  };

  const login = async ({
    username,
    password,
  }: {
    username: string;
    password: string;
  }) => {
    const user = await userRepo.findByFields({ username });

    if (!user) throw new Error("User not found");

    const _isMatch = await isMatch({ password, hashing: user.password });
    if (!_isMatch) throw new Error("Invalid credentials");

    const token = signToken({ userId: user.userId });
    return { token, user };
  };

  const findByFields = async ({
    criteria,
  }: {
    criteria: Partial<UserEntity>;
  }) => {
    return await userRepo.findByFields(criteria);
  };

  const getUserById = async (id: string) => {
    const user = await userRepo.findByFields({ userId: id });
    if (!user) throw new Error("User not found");
    return user;
  };

  const updateUser = async (
    id: string,
    updateFields: Partial<Omit<UserEntity, "userId" | "password">>
  ) => {
    const user = await userRepo.findByFields({ userId: id });
    if (!user) throw new Error("User not found");

    Object.assign(user, updateFields);
    return await userRepo.save(user);
  };

  const deleteUser = async (id: string) => {
    const user = await userRepo.findByFields({ userId: id });
    if (!user) throw new Error("User not found");
    return await userRepo.remove(user);
  };

  const getProfile = async (userId: string) => {
    const user = await getUserById(userId);
    const { password, ...safeUser } = user;
    return safeUser;
  };

  const updateProfile = async (
    userId: string,
    updates: Partial<Pick<UserEntity, "name" | "lastname" | "phone" | "info">>
  ) => {
    return await updateUser(userId, updates);
  };

  const changePassword = async (
    userId: string,
    {
      oldPassword,
      newPassword,
    }: {
      oldPassword: string;
      newPassword: string;
    }
  ) => {
    const user = await getUserById(userId);
    const matched = await isMatch({
      password: oldPassword,
      hashing: user.password,
    });

    if (!matched) return false;

    user.password = await hashing(newPassword);
    await userRepo.save(user);
    return true;
  };

  return {
    createUser,
    login,
    findByFields,
    getUserById,
    updateUser,
    deleteUser,
    getProfile,
    updateProfile,
    changePassword,
  };
}

export type UserSystemService = ReturnType<typeof userSystemService>;
export default userSystemService;
