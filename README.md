# NodeJS 백엔드

## 개발 환경설정

### Node Package Settings

```bash
npm i express mysql2 sequelize sequelize-typescript reflect-metadata dotenv morgan jsonwebtoken
npm i -D @types/node @types/express @types/morgan @types/jsonwebtoken nodemon ts-node prettier typescript
```

`package.json`

```json
{
  "main": "src/index.js",
  "scripts": {
    "build": "tsc -p .",
    "start": "node dist/index.js",
    "dev": "nodemon --watch \"src/**/*.ts\" --exec \"ts-node\" src/index.ts"
  }
}
```

### TypeScript

```bash
npx tsc --init
```

`tsconfig.json`

```json
{
  "compilerOptions": {
    "target": "es2016",
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true,
    "module": "commonjs",
    "typeRoots": ["./src/types"],
    "outDir": "./dist",
    "esModuleInterop": true,
    "forceConsistentCasingInFileNames": true,
    "strict": true,
    "noImplicitAny": true,
    "skipLibCheck": true
  },
  "ts-node": {
    "files": true
  }
}
```

### Prettier

```javascript
{
  "semi": true,
  "tabWidth": 2,
  "arrowParens": "always"
}
```

### gitignore

```bash
wget -O ".gitignore" https://www.toptal.com/developers/gitignore/api/macos,node
```

### 폴더 생성

```
src/
├── controllers/
├── models/
├── middlewares/
├── routes/
└── index.ts
```

## Express

### 컨트롤러

### `Response` Object

- `res.status(200)`
- `res.json()`

### 미들웨어

- `express.json()`
- `express.urlencoded({ extended: true })`

### `Request` Object

- `req.query`
- `req.params`
- `req.body`

### `NextFunction`

- `next()`

## Sequelize

### Connect / Sync

```typescript
import { Sequelize } from "sequelize-typescript";

const sequelize = new Sequelize({
  /// options
});
```

```typescript
await sequelize.sync({ force: true });
```

- `force: true`: DROP TABLE 실행 후 CREATE TABLE (데이터 초기화)
- `force: false`: ALTER TABLE (데이터 유지)

### Model 정의

```typescript
@Table({
  modelName: "User",
  tableName: "users",
  timestamps: true,
  underscored: true,
  charset: "utf8mb4",
  collate: "utf8mb4_general_ci",
})
class User extends Model<ModelAttribs, ModelCAttribs> {
  @AllowNull(false)
  @Unique("users.username")
  @Column(DataType.STRING(36))
  username: string;
}
```

### Associations

- One-to-many
- One-to-One
- Many-to-many

### Query

- `Model.findAll`, `Model.findOne`
- `Model.create`
- `Model.update` vs `model.save()`
- `Model.delete`

## 환경변수

- `.env` 파일
- 암호, API 키 등

## JWT 인증

- HTTP `Authorization` 헤더
  - `Bearer <token_value>`
- `jwt.sign()`
- `jwt.verify()`
