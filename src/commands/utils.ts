import { promises as fs, Stats } from "fs";
import { normalize } from "path";
import chalk from "chalk";

export const dirs = {
  dirname: __dirname,
  cwd: process.cwd(),
  base: "base",
  examples: "examples",
  nodeModules: `${__dirname}/../../../node_modules`,
  preview: "preview",
  themes: "arcgis-js-api/assets/esri/themes",
  workspace: ".jsapi-styles",
};

export function buildPath(path: string): string {
  for (const [key, dir] of Object.entries(dirs)) {
    path = path.replace(`<${key}>`, dir);
  }

  return normalize(path);
}

const mainStyleSheetName = "main";
export const mainCss = `${mainStyleSheetName}.css`;
export const mainScss = `${mainStyleSheetName}.scss`;
export const defaultThemeName = "my-custom-theme";

export const warn = function (...args: unknown[]): void {
  console.warn(chalk.yellow(...args));
};
export const log = function (...args: unknown[]): void {
  console.log(chalk.blue(...args));
};
export const info = function (...args: unknown[]): void {
  console.info(chalk.white(...args));
};
export const debug = function (...args: unknown[]): void {
  console.debug(chalk.gray(...args));
};
export const error = function (...args: unknown[]): void {
  console.error(chalk.red(...args));
};

export async function ensureDir(dir: string): Promise<void> {
  try {
    await fs.mkdir(dir, { recursive: true });
  } catch (e) {
    // noop dir exists
  }
}

async function getStats(dirOrFile: string): Promise<Stats | undefined> {
  let stats;

  try {
    stats = await fs.stat(dirOrFile);
  } catch (e) {
    // noop dir exists
  }

  return stats;
}

export async function exists(dirOrFile: string): Promise<boolean> {
  return !!(await getStats(dirOrFile));
}

const internalThemeToken = ".theme.";
const internalThemeNamePattern = new RegExp(`^\\${internalThemeToken}`);

export function toExternalName(internalThemeName: string): string {
  return internalThemeName.replace(internalThemeNamePattern, "");
}

export function toInternalName(externalThemeName: string): string {
  return `${internalThemeToken}${externalThemeName}`;
}

export function isInternalTheme(themeName: string): boolean {
  return internalThemeNamePattern.test(themeName);
}

export async function hasRef(themeName: string): Promise<boolean> {
  const workspacePath = `${dirs.cwd}/${dirs.workspace}`;
  const themeRefPath = `${workspacePath}/${toInternalName(themeName)}`;
  return exists(themeRefPath);
}

export async function createRef(themeName: string): Promise<void> {
  const workspacePath = `${dirs.cwd}/${dirs.workspace}`;
  const themeRefPath = `${workspacePath}/${toInternalName(themeName)}`;
  return fs.writeFile(themeRefPath, "");
}

export async function deleteRef(themeName: string): Promise<void> {
  const workspacePath = `${dirs.cwd}/${dirs.workspace}`;
  const themeRefPath = `${workspacePath}/${toInternalName(themeName)}`;
  return deleteFileOrDir(themeRefPath);
}

export async function deleteFileOrDir(fileOrDirPath: string): Promise<void> {
  return fs.rm(fileOrDirPath, { force: true, recursive: true });
}
