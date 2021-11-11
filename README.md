[![Node CI][npm-image]][npm-url] [![Bugs][bugs-image]][bugs-url] [![Code Smells][code-smells-image]][code-smells-url] [![Duplicated Lines (%)][duplicate-lines-image]][duplicate-lines-url] [![Maintainability Rating][maintainability-rate-image]][maintainability-rate-url] [![Reliability Rating][reliability-rate-image]][reliability-rate-url] [![Security Rating][security-rate-image]][security-rate-url] [![Technical Debt][technical-debt-image]][technical-debt-url] [![Vulnerabilities][vulnerabilitiest-image]][vulnerabilitiest-url] [![Quality Gate Status][quality-gate-image]][quality-gate-url] [![Coverage][coverage-image]][coverage-url]

# OpenAPI express

With this package you can easy connect your openapi spec to controllers.

## Example usage

```
import { buildOpenapiExpress, API } from '@ponbike/openapi-express'

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
    staticFolder: 'public',
    limit: '100mb',
    poweredBy: 'Pon.Bike',
    loggerOptions: {
        level: 'info'
    }
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

### limit

The field `limit` should be a string, but is optional.
The default value is `100mb`.
It will set the the body parser limit, e.g. `app.use(bodyParser.json({ limit: '100mb' }))`.

### poweredBy

The field `poweredBy` should be a string, but is optional.
The default value is `Pon.Bike`.
It will set a header `X-Powered-By`.

[npm-url]: https://github.com/ponbike/openapi-express/actions/workflows/nodejs.yml
[npm-image]: https://github.com/ponbike/openapi-express/actions/workflows/nodejs.yml/badge.svg

[bugs-url]: https://sonarcloud.io/project/issues?id=ponbike_openapi-express&resolved=false&types=BUG
[bugs-image]: https://sonarcloud.io/api/project_badges/measure?project=ponbike_openapi-express&metric=bugs&token=9436b5f7e3253aa4fa251c41ab5ee65e585df0b8

[code-smells-url]: https://sonarcloud.io/project/issues?id=ponbike_openapi-express&resolved=false&types=CODE_SMELL
[code-smells-image]: https://sonarcloud.io/api/project_badges/measure?project=ponbike_openapi-express&metric=code_smells&token=9436b5f7e3253aa4fa251c41ab5ee65e585df0b8

[duplicate-lines-url]: https://sonarcloud.io/component_measures?id=ponbike_openapi-express&metric=duplicated_lines_density&view=list
[duplicate-lines-image]: https://sonarcloud.io/api/project_badges/measure?project=ponbike_openapi-express&metric=duplicated_lines_density&token=9436b5f7e3253aa4fa251c41ab5ee65e585df0b8

[maintainability-rate-url]: https://sonarcloud.io/project/issues?id=ponbike_openapi-express&resolved=false&types=CODE_SMELL
[maintainability-rate-image]: https://sonarcloud.io/api/project_badges/measure?project=ponbike_openapi-express&metric=sqale_rating&token=9436b5f7e3253aa4fa251c41ab5ee65e585df0b8

[reliability-rate-url]: https://sonarcloud.io/component_measures?id=ponbike_openapi-express&metric=Reliability
[reliability-rate-image]: https://sonarcloud.io/api/project_badges/measure?project=ponbike_openapi-express&metric=reliability_rating&token=9436b5f7e3253aa4fa251c41ab5ee65e585df0b8

[security-rate-url]: https://sonarcloud.io/project/security_hotspots?id=ponbike_openapi-express
[security-rate-image]: https://sonarcloud.io/api/project_badges/measure?project=ponbike_openapi-express&metric=security_rating&token=9436b5f7e3253aa4fa251c41ab5ee65e585df0b8

[technical-debt-url]: https://sonarcloud.io/component_measures?id=ponbike_openapi-express
[technical-debt-image]: https://sonarcloud.io/api/project_badges/measure?project=ponbike_openapi-express&metric=sqale_index&token=9436b5f7e3253aa4fa251c41ab5ee65e585df0b8

[vulnerabilitiest-url]: https://sonarcloud.io/project/issues?id=ponbike_openapi-express&resolved=false&types=VULNERABILITY
[vulnerabilitiest-image]: https://sonarcloud.io/api/project_badges/measure?project=ponbike_openapi-express&metric=vulnerabilities&token=9436b5f7e3253aa4fa251c41ab5ee65e585df0b8

[quality-gate-url]: https://sonarcloud.io/summary/new_code?id=ponbike_openapi-express
[quality-gate-image]: https://sonarcloud.io/api/project_badges/measure?project=ponbike_openapi-express&metric=alert_status&token=9436b5f7e3253aa4fa251c41ab5ee65e585df0b8

[coverage-url]: https://sonarcloud.io/component_measures?id=ponbike_openapi-express&metric=coverage&view=list
[coverage-image]: https://sonarcloud.io/api/project_badges/measure?project=ponbike_openapi-express&metric=coverage&token=9436b5f7e3253aa4fa251c41ab5ee65e585df0b8
