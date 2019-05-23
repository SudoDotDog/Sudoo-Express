/**
 * @author WMXPY
 * @namespace Example
 * @description Health
 */

import { SudooExpress, SudooExpressApplication } from "../src";

const app = SudooExpressApplication.create('Health-Example', '1');
const express = SudooExpress.create(app);

express.health('/hello');
express.host(8003);
