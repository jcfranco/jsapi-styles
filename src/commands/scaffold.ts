import { Arguments } from "yargs";
import { buildPath, debug, dirs, exists, log, mainScss } from "./utils";
import cpy from "cpy";

interface ScaffoldArgs {
  force: boolean;
}

// yargs exports
export const command = "scaffold";
export const describe =
  "lay project scaffolding. This is done automatically when creating a theme for the first time.";
export const builder = {
  force: {
    alias: "f",
    describe: "forces creation of project scaffolding",
    type: "boolean",
  },
};
export const handler = async (argv: Arguments<ScaffoldArgs>): Promise<void> => {
  const workspacePath = buildPath(`<cwd>/<workspace>/`);
  await scaffold(workspacePath, argv.force);
};

// utils
export async function scaffold(
  workspacePath: string,
  force = false
): Promise<void> {
  const workspaceExists = await exists(workspacePath);

  if (workspaceExists) {
    if (!force) {
      log(
        "workspace exists, will not scaffold. If you wish to overwrite, use the --force flag."
      );
      return;
    }
  }

  const themesPath = buildPath("<nodeModules>/<themes>");

  const copyOptions = {
    cwd: themesPath,
    expandDirectories: true,
    overwrite: true,
    parents: true,
  };

  debug(`copying base`);

  await cpy("**/*", buildPath(`${workspacePath}/<base>`), {
    ...copyOptions,
    cwd: buildPath(`${themesPath}/<base>`),
  });

  debug(`copying examples`);

  await cpy(
    [`**/${mainScss}`, `!${dirs.base}/*.*`],
    buildPath(`${workspacePath}/<examples>`),
    copyOptions
  );

  debug(`copying preview file`);

  await cpy("preview/", buildPath(`${workspacePath}/<preview>`), {
    cwd: buildPath(`<dirname>/../../`),
  });

  log(`project scaffolding complete`);
}
