import apigateway = require("@aws-cdk/aws-apigateway");
import lambda = require("@aws-cdk/aws-lambda");
import cdk = require("@aws-cdk/core");
// @ts-ignore
import {version} from "../../package.json";

export class StackStack extends cdk.Stack {
  public readonly lambdaCode: lambda.CfnParametersCode;
  public readonly env: cdk.CfnParameter;

  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    this.env = new cdk.CfnParameter(this, "Env");
    this.lambdaCode = lambda.Code.cfnParameters({
      bucketNameParam: new cdk.CfnParameter(this, "CodeBucket", {
      }),
      objectKeyParam: new cdk.CfnParameter(this, "CodeObjectKey", {
      }),
    });

    const env = this.env.value.toString();
    const fn = new lambda.Function(this, "Function", {
      functionName: "Deploy-Test",
      runtime: lambda.Runtime.NODEJS_8_10,
      handler: "index.handler",
      code: this.lambdaCode,
      tracing: lambda.Tracing.ACTIVE,
      environment: {
        NODE_ENV: env,
        VERSION: version,
      },

    });
    const api = new apigateway.LambdaRestApi(this, "Api", {
      handler: fn,
    });

    const fnVersion = fn.addVersion(version, undefined, version);
    const alias = new lambda.Alias(this, `Alias`, {
      aliasName: this.env.value.toString(),
      version: fnVersion,
    });
  }
}
