import { promises as fs } from "fs";
import { exists, info, isInternalTheme, toExternalName } from "./utils";
import { buildPath } from "./utils";

// yargs exports
export const command = "list";
export const describe = "List existing themes in the current project";
export const handler = list;

// utils
export async function listThemes(): Promise<string[]> {
  const workspacePath = buildPath("<cwd>/<workspace>");
  const hasWorkspace = await exists(workspacePath);
  const listing = hasWorkspace
    ? await fs.readdir(workspacePath, { withFileTypes: true })
    : [];

  return listing
    .filter((fileOrDir) => fileOrDir.isFile())
    .filter(({ name }) => isInternalTheme(name))
    .map(({ name }) => toExternalName(name));
}

// internals
async function list(): Promise<void> {
  const themes = await listThemes();

  if (themes.length === 0) {
    info(
      `This project has no themes. Use the create command to create a theme`
    );
    return;
  }

  info(`This project has the following themes: ${themes.join(", ")}`);
}
