import {
  Model,
  Table,
  Column,
  DataType,
  AllowNull,
  BelongsTo,
  BelongsToMany,
} from "sequelize-typescript";
import { User, UserAttribs, UserResponse } from "./User.model";
import { Optional } from "sequelize";
import { Friend, FriendAttribs } from "./Friend.model";
import { FriendsPosts } from "./FriendsPosts.model";

export type PostAttribs = {
  id: number;
  content: string;
  createdAt: Date;
  createdBy: User;
  createdById: UserAttribs["id"];
  friends?: Friend[];
};

type PostCAttribs = Optional<PostAttribs, "id" | "createdAt" | "createdBy">;

export type PostResponse = Pick<PostAttribs, "id" | "content"> & {
  createdBy: UserResponse;
  friends?: FriendAttribs[];
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

  @BelongsToMany(() => Friend, {
    through: () => FriendsPosts,
    foreignKey: "postId",
    otherKey: "friendId",
  })
  friends: PostAttribs["friends"];

  toResponse(): PostResponse {
    return {
      id: this.get("id"),
      content: this.get("content"),
      createdBy: this.get("createdBy").toResponse(),
      friends: this.get("friends")?.map((f) => f.toJSON()),
    };
  }
}
