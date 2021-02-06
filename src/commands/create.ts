import cpy from "cpy";
import { promises as fs } from "fs";
import {
  buildPath,
  createRef,
  debug,
  defaultThemeName,
  dirs,
  error,
  exists,
  info,
  mainScss,
} from "./utils";

import { scaffold } from "./scaffold";
import { Arguments, Argv } from "yargs";

interface CreateArgs {
  force: boolean;
  theme: string;
}

// yargs exports
export const command = "create [theme]";
export const describe = "create a custom theme";
export const builder = (yargs: Argv) => {
  yargs.positional("theme", {
    default: defaultThemeName,
    describe: "the name of the theme to create",
    type: "string",
  });

  yargs.option("with-examples", {
    alias: "e",
    describe:
      "when specified, the created theme will include examples from the API",
    type: "boolean",
  });

  yargs.option("with-base", {
    alias: "b",
    describe:
      "when specified, the created theme will include base files for local overrides (advanced)",
    type: "boolean",
  });

  yargs.option("force", {
    alias: "f",
    describe: "overwrites a theme if it already exists",
    type: "boolean",
  });
};
export const handler = create;

// internals
async function create(argv: Arguments<CreateArgs>): Promise<void> {
  const workspacePath = buildPath("<cwd>/<workspace>");
  await scaffold(workspacePath);

  const themeName = argv.theme ?? defaultThemeName;
  const customThemePath = buildPath(`<cwd>/${themeName}`);

  const themeExists = await exists(customThemePath);

  if (themeExists) {
    if (argv.force) {
      info(`${themeName} already exists, will override due to --force flag`);
    } else {
      error(
        `cannot create ${themeName} since it already exists. If you wish to override, use the --force flag`
      );
      process.exit(1);
    }
  }

  debug(`creating ${themeName}`);

  await createRef(themeName);

  await cpy(mainScss, customThemePath, {
    cwd: buildPath("<nodeModules>/<themes>/light"),
  });

  if (argv.withBase) {
    await cpy(dirs.base, customThemePath, {
      cwd: buildPath(`${workspacePath}`),
      parents: true,
    });
  }

  if (argv.withExamples) {
    await cpy(dirs.examples, customThemePath, {
      cwd: buildPath(`${workspacePath}`),
      parents: true,
    });
  }

  const mainStylesheet = buildPath(`${customThemePath}/${mainScss}`);
  const content = await fs.readFile(mainStylesheet, "utf-8");

  const defaultThemeHeader = /Theme: .*/;
  const customThemeHeader = `Theme: ${themeName}`;

  await fs.writeFile(
    mainStylesheet,
    content.replace(defaultThemeHeader, customThemeHeader)
  );

  info("created theme successfully");
}
