# Quick Start

Start a web server with `@sudoo/express` is very simple.

## Create Settings

```ts
import { SudooExpress, SudooExpressApplication } from "@sudoo/express";

const setting: SudooExpressApplication = SudooExpressApplication.create('Example-Module', '1.0.0');

setting.useBodyParser();

const app: SudooExpress = SudooExpress.create(setting);
app.host(8080);
```
