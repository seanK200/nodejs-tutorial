import { Optional } from "sequelize";
import {
  Model,
  Table,
  Column,
  DataType,
  AllowNull,
  Unique,
  Default,
} from "sequelize-typescript";

export type UserAttribs = {
  id: number;
  email: string;
  password: string;
  salt: string;
  createdAt: Date;
};

type UserCAttribs = Optional<UserAttribs, "id" | "createdAt">;

export type UserResponse = Pick<UserAttribs, "id" | "email">;

@Table({
  modelName: "User",
  tableName: "users",
  timestamps: false,
  charset: "utf8mb4",
  collate: "utf8mb4_general_ci",
})
export class User extends Model<UserAttribs, UserCAttribs> {
  @Unique("users.email")
  @AllowNull(false)
  @Column(DataType.STRING(36))
  email!: UserAttribs["email"];

  @AllowNull(false)
  @Column(DataType.CHAR(128))
  password!: UserAttribs["password"];

  @AllowNull(false)
  @Column(DataType.CHAR(32))
  salt!: UserAttribs["salt"];

  @Default(DataType.NOW)
  @AllowNull(false)
  @Column(DataType.DATE)
  createdAt!: UserAttribs["createdAt"];

  toResponse(): UserResponse {
    return {
      id: this.get("id"),
      email: this.get("email"),
    };
  }
}
