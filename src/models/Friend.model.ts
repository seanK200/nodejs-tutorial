import { Optional } from "sequelize";
import {
  AllowNull,
  BelongsTo,
  BelongsToMany,
  Column,
  DataType,
  Model,
  Table,
  Unique,
} from "sequelize-typescript";
import { User, UserAttribs } from "./User.model";
import { Post } from "./Post.model";
import { FriendsPosts } from "./FriendsPosts.model";

export type FriendAttribs = {
  id: number;
  name: string;
  user: User;
  userId: UserAttribs["id"];
  posts?: Post[];
};

type FriendCAttribs = Optional<FriendAttribs, "id" | "user">;

@Table({
  modelName: "Friend",
  tableName: "friends",
  timestamps: false,
  charset: "utf8mb4",
  collate: "utf8mb4_general_ci",
})
export class Friend extends Model<FriendAttribs, FriendCAttribs> {
  @AllowNull(false)
  @Unique("friends.name")
  @Column(DataType.STRING(64))
  name!: FriendAttribs["name"];

  @BelongsTo(() => User, "userId")
  user!: FriendAttribs["user"];

  @BelongsToMany(() => Post, {
    through: () => FriendsPosts,
    foreignKey: "friendId",
    otherKey: "postId",
  })
  posts: FriendAttribs["posts"];
}
