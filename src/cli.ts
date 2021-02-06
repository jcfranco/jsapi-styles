#!/usr/bin/env node

import yargs from "yargs/yargs";
import { hideBin } from "yargs/helpers";
import pkg from "../package.json";

yargs(hideBin(process.argv))
  .scriptName(pkg.name)
  .usage("$0 <command> [args]")
  /* eslint-disable @typescript-eslint/no-var-requires */
  .command(require("./commands/create"))
  .command(require("./commands/preview"))
  .command(require("./commands/eject"))
  .command(require("./commands/list"))
  .command(require("./commands/clean"))
  .command(require("./commands/scaffold"))
  /* eslint-enable @typescript-eslint/no-var-requires */
  .demandCommand()
  .version(pkg.version).argv;
