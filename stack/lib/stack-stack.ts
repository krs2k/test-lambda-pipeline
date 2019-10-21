import lambda = require("@aws-cdk/aws-lambda");
import cdk = require("@aws-cdk/core");

export class StackStack extends cdk.Stack {
  public readonly lambdaCode: lambda.CfnParametersCode;

  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    this.lambdaCode = lambda.Code.cfnParameters();

    const fn = new lambda.Function(this, "MyFunction", {
      runtime: lambda.Runtime.NODEJS_8_10,
      handler: "index.handler",
      code: this.lambdaCode,
    });
  }
}
