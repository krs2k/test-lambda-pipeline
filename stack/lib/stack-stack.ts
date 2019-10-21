import apigateway = require("@aws-cdk/aws-apigateway");
import lambda = require("@aws-cdk/aws-lambda");
import cdk = require("@aws-cdk/core");

export class StackStack extends cdk.Stack {
  public readonly lambdaCode: lambda.CfnParametersCode;

  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    this.lambdaCode = lambda.Code.cfnParameters({
      bucketNameParam: new cdk.CfnParameter(this, "CodeBucket", {
      }),
      objectKeyParam: new cdk.CfnParameter(this, "CodeObjectKey", {
      }),
    });

    const fn = new lambda.Function(this, "Function", {
      runtime: lambda.Runtime.NODEJS_8_10,
      handler: "index.handler",
      code: this.lambdaCode,
      tracing: lambda.Tracing.ACTIVE,
    });

    const api = new apigateway.LambdaRestApi(this, "Api", {
      handler: fn,
    });
    api.root.addMethod("GET");
  }
}
