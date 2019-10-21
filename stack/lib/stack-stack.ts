import lambda = require("@aws-cdk/aws-lambda");
import cdk = require("@aws-cdk/core");

export class StackStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const fn = new lambda.Function(this, "MyFunction", {
      runtime: lambda.Runtime.NODEJS_8_10,
      handler: "index.handler",
      code: lambda.Code.asset("../lib"),
    });
  }
}
