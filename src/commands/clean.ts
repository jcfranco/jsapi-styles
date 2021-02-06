import {
  buildPath,
  debug,
  deleteFileOrDir,
  error,
  exists,
  info,
} from "./utils";
import { Arguments } from "yargs";

interface CleanArgs {
  force: boolean;
}

// yargs exports
export const command = "clean";
export const describe =
  "Removes any local scaffolding. This should be used when no more theme authoring is to be done in the working directory.";
export const builder = {
  force: {
    alias: "f",
    describe: "required to clean any local scaffolding used by this utility",
    type: "boolean",
  },
};
export const handler = clean;

// internals
async function clean(argv: Arguments<CleanArgs>): Promise<void> {
  const workspacePath = buildPath("<cwd>/<workspace>");
  const hasWorkspace = await exists(workspacePath);

  if (!hasWorkspace) {
    error(`no workspace found in the current directory`);
    process.exit(1);
  }

  if (!argv.force) {
    error(`This command requires the --force flag`);
    process.exit(1);
  }

  debug(`removing scaffolding`);

  await deleteFileOrDir(workspacePath);

  info("clean successful");
}
