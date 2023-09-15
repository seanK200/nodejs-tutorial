import {
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from "sequelize-typescript";
import { Friend, FriendAttribs } from "./Friend.model";
import { Post, PostAttribs } from "./Post.model";

@Table({
  modelName: "FriendsPosts",
  tableName: "friends_posts",
  timestamps: false,
  charset: "utf8mb4",
  collate: "utf8mb4_general_ci",
})
export class FriendsPosts extends Model {
  @ForeignKey(() => Friend)
  @Column(DataType.INTEGER)
  friendId!: FriendAttribs["id"];

  @ForeignKey(() => Post)
  @Column(DataType.INTEGER)
  postId!: PostAttribs["id"];
}
