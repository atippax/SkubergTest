import { DataSource } from "typeorm";
import { hashing } from "../../utils/hash";
import { generateUUID } from "../../utils/uuid";
import { UserEntity } from "../../entities/user.entity";

function userSystemRepository(dataSource: DataSource) {
  const repository = dataSource.getRepository(UserEntity);

  return {
    createUser: async ({
      email,
      info,
      lastname,
      name,
      password,
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
      const newUser = repository.create({
        userId: generateUUID(),
        email,
        info,
        lastname,
        name,
        password: await hashing(password),
        phone,
        username,
        walletName: generateUUID(),
      });

      return await repository.save(newUser); // save เพื่อบันทึกจริงใน DB
    },

    findByFields: async (criteria: Partial<UserEntity>) => {
      return await repository.findOne({ where: criteria });
    },

    findById: async (id: string) => {
      return await repository.findOne({
        where: { userId: id },
      });
    },

    save: async (user: UserEntity) => {
      return await repository.save(user);
    },

    remove: async (user: UserEntity) => {
      return await repository.remove(user);
    },
  };
}

export type UserSystemRepository = ReturnType<typeof userSystemRepository>;

export default userSystemRepository;
