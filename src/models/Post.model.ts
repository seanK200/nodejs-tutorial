import {
  Model,
  Table,
  Column,
  DataType,
  AllowNull,
  BelongsTo,
} from "sequelize-typescript";
import { User, UserAttribs, UserResponse } from "./User.model";
import { Optional } from "sequelize";

export type PostAttribs = {
  id: number;
  content: string;
  createdAt: Date;
  createdBy: User;
  createdById: UserAttribs["id"];
};

type PostCAttribs = Optional<PostAttribs, "id" | "createdAt" | "createdBy">;

export type PostResponse = Pick<PostAttribs, "id" | "content"> & {
  createdBy: UserResponse;
};

@Table({
  modelName: "Post",
  tableName: "posts",
  timestamps: false,
  charset: "utf8mb4",
  collate: "utf8mb4_general_ci",
})
export class Post extends Model<PostAttribs, PostCAttribs> {
  @AllowNull(false)
  @Column(DataType.STRING(255))
  content!: PostAttribs["content"];

  @BelongsTo(() => User, "createdById")
  createdBy!: PostAttribs["createdBy"];

  toResponse(): PostResponse {
    return {
      id: this.get("id"),
      content: this.get("content"),
      createdBy: this.get("createdBy").toResponse(),
    };
  }
}
