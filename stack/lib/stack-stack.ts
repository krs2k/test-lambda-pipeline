import apigateway = require("@aws-cdk/aws-apigateway");
import lambda = require("@aws-cdk/aws-lambda");
import cdk = require("@aws-cdk/core");
// @ts-ignore
import {version} from "../../package.json";

interface IProps {
  env: string;
}
export class StackStack extends cdk.Stack {
  public readonly lambdaCode: lambda.CfnParametersCode;

  constructor(scope: cdk.Construct, id: string, props: IProps) {
    super(scope, id);

    this.lambdaCode = lambda.Code.cfnParameters({
      bucketNameParam: new cdk.CfnParameter(this, "CodeBucket", {
      }),
      objectKeyParam: new cdk.CfnParameter(this, "CodeObjectKey", {
      }),
    });

    const {env} = props;
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
    const alias = new lambda.Alias(this, `${env}Alias`, {
      aliasName: env,
      version: fnVersion,
    });
  }
}
