# OpenAPI express

With this package you can easy connect your openapi spec to controllers.

## Example usage

```
import { buildOpenapiExpress, API } from '../openapi-express.js'

const app = buildOpenapiExpress({
    name: 'test',
    version: '1.2.3',
    apis: [
        API.create({
            version: 'v1',
            specification,
            controllers,
            secret: 'secret'
        })
    ],
    staticFolder: 'public'
})
```

## fields

### name

The field `name` should be a string.
You can get it e.g. from your package.json.
You can get it with `app.get('name')`

### version

The field `version` should be a string.
You can get it e.g. from your package.json.
It will set the version in the header `X-Version`.

### apis

The field `apis` should be an array.
Every item should be an object that contain `version`, `specification`, `controllers` and can contain `secret`.
You can use `API.create` to create the object and get feedback.

#### version

The field `version` should be a string.
It will be used for the route.
e.g. if your version is `'v1'`, all routes from the specification will start with `/v1/`

#### specification

The field `specification` should be an object.
It should contain the OpenAPI specification.
See also: https://swagger.io/specification/

#### controllers

The field `controllers` should be an object.
It should contain all routes.
In your OpenAPI specification you can use `operationId`
You should return an object with a function for evert operationId.

An example of a controller result:
```
{
    statusCode: 200,
    body: {
        status: true,
        version: '1.2.3',
        timestamp: new Date(),
        message: 'ok'
    }
}
```

The field `statusCode` will be used for the http status code.

The field `body` should be an object or array.

#### secret

The field `secret` should be a string, but is optional.
This will be used for the authentication.
You should send a header called `x-api-key` with this value 
for every route where `apiKey` is set in the OpenAPI specification.

### staticFolder

The field `staticFolder` should be a string, but is optional.
If you have some static files, e.g. a favicon, you can set here the path to the folder.
If there is a folder public in the root of the project folder, you can set the value to 'public'.