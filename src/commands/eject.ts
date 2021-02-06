import cpy from "cpy";
import { buildPath, defaultThemeName, deleteRef, info } from "./utils";

import { listThemes } from "./list";

import { compileTheme } from "./preview";
import { Arguments, Argv } from "yargs";

interface EjectArgs {
  theme: string;
}

// yargs exports
export const command = "eject [theme]";
export const describe = "eject a built theme ready for deployment";
export const builder = (yargs: Argv) => {
  yargs.positional("theme", {
    default: defaultThemeName,
    describe:
      "the name of the theme to eject (this is only needed if there is more than one theme in the workspace)",
    type: "string",
  });
};
export const handler = eject;

// internals
async function eject(argv: Arguments<EjectArgs>): Promise<void> {
  const availableThemes = await listThemes();

  if (availableThemes.length === 0) {
    info(
      "no available themes to eject, use the create command to create a theme"
    );
    process.exit(1);
  }

  if (!argv.theme && availableThemes.length > 1) {
    info(
      `there is more than one theme to preview: ${availableThemes}. Please use the --theme flag to specify a theme to preview`
    );
    process.exit(1);
  }

  const themeName = argv.theme ?? availableThemes[0];
  const ejectedThemeDir = buildPath(`<cwd>/${themeName}`);

  await compileTheme(themeName, `${ejectedThemeDir}`);

  await cpy(buildPath("<base>/**/*"), ejectedThemeDir, {
    cwd: buildPath("<cwd>/<workspace>"),
    parents: true,
  });

  await deleteRef(themeName);

  info("theme ejected successfully");
}
