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

    const deployment = new apigateway.Deployment(this, "ApiDeployment", {
      api,
    });

    new apigateway.Stage(this, "ProdStage", {
      stageName: "production",
      deployment,
      variables: {
        lambdaAlias: "production",
      },
    });
    const stage = new apigateway.Stage(this, "DevStage", {
      stageName: "development",
      deployment,
      variables: {
        lambdaAlias: "development",
      },
    });

    // const cv = fn.latestVersion;
    // new lambda.Alias(this, `ProductionAlias`, {
    //   aliasName: "production",
    //   version: cv,
    // });
    //
    // const fnVersion = fn.addVersion(version, undefined, version);
    // new lambda.Alias(this, `DevelopmentAlias`, {
    //   aliasName: "development",
    //   version: fnVersion,
    // });

  }
}
