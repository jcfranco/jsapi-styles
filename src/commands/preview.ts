import { promises as fs } from "fs";
import { create, Options } from "browser-sync";
import sass from "sass";
import fiber from "fibers";
import chokidar from "chokidar";
import pify from "pify";
import {
  debug,
  buildPath,
  ensureDir,
  error,
  info,
  log,
  mainCss,
  defaultThemeName,
} from "./utils";
import { listThemes } from "./list";
import { Arguments, Argv } from "yargs";

interface PreviewArgs {
  theme: string;
  port: number;
}

const bs = create();
const sassRender = pify(sass.render);

// yargs exports
export const command = "preview [theme]";
export const describe = "launch theme-preview test page";
export const builder = (yargs: Argv) => {
  yargs.positional("theme", {
    default: defaultThemeName,
    describe:
      "the name of the theme to preview (this is only needed if there is more than one theme in the workspace)",
    type: "string",
  });

  yargs.option("port", {
    alias: "p",
    describe: "port to use for the preview page",
    type: "number",
  });
};
export const handler = preview;

// util exports
export async function compileTheme(
  themeName: string,
  destinationDir = buildPath("<cwd>/<workspace>")
): Promise<void> {
  const contents = await sassRender({
    file: buildPath(`<cwd>/${themeName}/main.scss`),
    fiber,
    outputStyle: "compressed",
    includePaths: [
      buildPath(`<cwd>/${themeName}/<base>`),
      buildPath("<cwd>/<workspace>/<base>"),
    ],
  });

  await ensureDir(destinationDir);
  await fs.writeFile(
    buildPath(`${destinationDir}/${mainCss}`),
    contents.css,
    {}
  );

  log("compiled theme successfully");
}

// internals
async function preview(argv: Arguments<PreviewArgs>): Promise<void> {
  const availableThemes = await listThemes();

  if (availableThemes.length === 0) {
    info(
      "no available themes to preview, use the create command to create a theme"
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

  debug(`compiling ${themeName}`);

  try {
    await compileTheme(themeName);

    const watcher = chokidar.watch(
      [
        buildPath(`<cwd>/${themeName}`),
        buildPath(`<cwd>/<workspace>/<preview>`),
        buildPath(`<cwd>/<workspace>/<base>`),
      ],
      {
        ignoreInitial: true,
        interval: 500,
      }
    );

    watcher.on("all", async (event) => {
      if (event !== "change") {
        return;
      }

      await compileTheme(themeName);
    });
  } catch (e) {
    error("failed to build theme", e);
    process.exit(1);
  }

  info("launching preview, use CTRL+C to terminate");

  const browserSyncOptions: Options = {
    files: [
      buildPath("<cwd>/<workspace>/**/*.css"),
      buildPath("<cwd>/<workspace>/<preview>"),
    ],
    server: {
      baseDir: buildPath("<cwd>/<workspace>"),
    },
    startPath: buildPath("<preview>"),
  };

  if (argv.port) {
    browserSyncOptions.port = argv.port;
  }

  bs.init(browserSyncOptions);
}
