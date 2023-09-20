import { spawn } from "child_process";
import { join } from "path";
import { getRootPath } from "./utils";

type ChildProcessResult = {
  code: number | null;
  stdout: string;
  stderr: string;
};

export const verifyFace = async () => {
  const { stdout } = await new Promise<ChildProcessResult>(
    (resolve, reject) => {
      const scriptPath = join(
        getRootPath(),
        "src",
        "scripts",
        "face-verify.py",
      );
      const py = spawn("python3", [scriptPath]);

      const result: ChildProcessResult = {
        code: 0,
        stdout: "",
        stderr: "",
      };

      py.stdout.on("data", (data) => {
        result.stdout += data;
      });

      py.stderr.on("data", (data) => {
        result.stderr += data;
      });

      py.on("close", (code) => {
        result.code = code;

        if (code === 0) resolve(result);
        else reject(result);
      });
    },
  );
  return JSON.parse(stdout);
};
