#!/usr/bin/env node
import cdk = require("@aws-cdk/core");
import "source-map-support/register";
import { StackStack } from "../lib/stack-stack";

const app = new cdk.App();

const dev = new StackStack(app, "dev", {env: "development"});
const prod = new StackStack(app, "prod", {env: "production"});
