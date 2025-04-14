import Elysia, { t } from "elysia";
import { UserSystemService } from "./service";
import { authMiddleware } from "../../middlewares/auth";

export default function userSystemController({
  userService,
}: {
  userService: UserSystemService;
}) {
  const controller = "user";

  return (app: Elysia) => {
    app.post(
      `/${controller}/create`,
      async ({ body, set }) => {
        try {
          const result = await userService.createUser(body);
          return result;
        } catch (e) {
          console.log(e);
          set.status = 400;
          return { error: "User already exists" };
        }
      },
      {
        body: t.Object({
          email: t.String(),
          info: t.String(),
          lastname: t.String(),
          name: t.String(),
          password: t.String({ minLength: 6 }),
          phone: t.String(),
          username: t.String(),
        }),
      }
    );

    app.post(
      `/${controller}/login`,
      async ({ body }) => {
        const result = await userService.login(body);
        return result;
      },
      {
        body: t.Object({
          username: t.String(),
          password: t.String(),
        }),
      }
    );

    app.guard((app) =>
      app
        .resolve(authMiddleware)
        .get(`/${controller}/me`, async ({ userId }) => {
          const result = await userService.getProfile(userId as string);
          console.log(result);
          return result;
        })
    );

    app.guard(
      {
        beforeHandle: authMiddleware,
      },
      (app) =>
        app.resolve(authMiddleware).patch(
          `/${controller}/update`,
          async ({ userId, body }) => {
            return userService.updateProfile(userId as string, body);
          },
          {
            body: t.Partial(
              t.Object({
                name: t.String(),
                lastname: t.String(),
                phone: t.String(),
                info: t.String(),
              })
            ),
          }
        )
    );

    app.guard(
      {
        beforeHandle: authMiddleware,
      },
      (app) =>
        app.resolve(authMiddleware).patch(
          `/${controller}/change-password`,
          async ({ userId, body, set }) => {
            const success = await userService.changePassword(
              userId as string,
              body
            );
            if (!success) {
              set.status = 400;
              return { error: "Old password incorrect" };
            }
            return { success: true };
          },
          {
            body: t.Object({
              oldPassword: t.String(),
              newPassword: t.String({ minLength: 6 }),
            }),
          }
        )
    );
    // .resolve(authMiddleware)

    app.post(`/${controller}/logout`, () => {
      return { message: "Logout successful" };
    });

    return app;
  };
}

export type UserSystemController = ReturnType<typeof userSystemController>;
